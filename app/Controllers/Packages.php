<?php

namespace App\Controllers;

use App\Models\PackageModel;

class Packages extends BaseController
{
    protected PackageModel $packageModel;
    /**
     * @var \CodeIgniter\Session\Session
     */
    protected $session;

    public function __construct()
    {
        $this->packageModel = model(PackageModel::class);
        $this->session       = service('session');
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
            return $this->response->setStatusCode(403)->setJSON(['success' => false, 'message' => 'You do not have permission to manage packages.']);
        }
        return null;
    }

    /** Public — active packages only, shaped like the old packages.json */
    public function publicList()
    {
        return $this->response->setJSON(['packages' => $this->packageModel->getActive()]);
    }

    public function index()
    {
        $guard = $this->requireAuth();
        if ($guard !== null) return $guard;

        return $this->response->setJSON(['success' => true, 'packages' => $this->packageModel->getAllForAdmin()]);
    }

    public function create()
    {
        $guard = $this->requireAuth();
        if ($guard !== null) return $guard;

        $data = $this->collectPostData();
        if ($data['name'] === '' || $data['short_description'] === '') {
            return $this->response->setStatusCode(400)->setJSON(['success' => false, 'message' => 'Name and short description are required.']);
        }

        $maxSort = $this->packageModel->selectMax('sort_order')->first()['sort_order'] ?? 0;
        $data['sort_order'] = $maxSort + 1;

        $id = $this->packageModel->insert($data);
        return $this->response->setStatusCode(201)->setJSON(['success' => true, 'message' => 'Package created.', 'id' => $id]);
    }

    public function update(int $id)
    {
        $guard = $this->requireAuth();
        if ($guard !== null) return $guard;

        if ($this->packageModel->find($id) === null) {
            return $this->response->setStatusCode(404)->setJSON(['success' => false, 'message' => 'Package not found.']);
        }

        $data = $this->collectPostData();
        if ($data['name'] === '' || $data['short_description'] === '') {
            return $this->response->setStatusCode(400)->setJSON(['success' => false, 'message' => 'Name and short description are required.']);
        }

        $this->packageModel->update($id, $data);
        return $this->response->setJSON(['success' => true, 'message' => 'Package updated.']);
    }

    public function setActive(int $id)
    {
        $guard = $this->requireAuth();
        if ($guard !== null) return $guard;

        $isActive = (int) $this->request->getPost('active');
        if ($this->packageModel->find($id) === null) {
            return $this->response->setStatusCode(404)->setJSON(['success' => false, 'message' => 'Package not found.']);
        }

        $this->packageModel->update($id, ['active' => $isActive ? 1 : 0]);
        $verb = $isActive ? 'activated' : 'deactivated';
        return $this->response->setJSON(['success' => true, 'message' => 'Package ' . $verb . '.']);
    }

    private function collectPostData(): array
    {
        $steps    = json_decode($this->request->getPost('availment_steps') ?? '[]', true) ?: [];
        $payments = json_decode($this->request->getPost('payment_options') ?? '[]', true) ?: [];
        $expiresAt = trim((string) $this->request->getPost('promo_expires_at'));

        return [
            'name'              => trim((string) $this->request->getPost('name')),
            'short_description' => trim((string) $this->request->getPost('short_description')),
            'full_description'  => trim((string) $this->request->getPost('full_description')),
            'image'             => trim((string) $this->request->getPost('image')),
            'promo_badge'       => trim((string) $this->request->getPost('promo_badge')),
            'promo_details'     => trim((string) $this->request->getPost('promo_details')),
            'promo_expires_at'  => $expiresAt !== '' ? $expiresAt : null,
            'operating_hours'   => trim((string) $this->request->getPost('operating_hours')),
            'availment_steps'   => json_encode($steps),
            'payment_options'   => json_encode($payments),
            'active'            => (int) $this->request->getPost('active') ? 1 : 0,
        ];
    }
}