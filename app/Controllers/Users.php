<?php

namespace App\Controllers;

use App\Models\UserModel;

class Users extends BaseController
{
    protected UserModel $userModel;
    /**
     * @var \CodeIgniter\Session\Session
     */
    protected $session;

    public function __construct()
    {
        $this->userModel = model(UserModel::class);
        $this->session   = service('session');
    }

    /**
     * Guard: only allow AJAX requests from logged-in admins.
     */
    protected function requireAdmin()
    {
        if (!$this->request->isAJAX()) {
            return $this->response->setStatusCode(403)->setJSON([
                'success' => false,
                'message' => 'Direct access is not allowed.',
            ]);
        }

        if ($this->session->get('is_logged_in') !== true) {
            return $this->response->setStatusCode(401)->setJSON([
                'success' => false,
                'message' => 'You must be logged in to manage users.',
            ]);
        }

        if ($this->session->get('role') !== 'admin') {
            return $this->response->setStatusCode(403)->setJSON([
                'success' => false,
                'message' => 'Only administrator accounts can manage users.',
            ]);
        }

        return null;
    }

    /**
     * List all users.
     */
    public function index()
    {
        $guard = $this->requireAdmin();
        if ($guard !== null) return $guard;

        $users = $this->userModel
            ->select('id, username, email, full_name, role, is_active, last_login, created_at')
            ->orderBy('id', 'ASC')
            ->findAll();

        // Cast is_active to integer for clean JSON handling
        foreach ($users as &$user) {
            $user['is_active'] = (int) $user['is_active'];
        }

        return $this->response->setJSON([
            'success' => true,
            'users'   => $users,
        ]);
    }

    /**
     * Create a new user.
     */
    public function create()
    {
        $guard = $this->requireAdmin();
        if ($guard !== null) return $guard;

        $username = trim((string) $this->request->getPost('username'));
        $email    = trim((string) $this->request->getPost('email'));
        $password = (string) $this->request->getPost('password');
        $fullName = trim((string) $this->request->getPost('full_name'));
        $role     = trim((string) $this->request->getPost('role')) ?: 'admin';
        $isActive = (int) $this->request->getPost('is_active');
        if ($isActive !== 0 && $isActive !== 1) {
            $isActive = 1;
        }

        // Basic validation
        if ($username === '' || $email === '' || $password === '') {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Username, email, and password are required.',
            ]);
        }
        if (strlen($password) < 6) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Password must be at least 6 characters.',
            ]);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Please provide a valid email address.',
            ]);
        }

        // Check duplicates
        if ($this->userModel->where('username', $username)->first() !== null) {
            return $this->response->setStatusCode(409)->setJSON([
                'success' => false,
                'message' => 'That username is already taken.',
            ]);
        }
        if ($this->userModel->where('email', $email)->first() !== null) {
            return $this->response->setStatusCode(409)->setJSON([
                'success' => false,
                'message' => 'That email is already registered.',
            ]);
        }

        $this->userModel->skipValidation(true);
        $id = $this->userModel->insert([
            'username'      => $username,
            'email'         => $email,
            'password'      => $password,
            'full_name'     => $fullName,
            'role'          => $role,
            'is_active'     => $isActive,
            'created_at'    => date('Y-m-d H:i:s'),
            'updated_at'    => date('Y-m-d H:i:s'),
        ]);
        $this->userModel->skipValidation(false);

        if ($id === false) {
            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Failed to create user.',
            ]);
        }

        return $this->response->setStatusCode(201)->setJSON([
            'success' => true,
            'message' => 'User created successfully.',
            'user'    => [
                'id'         => $id,
                'username'   => $username,
                'email'      => $email,
                'full_name'  => $fullName,
                'role'       => $role,
                'is_active'  => $isActive,
                'last_login' => null,
                'created_at' => date('Y-m-d H:i:s'),
            ],
        ]);
    }

    /**
     * Update an existing user (username, email, full name, role, password).
     */
    public function update(int $id)
    {
        $guard = $this->requireAdmin();
        if ($guard !== null) return $guard;

        $user = $this->userModel->find($id);
        if ($user === null) {
            return $this->response->setStatusCode(404)->setJSON([
                'success' => false,
                'message' => 'User not found.',
            ]);
        }

        $username = trim((string) $this->request->getPost('username'));
        $email    = trim((string) $this->request->getPost('email'));
        $fullName = trim((string) $this->request->getPost('full_name'));
        $role     = trim((string) $this->request->getPost('role')) ?: $user['role'];
        $password = (string) $this->request->getPost('password');
        $isActive = (int) $this->request->getPost('is_active');
        if ($isActive !== 0 && $isActive !== 1) {
            $isActive = (int) $user['is_active'];
        }

        if ($username === '' || $email === '') {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Username and email are required.',
            ]);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Please provide a valid email address.',
            ]);
        }
        if ($password !== '' && strlen($password) < 6) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Password must be at least 6 characters.',
            ]);
        }

        // Uniqueness checks (exclude current user)
        $dupUser = $this->userModel->where('username', $username)->where('id !=', $id)->first();
        if ($dupUser !== null) {
            return $this->response->setStatusCode(409)->setJSON([
                'success' => false,
                'message' => 'That username is already taken.',
            ]);
        }
        $dupEmail = $this->userModel->where('email', $email)->where('id !=', $id)->first();
        if ($dupEmail !== null) {
            return $this->response->setStatusCode(409)->setJSON([
                'success' => false,
                'message' => 'That email is already registered.',
            ]);
        }

        $data = [
            'username'   => $username,
            'email'      => $email,
            'full_name'  => $fullName,
            'role'       => $role,
            'is_active'  => $isActive,
        ];
        if ($password !== '') {
            $data['password'] = $password;
        }

        $this->userModel->skipValidation(true);
        $this->userModel->update($id, $data);
        $this->userModel->skipValidation(false);

        // If the current user updated their own username, update the session
        if ((int) $id === (int) $this->session->get('user_id')) {
            $this->session->set('username', $username);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'User updated successfully.',
            'user'    => [
                'id'        => $id,
                'username'  => $username,
                'email'     => $email,
                'full_name' => $fullName,
                'role'      => $role,
                'is_active' => $isActive,
            ],
        ]);
    }

    /**
     * Set a user active/inactive (deactivate/reactivate).
     */
    public function setActive(int $id)
    {
        $guard = $this->requireAdmin();
        if ($guard !== null) return $guard;

        $isActive = (int) $this->request->getPost('is_active');
        if ($isActive !== 0 && $isActive !== 1) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Invalid active state.',
            ]);
        }

        $user = $this->userModel->find($id);
        if ($user === null) {
            return $this->response->setStatusCode(404)->setJSON([
                'success' => false,
                'message' => 'User not found.',
            ]);
        }

        // Prevent deactivating yourself while logged in
        if ((int) $id === (int) $this->session->get('user_id') && $isActive === 0) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'You cannot deactivate your own account.',
            ]);
        }

        $this->userModel->skipValidation(true);
        $this->userModel->update($id, ['is_active' => $isActive]);
        $this->userModel->skipValidation(false);

        $verb = $isActive ? 'activated' : 'deactivated';
        return $this->response->setJSON([
            'success' => true,
            'message' => 'User ' . $verb . ' successfully.',
        ]);
    }
}