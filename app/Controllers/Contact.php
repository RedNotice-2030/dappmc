<?php

namespace App\Controllers;

use Config\Services;

class Contact extends BaseController
{
    /** Where contact messages get emailed to. */
    protected string $recipientEmail = 'lanceverstappen30@gmail.com'; // TODO: replace with your actual inbox

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

        $email = Services::email();
        $email->setTo($this->recipientEmail);
        $email->setFrom(config('Email')->fromEmail, 'DAPPMC Cares');
        if (filter_var($contact, FILTER_VALIDATE_EMAIL)) {
            $email->setReplyTo($contact, $name);
        }

        $email->setSubject('Website Contact Message — ' . $name);

        $email->setMailType('html');
        $body = '<p>New message from the website contact form.</p>'
            . '<p><strong>Name:</strong> ' . esc($name) . '<br>'
            . '<strong>Email/Contact:</strong> ' . esc($contact) . '</p>'
            . '<p><strong>Message:</strong><br>' . nl2br(esc($message)) . '</p>';
        $email->setMessage($body);

        if (!$email->send()) {
            log_message('error', 'Contact form email failed: ' . print_r($email->printDebugger(['headers']), true));
            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Failed to send your message. Please try again later.',
            ]);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Your message has been sent successfully!',
        ]);
    }
}