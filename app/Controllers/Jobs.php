<?php

namespace App\Controllers;

use App\Models\JobModel;

class Jobs extends BaseController
{
    protected JobModel $jobModel;
    /**
     * @var \CodeIgniter\Session\Session
     */
    protected $session;

    public function __construct()
    {
        $this->jobModel = model(JobModel::class);
        $this->session   = service('session');
    }

    protected function requireHrOrAdmin()
    {
        if (!$this->request->isAJAX()) {
            return $this->response->setStatusCode(403)->setJSON(['success' => false, 'message' => 'Direct access is not allowed.']);
        }
        if ($this->session->get('is_logged_in') !== true) {
            return $this->response->setStatusCode(401)->setJSON(['success' => false, 'message' => 'You must be logged in.']);
        }
        $role = $this->session->get('role');
        if (!in_array($role, ['admin', 'hr_manager'], true)) {
            return $this->response->setStatusCode(403)->setJSON(['success' => false, 'message' => 'You do not have permission to manage jobs.']);
        }
        return null;
    }

    /**
     * Public endpoint — active jobs only, shaped like the old jobs.json.
     * Used by content-renderer.js on careers.html.
     */
    public function publicList()
    {
        return $this->response->setJSON(['jobs' => $this->jobModel->getAssembled(true)]);
    }

    /**
     * Admin list — all jobs (active + inactive), for the CMS panel.
     */
    public function index()
    {
        $guard = $this->requireHrOrAdmin();
        if ($guard !== null) return $guard;

        return $this->response->setJSON([
            'success' => true,
            'jobs'    => $this->jobModel->getAssembled(false),
        ]);
    }

    public function create()
    {
        $guard = $this->requireHrOrAdmin();
        if ($guard !== null) return $guard;

        $title = trim((string) $this->request->getPost('title'));
        $type  = trim((string) $this->request->getPost('employment_type')) ?: 'full-time';
        $active = (int) $this->request->getPost('active') ? 1 : 0;
        $qualifications = json_decode($this->request->getPost('qualifications') ?? '[]', true) ?: [];
        $benefitIds     = json_decode($this->request->getPost('benefit_ids') ?? '[]', true) ?: [];

        if ($title === '') {
            return $this->response->setStatusCode(400)->setJSON(['success' => false, 'message' => 'Job title is required.']);
        }

        $maxSort = $this->jobModel->db->table('jobs')->selectMax('sort_order')->get()->getRow('sort_order') ?? 0;
        $sort = $maxSort + 1;

        $jobId = $this->jobModel->insert([
            'title'           => $title,
            'employment_type' => $type,
            'active'          => $active,
            'sort_order'      => $sort,
        ]);

        foreach ($qualifications as $i => $q) {
            $q = trim((string) $q);
            if ($q === '') continue;
            $this->jobModel->db->table('job_qualifications')->insert([
                'job_id' => $jobId, 'qualification_text' => $q, 'sort_order' => $i + 1,
            ]);
        }
        foreach ($benefitIds as $bid) {
            $this->jobModel->db->table('job_benefits')->insert(['job_id' => $jobId, 'benefit_id' => (int) $bid]);
        }

        return $this->response->setStatusCode(201)->setJSON(['success' => true, 'message' => 'Job created.', 'id' => $jobId]);
    }

    public function update(int $id)
    {
        $guard = $this->requireHrOrAdmin();
        if ($guard !== null) return $guard;

        $job = $this->jobModel->find($id);
        if ($job === null) {
            return $this->response->setStatusCode(404)->setJSON(['success' => false, 'message' => 'Job not found.']);
        }

        $title = trim((string) $this->request->getPost('title'));
        $type  = trim((string) $this->request->getPost('employment_type')) ?: $job['employment_type'];
        $sort  = (int) $this->request->getPost('sort_order') ?: $job['sort_order'];
        $active = (int) $this->request->getPost('active') ? 1 : 0;
        $qualifications = json_decode($this->request->getPost('qualifications') ?? '[]', true) ?: [];
        $benefitIds     = json_decode($this->request->getPost('benefit_ids') ?? '[]', true) ?: [];

        if ($title === '') {
            return $this->response->setStatusCode(400)->setJSON(['success' => false, 'message' => 'Job title is required.']);
        }

        $this->jobModel->update($id, [
            'title' => $title, 'employment_type' => $type, 'active' => $active, 'sort_order' => $sort,
        ]);

        $this->jobModel->db->table('job_qualifications')->where('job_id', $id)->delete();
        foreach ($qualifications as $i => $q) {
            $q = trim((string) $q);
            if ($q === '') continue;
            $this->jobModel->db->table('job_qualifications')->insert([
                'job_id' => $id, 'qualification_text' => $q, 'sort_order' => $i + 1,
            ]);
        }

        $this->jobModel->db->table('job_benefits')->where('job_id', $id)->delete();
        foreach ($benefitIds as $bid) {
            $this->jobModel->db->table('job_benefits')->insert(['job_id' => $id, 'benefit_id' => (int) $bid]);
        }

        return $this->response->setJSON(['success' => true, 'message' => 'Job updated.']);
    }

    public function setActive(int $id)
    {
        $guard = $this->requireHrOrAdmin();
        if ($guard !== null) return $guard;

        $isActive = (int) $this->request->getPost('active');
        if ($isActive !== 0 && $isActive !== 1) {
            return $this->response->setStatusCode(400)->setJSON(['success' => false, 'message' => 'Invalid active state.']);
        }

        if ($this->jobModel->find($id) === null) {
            return $this->response->setStatusCode(404)->setJSON(['success' => false, 'message' => 'Job not found.']);
        }

        $this->jobModel->update($id, ['active' => $isActive]);

        $verb = $isActive ? 'activated' : 'deactivated';
        return $this->response->setJSON(['success' => true, 'message' => 'Job ' . $verb . ' successfully.']);
    }

    /**
     * List all benefits (for the CMS checkbox picker).
     */
    public function benefitsList()
    {
        $guard = $this->requireHrOrAdmin();
        if ($guard !== null) return $guard;

        return $this->response->setJSON([
            'success'  => true,
            'benefits' => $this->jobModel->db->table('benefits')->orderBy('sort_order', 'ASC')->get()->getResultArray(),
        ]);
    }
    
    public function createBenefit()
    {
        $guard = $this->requireHrOrAdmin();
        if ($guard !== null) return $guard;

        $text = trim((string) $this->request->getPost('benefit_text'));
        if ($text === '') {
            return $this->response->setStatusCode(400)->setJSON(['success' => false, 'message' => 'Benefit text is required.']);
        }

        $maxSort = $this->jobModel->db->table('benefits')->selectMax('sort_order')->get()->getRow('sort_order') ?? 0;

        $id = $this->jobModel->db->table('benefits')->insert([
            'benefit_text' => $text,
            'sort_order'   => $maxSort + 1,
        ]) ? $this->jobModel->db->insertID() : null;

        if ($id === null) {
            return $this->response->setStatusCode(500)->setJSON(['success' => false, 'message' => 'Failed to create benefit.']);
        }

        return $this->response->setStatusCode(201)->setJSON(['success' => true, 'id' => $id, 'benefit_text' => $text]);
    }
}