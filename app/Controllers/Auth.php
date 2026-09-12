<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;

class Auth extends BaseController
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

    public function login()
    {
        if (!$this->request->isAJAX()) {
            return $this->response->setStatusCode(403)->setJSON([
                'success' => false,
                'message' => 'Direct access is not allowed.',
            ]);
        }

        $username = trim((string) $this->request->getPost('username'));
        $password = (string) $this->request->getPost('password');

        if ($username === '' || $password === '') {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Username and password are required.',
            ]);
        }

        $existingUser = $this->userModel->where('username', $username)->first();

        if ($existingUser !== null && (int) $existingUser['is_active'] === 0) {
            return $this->response->setStatusCode(403)->setJSON([
                'success' => false,
                'message' => 'This account has been deactivated. Please contact the administrator.',
            ]);
        }

        $user = $this->userModel->authenticate($username, $password);

        if ($user === null) {
            return $this->response->setStatusCode(401)->setJSON([
                'success' => false,
                'message' => 'Invalid username or password.',
            ]);
        }

        $this->session->regenerate(true);

        $this->session->set([
            'is_logged_in' => true,
            'user_id'      => $user['id'],
            'username'     => $user['username'],
            'full_name'    => $user['full_name'] ?? '',
            'email'        => $user['email'],
            'role'         => $user['role'],
        ]);

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Login successful.',
            'user' => [
                'id'       => $user['id'],
                'username' => $user['username'],
                'full_name'=> $user['full_name'] ?? '',
                'role'     => $user['role'],
            ],
        ]);
    }

    public function changePassword()
    {
        if (!$this->request->isAJAX()) {
            return $this->response->setStatusCode(403)->setJSON([
                'success' => false,
                'message' => 'Direct access is not allowed.',
            ]);
        }

        // Must be logged in
        if ($this->session->get('is_logged_in') !== true) {
            return $this->response->setStatusCode(401)->setJSON([
                'success' => false,
                'message' => 'You must be logged in to change credentials.',
            ]);
        }

        $username = trim((string) $this->request->getPost('username'));
        $password = (string) $this->request->getPost('password');

        if ($username === '') {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Username is required.',
            ]);
        }
        if (strlen($password) < 6) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Password must be at least 6 characters.',
            ]);
        }

        $userId = $this->session->get('user_id');
        $user   = $this->userModel->find($userId);

        if ($user === null) {
            return $this->response->setStatusCode(404)->setJSON([
                'success' => false,
                'message' => 'User not found.',
            ]);
        }

        $existing = $this->userModel->where('username', $username)
                                    ->where('id !=', $userId)
                                    ->first();
        if ($existing !== null) {
            return $this->response->setStatusCode(409)->setJSON([
                'success' => false,
                'message' => 'That username is already taken.',
            ]);
        }

        $this->userModel->skipValidation(true);
        $this->userModel->update($userId, [
            'username' => $username,
            'password' => $password,
        ]);
        $this->userModel->skipValidation(false);

        $this->session->set('username', $username);

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Login credentials updated successfully.',
        ]);
    }

    public function logout()
    {
        $this->session->destroy();
        return $this->response->setJSON([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    public function check()
    {
        if ($this->session->get('is_logged_in') === true) {
            return $this->response->setJSON([
                'logged_in' => true,
                'user' => [
                    'id'        => $this->session->get('user_id'),
                    'username'  => $this->session->get('username'),
                    'full_name' => $this->session->get('full_name'),
                    'role'      => $this->session->get('role'),
                ],
            ]);
        }

        return $this->response->setJSON([
            'logged_in' => false,
        ]);
    }
}