<?php

namespace App\Controllers;

use Config\Services;

class Careers extends BaseController
{
    /** Where applications get emailed to. */
    protected string $recipientEmail = 'lanceverstappen30@gmail.com'; // TODO: replace with your actual HR inbox

    public function apply()
    {
        if (!$this->request->isAJAX()) {
            return $this->response->setStatusCode(403)->setJSON([
                'success' => false,
                'message' => 'Direct access is not allowed.',
            ]);
        }

        $jobTitle = trim((string) $this->request->getPost('job_title'));
        $name     = trim((string) $this->request->getPost('name'));
        $contact  = trim((string) $this->request->getPost('contact'));
        $message  = trim((string) $this->request->getPost('message'));

        if ($name === '' || $contact === '') {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Name and email/contact number are required.',
            ]);
        }

        $resume = $this->request->getFile('resume');
        if ($resume === null || !$resume->isValid()) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Please attach your resume (PDF).',
            ]);
        }
        if ($resume->getExtension() !== 'pdf' && $resume->getClientMimeType() !== 'application/pdf') {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Resume must be a PDF file.',
            ]);
        }
        if ($resume->getSizeByUnit('mb') > 10) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Resume must be under 10MB.',
            ]);
        }

        $letter = $this->request->getFile('letter');
        $letterValid = $letter !== null && $letter->isValid() && $letter->getSize() > 0;
        if ($letterValid) {
            $allowedLetterExt = ['doc', 'docx'];
            $allowedLetterMime = [
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];
            if (!in_array($letter->getExtension(), $allowedLetterExt, true)
                && !in_array($letter->getClientMimeType(), $allowedLetterMime, true)) {
                return $this->response->setStatusCode(400)->setJSON([
                    'success' => false,
                    'message' => 'Application letter must be a Word document (.doc or .docx).',
                ]);
            }
            if ($letter->getSizeByUnit('mb') > 10) {
                return $this->response->setStatusCode(400)->setJSON([
                    'success' => false,
                    'message' => 'Application letter must be under 10MB.',
                ]);
            }
        }

        $email = Services::email();
        $email->setTo($this->recipientEmail);
        $email->setFrom('lanceverstappen30@gmail.com', 'DAPPMC Careers');
        if (filter_var($contact, FILTER_VALIDATE_EMAIL)) {
            $email->setReplyTo($contact, $name);
        }

        $subject = 'Job Application: ' . ($jobTitle !== '' ? $jobTitle : 'General') . ' — ' . $name;
        $email->setSubject($subject);

        $email->setMailType('html');
        $body = '<p>New job application received.</p>'
            . '<p><strong>Position:</strong> ' . esc($jobTitle !== '' ? $jobTitle : 'N/A') . '<br>'
            . '<strong>Name:</strong> ' . esc($name) . '<br>'
            . '<strong>Email/Contact:</strong> ' . esc($contact) . '</p>'
            . '<p><strong>Cover Message:</strong><br>' . nl2br(esc($message !== '' ? $message : '(none)')) . '</p>';
        $email->setMessage($body);

        $email->attach($resume->getTempName(), 'attachment', $resume->getClientName());
        if ($letterValid) {
            $email->attach($letter->getTempName(), 'attachment', $letter->getClientName());
        }

        if (!$email->send()) {
            log_message('error', 'Careers application email failed: ' . print_r($email->printDebugger(['headers']), true));
            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Failed to send your application. Please try again later.',
            ]);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Your application has been submitted successfully!',
        ]);
    }
}