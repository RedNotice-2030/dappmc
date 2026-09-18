<?php

namespace App\Controllers;

class Siteapp extends BaseController
{
    private const KNOWLEDGE_BASE_PATH = APPPATH . 'Knowledge/dappmc_clean_knowledge.txt';

    private const MODEL = 'claude-haiku-4-5-20251001';

    private const MAX_MESSAGE_LENGTH = 800;
    private const MAX_HISTORY_TURNS  = 8;

    public function ask()
    {
        $data = $this->request->getJSON(true);

        $message = trim($data['message'] ?? '');
        $history = is_array($data['history'] ?? null) ? $data['history'] : [];

        if ($message === '') {
            return $this->response->setJSON(['reply' => null, 'error' => 'empty_message']);
        }

        // Basic abuse guard — real rate limiting (per-IP/session) is worth
        // adding on top of this once you're live; CI4 has a built-in Throttler.
        if (mb_strlen($message) > self::MAX_MESSAGE_LENGTH) {
            $message = mb_substr($message, 0, self::MAX_MESSAGE_LENGTH);
        }

        $apiKey = getenv('ANTHROPIC_API_KEY');
        if (! $apiKey) {
            log_message('error', 'Siteapp: ANTHROPIC_API_KEY is not set');
            return $this->response->setJSON(['reply' => null, 'error' => 'not_configured']);
        }

        $knowledgeBase = $this->loadKnowledgeBase();
        if ($knowledgeBase === null) {
            log_message('error', 'Siteapp: knowledge base file missing at ' . self::KNOWLEDGE_BASE_PATH);
            return $this->response->setJSON(['reply' => null, 'error' => 'no_knowledge_base']);
        }

        $systemPrompt = $this->buildSystemPrompt($knowledgeBase);
        $messages     = $this->buildMessages($history, $message);

        $reply = $this->callAnthropic($apiKey, $systemPrompt, $messages);

        if ($reply === null) {
            // Let the widget fall back to its local keyword match instead of
            // showing a raw error to the visitor.
            return $this->response->setStatusCode(502)->setJSON(['reply' => null, 'error' => 'upstream_failed']);
        }

        return $this->response->setJSON(['reply' => $reply]);
    }

    private function loadKnowledgeBase(): ?string
    {
        if (! is_file(self::KNOWLEDGE_BASE_PATH)) {
            return null;
        }

        return file_get_contents(self::KNOWLEDGE_BASE_PATH) ?: null;
    }

    private function buildSystemPrompt(string $knowledgeBase): string
    {
        return "You are DAPPMC Chat, a friendly assistant for Dr. Arturo P. Pingoy Medical Center (DAPPMC).\n\n"
            . "Answer the visitor's question using ONLY the information in the knowledge base below. "
            . "Keep answers concise (a few sentences, or a short bulleted list for multi-part answers). "
            . "Use a warm, helpful tone appropriate for a hospital's patients and visitors.\n\n"
            . "If the answer is not contained in the knowledge base, say exactly: "
            . "\"I don't have that information on hand — please use the Email us button above and our team "
            . "will get back to you.\" Do not guess, and do not invent phone numbers, names, prices, or hours "
            . "that aren't in the knowledge base below.\n\n"
            . "Never mention that you are an AI, a language model, or that you were given a \"knowledge base\" "
            . "— just answer naturally as DAPPMC's assistant.\n\n"
            . "--- KNOWLEDGE BASE START ---\n"
            . $knowledgeBase
            . "\n--- KNOWLEDGE BASE END ---";
    }

    private function buildMessages(array $history, string $message): array
    {
        $messages = [];

        // Trim to the last N turns and coerce to the {role, content} shape
        // the API expects, dropping anything malformed.
        $recent = array_slice($history, -self::MAX_HISTORY_TURNS);
        foreach ($recent as $turn) {
            $role    = $turn['role']    ?? null;
            $content = $turn['content'] ?? null;
            if (in_array($role, ['user', 'assistant'], true) && is_string($content) && $content !== '') {
                $messages[] = ['role' => $role, 'content' => $content];
            }
        }

        $messages[] = ['role' => 'user', 'content' => $message];

        return $messages;
    }

    private function callAnthropic(string $apiKey, string $systemPrompt, array $messages): ?string
    {
        $payload = [
            'model'      => self::MODEL,
            'max_tokens' => 500,
            'system'     => $systemPrompt,
            'messages'   => $messages,
        ];

        $ch = curl_init('https://api.anthropic.com/v1/messages');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_HTTPHEADER     => [
                'content-type: application/json',
                'x-api-key: ' . $apiKey,
                'anthropic-version: 2023-06-01',
            ],
            CURLOPT_TIMEOUT        => 20,
        ]);

        $raw       = curl_exec($ch);
        $curlError = curl_error($ch);
        $status    = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($raw === false) {
            log_message('error', 'Siteapp: curl error calling Anthropic API: ' . $curlError);
            return null;
        }

        $decoded = json_decode($raw, true);

        if ($status !== 200 || ! isset($decoded['content'][0]['text'])) {
            log_message('error', 'Siteapp: Anthropic API returned status ' . $status . ': ' . $raw);
            return null;
        }

        return trim($decoded['content'][0]['text']);
    }
}
