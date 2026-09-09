<?php

namespace App\Controllers;

use Config\Services;
use Config\Email as EmailConfig;

class Contact extends BaseController
{
    protected function resolve(string $configValue, string $dottedKey, string $plainKey, string $default = '')
    {
        $value = trim((string) $configValue);
        if ($value !== '') {
            return $value;
        }

        $dotted = trim((string) env($dottedKey, ''));
        if ($dotted !== '') {
            return $dotted;
        }

        $plain = trim((string) env($plainKey, ''));
        return $plain !== '' ? $plain : $default;
    }

    public function send()
    {
        if (!$this->request->isAJAX()) {
            return $this->response->setStatusCode(403)->setJSON([
                'success' => false,
                'message' => 'Direct access is not allowed.',
            ]);
        }

        // Temporary debug endpoint - remove after fixing
        if ($this->request->getGet('debug') === 'env') {
            $emailConfig = config(EmailConfig::class);
            return $this->response->setJSON([
                'smtp_host_config' => (string) $emailConfig->SMTPHost,
                'smtp_user_config' => (string) $emailConfig->SMTPUser,
                'smtp_pass_config' => ((string) $emailConfig->SMTPPass) !== '' ? 'SET' : 'EMPTY',
                'env_smtp_host' => getenv('SMTP_HOST') ?: 'NOT_FOUND',
                'env_smtp_user' => getenv('SMTP_USER') ?: 'NOT_FOUND',
                'env_smtp_pass' => getenv('SMTP_PASS') ? 'SET' : 'NOT_FOUND',
                'server_smtp_host' => $_SERVER['SMTP_HOST'] ?? 'NOT_FOUND',
                'server_smtp_user' => $_SERVER['SMTP_USER'] ?? 'NOT_FOUND',
                'env_superglobal' => $_ENV['SMTP_USER'] ?? 'NOT_FOUND',
                'variables_order' => ini_get('variables_order'),
                'has_getenv' => function_exists('getenv'),
            ]);
        }

        $name    = trim((string) $this->request->getPost('name'));
        $contact = trim((string) $this->request->getPost('contact'));
        $message = trim((string) $this->request->getPost('message'));

        if ($name === '' || $contact === '' || $message === '') {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Please fill in your name, email/contact, and message.',
            ]);
        }

        $emailConfig = config(EmailConfig::class);

        $smtpHost  = $this->resolve((string) $emailConfig->SMTPHost,   'email.SMTPHost',   'SMTP_HOST',   'smtp.gmail.com');
        $smtpCrypto = $this->resolve((string) $emailConfig->SMTPCrypto, 'email.SMTPCrypto', 'SMTP_CRYPTO', 'tls');
        $smtpUser  = $this->resolve((string) $emailConfig->SMTPUser,   'email.SMTPUser',   'SMTP_USER');
        $smtpPass  = $this->resolve((string) $emailConfig->SMTPPass,   'email.SMTPPass',   'SMTP_PASS');
        $fromEmail = $this->resolve((string) $emailConfig->fromEmail,  'email.fromEmail',  'SMTP_FROM_EMAIL', $smtpUser);
        $fromName  = $this->resolve((string) $emailConfig->fromName,   'email.fromName',   'SMTP_FROM_NAME',  'DAPPMC Cares');

        $smtpPort = trim((string) $emailConfig->SMTPPort);
        if ($smtpPort === '') {
            $smtpPort = trim((string) env('email.SMTPPort', ''));
        }
        if ($smtpPort === '') {
            $smtpPort = trim((string) env('SMTP_PORT', ''));
        }
        if ($smtpPort === '') {
            $smtpPort = '587';
        }

        $defaultRecipient = trim((string) $emailConfig->recipients);
        if ($defaultRecipient === '') {
            $defaultRecipient = 'lanceverstappen30@gmail.com'; // TODO: replace with your actual HR inbox
        }
        $recipient = trim((string) env('CONTACT_RECIPIENT', $defaultRecipient));

        if ($fromEmail === '' || $smtpUser === '' || $smtpPass === '') {
            log_message('error', 'Contact form: SMTP not configured. Need SMTP_USER/SMTP_PASS (or email.* in .env).');

            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Email service is not configured yet. Please contact the administrator.',
            ]);
        }

        $email = Services::email(null, false);

        $email->protocol    = 'smtp';
        $email->SMTPHost    = $smtpHost;
        $email->SMTPPort    = (int) $smtpPort;
        $email->SMTPCrypto  = $smtpCrypto;
        $email->SMTPUser    = $smtpUser;
        $email->SMTPPass    = $smtpPass;
        $email->SMTPTimeout = 15;
        $email->userAgent   = 'DAPPMC';

        $email->setFrom($fromEmail, $fromName);
        $email->setTo($recipient);
        $email->setSubject('Website Contact Message — ' . $name);
        $email->setMailType('html');

        if (filter_var($contact, FILTER_VALIDATE_EMAIL)) {
            $email->setReplyTo($contact, $name);
        }

        $body = '<p>New message from the website contact form.</p>'
            . '<p><strong>Name:</strong> ' . esc($name) . '<br>'
            . '<strong>Email/Contact:</strong> ' . esc($contact) . '</p>'
            . '<p><strong>Message:</strong><br>' . nl2br(esc($message)) . '</p>';
        $email->setMessage($body);

        try {
            $sendOk = $email->send();
        } catch (\Throwable $e) {
            log_message('error', 'Contact form SMTP exception: ' . $e::class . ' ' . $e->getMessage());

            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Failed to send your message. Please try again later or contact support directly.',
                'detail'  => $e->getMessage(),
            ]);
        }

        if (!$sendOk) {
            $debugger = $email->printDebugger();
            log_message('error', 'Contact form email failed: ' . $debugger);

            $detail = (string) preg_replace('/<[^>]+>/', '', $debugger);
            $detail = str_replace(["\r\n", "\n"], ' ', trim($detail));
            if (strlen($detail) > 400) {
                $detail = substr($detail, 0, 400) . '…';
            }

            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Failed to send your message. Please try again later or contact support directly.',
                'detail'  => $detail,
            ]);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Your message has been sent successfully!',
        ]);
    }
}