<?php

namespace App\Controllers;

use Config\Services;
use Config\Email as EmailConfig;

class Contact extends BaseController
{
    /**
     * Resolve a SMTP setting, preferring the value from `config(Email)`
     * (populated from a local .env) and falling back to a plain environment
     * variable (e.g. set in Render's dashboard). That way the same code works
     * locally (where .env exists) and on Render (env vars only).
     */
    protected function pick(string $configValue, string $envKey, string $default = '')
    {
        $value = trim((string) $configValue);
        if ($value !== '') {
            return $value;
        }

        $envValue = (string) env($envKey, '');
        return $envValue !== '' ? $envValue : $default;
    }

    public function send()
    {
        if (!$this->request->isAJAX()) {
            return $this->response->setStatusCode(403)->setJSON([
                'success' => false,
                'message' => 'Direct access is not allowed.',
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

        // SMTP comes from .env (email.* keys) on localhost, or from plain env
        // vars on Render. We accept both so the app works in either place.
        $emailConfig = config(EmailConfig::class);

        $smtpHost  = $this->pick((string) $emailConfig->SMTPHost, 'SMTP_HOST', 'smtp.gmail.com');
        $smtpPort  = trim((string) $emailConfig->SMTPPort);
        if ($smtpPort === '') {
            $smtpPort = (string) env('SMTP_PORT', '587');
        }
        $smtpCrypto = $this->pick((string) $emailConfig->SMTPCrypto, 'SMTP_CRYPTO', 'tls');
        $smtpUser  = $this->pick((string) $emailConfig->SMTPUser, 'SMTP_USER');
        $smtpPass  = $this->pick((string) $emailConfig->SMTPPass, 'SMTP_PASS');

        $fromEmail = $this->pick((string) $emailConfig->fromEmail, 'SMTP_FROM_EMAIL', $smtpUser);
        $fromName  = $this->pick((string) $emailConfig->fromName, 'SMTP_FROM_NAME', 'DAPPMC Cares');

        $defaultRecipient = trim((string) $emailConfig->recipients);
        if ($defaultRecipient === '') {
            $defaultRecipient = 'lanceverstappen30@gmail.com';
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
            if (!$email->send()) {
                $debugger = $email->printDebugger(['responsecode', 'errstr', 'status']);
                log_message('error', 'Contact form email failed: ' . $debugger);

                return $this->response->setStatusCode(500)->setJSON([
                    'success' => false,
                    'message' => 'Failed to send your message. Please try again later or contact support directly.',
                ]);
            }
        } catch (\ErrorException $e) {
            log_message('error', 'Contact form SMTP exception: ' . $e->getMessage());

            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Failed to send your message. Please try again later or contact support directly. (' . $e->getMessage() . ')',
            ]);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Your message has been sent successfully!',
        ]);
    }
}