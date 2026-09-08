<?php

namespace App\Controllers;

use Config\Services;
use Config\Email as EmailConfig;

class Contact extends BaseController
{
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

        // ------------------------------------------------------------------
        // SMTP settings come from the .env file (email.SMTPHost, email.SMTPUser,
        // email.SMTPPass, ...) via CI4's config system — the same mechanism that
        // provides the database credentials. This keeps secrets out of the code.
        // ------------------------------------------------------------------
        $emailConfig = config(EmailConfig::class);

        $fromEmail = trim((string) $emailConfig->fromEmail);
        $smtpUser  = trim((string) $emailConfig->SMTPUser);
        $smtpPass  = (string) $emailConfig->SMTPPass;

        // Where the message should be delivered (configurable, falls back to a default).
        $defaultRecipient = trim((string) $emailConfig->recipients);
        if ($defaultRecipient === '') {
            $defaultRecipient = 'lanceverstappen30@gmail.com';
        }
        $recipient = trim((string) env('CONTACT_RECIPIENT', $defaultRecipient));

        if ($fromEmail === '' || $smtpUser === '' || $smtpPass === '') {
            log_message('error', 'Contact form: SMTP not configured (set email.SMTPUser/email.SMTPPass/email.fromEmail in .env).');

            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Email service is not configured yet. Please contact the administrator.',
            ]);
        }

        // Fresh instance (never mutate a shared singleton), applying config(Email)
        // which is populated from the email.* keys in .env.
        $email = Services::email(null, false);

        $email->protocol     = $emailConfig->protocol ?: 'smtp';
        $email->SMTPHost     = $emailConfig->SMTPHost;
        $email->SMTPPort     = $emailConfig->SMTPPort;
        $email->SMTPCrypto   = $emailConfig->SMTPCrypto;
        $email->SMTPUser     = $smtpUser;
        $email->SMTPPass     = $smtpPass;
        $email->SMTPTimeout  = max($emailConfig->SMTPTimeout, 10);
        $email->userAgent    = 'DAPPMC';

        $fromName = (string) $emailConfig->fromName;
        if (trim($fromName) === '') {
            $fromName = 'DAPPMC Cares';
        }

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

        if (!$email->send()) {
            $debugger = $email->printDebugger(['headers', 'subject', 'body']);
            log_message('error', 'Contact form email failed: ' . $debugger);

            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Failed to send your message. Please try again later or contact support directly.',
            ]);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Your message has been sent successfully!',
        ]);
    }
}