<?php

namespace App\Controllers;

use App\Models\DoctorModel;

class Doctors extends BaseController
{
    protected DoctorModel $doctorModel;
    /**
     * @var \CodeIgniter\Session\Session
     */
    protected $session;

    public function __construct()
    {
        $this->doctorModel = model(DoctorModel::class);
        $this->session     = service('session');
    }

    protected function requireAuth()
    {
        if (!$this->request->isAJAX()) {
            return $this->response->setStatusCode(403)->setJSON(['success' => false, 'message' => 'Direct access is not allowed.']);
        }

        if ($this->session->get('is_logged_in') !== true) {
            return $this->response->setStatusCode(401)->setJSON(['success' => false, 'message' => 'You must be logged in.']);
        }

        if ($this->session->get('role') === 'hr_manager') {
            return $this->response->setStatusCode(403)->setJSON(['success' => false, 'message' => 'You do not have permission to manage doctors.']);
        }

        return null;
    }

    /** Public — active doctors only, shaped like the old doctors.json. */
    public function publicList()
    {
        return $this->response->setJSON(['doctors' => $this->doctorModel->getActive()]);
    }

    public function index()
    {
        $guard = $this->requireAuth();
        if ($guard !== null) return $guard;

        return $this->response->setJSON(['success' => true, 'doctors' => $this->doctorModel->getAllForAdmin()]);
    }

    public function create()
    {
        $guard = $this->requireAuth();
        if ($guard !== null) return $guard;

        $data = $this->collectPostData();
        if ($data['name'] === '') {
            return $this->response->setStatusCode(400)->setJSON(['success' => false, 'message' => 'Doctor name is required.']);
        }

        // Sort order is assigned automatically (last order + 1)
        $maxSort = $this->doctorModel->selectMax('sort_order')->first()['sort_order'] ?? 0;
        $data['sort_order'] = $maxSort + 1;

        $id = $this->doctorModel->insert($data);

        return $this->response->setStatusCode(201)->setJSON(['success' => true, 'message' => 'Doctor created.', 'id' => $id]);
    }

    public function update(int $id)
    {
        $guard = $this->requireAuth();
        if ($guard !== null) return $guard;

        $existing = $this->doctorModel->find($id);
        if ($existing === null) {
            return $this->response->setStatusCode(404)->setJSON(['success' => false, 'message' => 'Doctor not found.']);
        }

        $data = $this->collectPostData();
        if ($data['name'] === '') {
            return $this->response->setStatusCode(400)->setJSON(['success' => false, 'message' => 'Doctor name is required.']);
        }

        // Sort order is not edited in the UI; preserve the existing value.
        if ($data['sort_order'] <= 0) {
            $data['sort_order'] = (int) ($existing['sort_order'] ?? 0);
        }

        $this->doctorModel->update($id, $data);

        return $this->response->setJSON(['success' => true, 'message' => 'Doctor updated.']);
    }

    public function setActive(int $id)
    {
        $guard = $this->requireAuth();
        if ($guard !== null) return $guard;

        $isActive = (int) $this->request->getPost('active');
        if ($isActive !== 0 && $isActive !== 1) {
            return $this->response->setStatusCode(400)->setJSON(['success' => false, 'message' => 'Invalid active state.']);
        }

        if ($this->doctorModel->find($id) === null) {
            return $this->response->setStatusCode(404)->setJSON(['success' => false, 'message' => 'Doctor not found.']);
        }

        $this->doctorModel->update($id, ['active' => $isActive]);

        $verb = $isActive ? 'activated' : 'deactivated';
        return $this->response->setJSON(['success' => true, 'message' => 'Doctor ' . $verb . '.']);
    }

    private function collectPostData(): array
    {
        $schedule = json_decode($this->request->getPost('schedule') ?? '[]', true) ?: [];
        $specialization = trim((string) $this->request->getPost('specialization')) ?: 'cardiology';
        $specializationLabel = trim((string) $this->request->getPost('specialization_label')) ?: ucwords(str_replace('-', ' ', $specialization));

        return [
            'name'                 => trim((string) $this->request->getPost('name')),
            'specialization'       => $specialization,
            'specialization_label' => $specializationLabel,
            'location'             => trim((string) $this->request->getPost('location')),
            'image'                => trim((string) $this->request->getPost('image')),
            'schedule'             => json_encode($schedule),
            'active'               => (int) $this->request->getPost('active') ? 1 : 0,
            'sort_order'           => (int) $this->request->getPost('sort_order'),
        ];
    }
}