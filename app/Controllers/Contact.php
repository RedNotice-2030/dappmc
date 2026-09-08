<?php

namespace App\Controllers;

use Config\Services;

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
        // SMTP is configured at runtime from environment variables, so the
        // credentials stay out of the repository. On Render, set:
        //   SMTP_USER  -> the Gmail address
        //   SMTP_PASS  -> the Gmail App Password
        //   (optional) SMTP_HOST, SMTP_PORT, SMTP_FROM_EMAIL, CONTACT_RECIPIENT
        // ------------------------------------------------------------------
        $smtpUser = (string) env('SMTP_USER', '');
        $smtpPass = (string) env('SMTP_PASS', '');
        $fromEmail = (string) env('SMTP_FROM_EMAIL', $smtpUser);
        $recipient = (string) env('CONTACT_RECIPIENT', 'lanceverstappen30@gmail.com');

        if ($fromEmail === '' || $smtpUser === '' || $smtpPass === '') {
            log_message('error', 'Contact form: SMTP not configured (set SMTP_USER and SMTP_PASS env vars).');

            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Email service is not configured yet. Please contact the administrator.',
            ]);
        }

        // Always build a fresh instance so we never mutate a shared singleton.
        $email = Services::email(null, false);

        // SMTP transport (Gmail-compatible).
        $email->protocol     = 'smtp';
        $email->SMTPHost     = (string) env('SMTP_HOST', 'smtp.gmail.com');
        $email->SMTPPort     = (int) env('SMTP_PORT', 587);
        $email->SMTPCrypto   = (string) env('SMTP_CRYPTO', 'tls');
        $email->SMTPUser     = $smtpUser;
        $email->SMTPPass     = $smtpPass;
        $email->SMTPTimeout  = (int) env('SMTP_TIMEOUT', 10);
        $email->userAgent    = 'DAPPMC';

        $fromName = (string) env('SMTP_FROM_NAME', 'DAPPMC Cares');
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