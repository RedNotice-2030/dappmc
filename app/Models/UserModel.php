<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table         = 'users';
    protected $primaryKey    = 'id';
    protected $useAutoIncrement = true;
    protected $returnType    = 'array';
    protected $useSoftDeletes = false;
    protected $allowedFields = [
        'username',
        'email',
        'password',
        'password_hash',
        'full_name',
        'role',
        'is_active',
        'last_login',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'username' => 'required|min_length[3]|max_length[50]|is_unique[users.username,id,{id}]',
        'email'    => 'required|valid_email|max_length[100]|is_unique[users.email,id,{id}]',
        'password' => 'required|min_length[6]',
    ];

    protected $validationMessages = [
        'username' => [
            'is_unique' => 'That username is already taken.',
        ],
        'email' => [
            'is_unique' => 'That email is already registered.',
        ],
    ];

    protected $beforeInsert = ['hashPassword'];
    protected $beforeUpdate = ['hashPassword'];

    /**
     * Hash the password before inserting or updating a record.
     *
     * @param array $data
     * @return array
     */
    protected function hashPassword(array $data): array
    {
        if (!isset($data['data']['password'])) {
            return $data;
        }

        $data['data']['password_hash'] = password_hash($data['data']['password'], PASSWORD_DEFAULT);
        unset($data['data']['password']);

        return $data;
    }

    /**
     * Verify credentials against the database.
     *
     * @param string $username
     * @param string $password
     * @return array|null  User record on success, null on failure.
     */
    public function authenticate(string $username, string $password): ?array
    {
        $user = $this->where('username', $username)
                     ->where('is_active', 1)
                     ->first();

        if ($user === null) {
            return null;
        }

        if (!password_verify($password, $user['password_hash'])) {
            return null;
        }

        // Update last login timestamp (skip validation — only updating last_login)
        $this->skipValidation(true);
        $this->update($user['id'], ['last_login' => date('Y-m-d H:i:s')]);
        $this->skipValidation(false);

        // Do not expose the password hash to the session
        unset($user['password_hash']);

        return $user;
    }

    /**
     * Find a user by ID without exposing the password hash.
     *
     * @param int|string $id
     * @return array|null
     */
    public function findPublic($id): ?array
    {
        $user = $this->find($id);
        if ($user !== null) {
            unset($user['password_hash']);
        }
        return $user;
    }
}