<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        $username  = trim((string) env('ADMIN_INITIAL_USERNAME', 'admin'));
        $email     = trim((string) env('ADMIN_INITIAL_EMAIL', 'admin@dappmc.ph'));
        $password  = trim((string) (env('ADMIN_INITIAL_PASSWORD') ?? ''));
        $generated = false;

        if ($password === '') {
            $password  = bin2hex(random_bytes(9)); // 18-char random password
            $generated = true;
        }

        $data = [
            'username'      => $username,
            'email'         => $email,
            'password'      => $password,
            'full_name'     => 'DAPPMC Administrator',
            'role'          => 'admin',
            'is_active'     => 1,
            'created_at'    => date('Y-m-d H:i:s'),
            'updated_at'    => date('Y-m-d H:i:s'),
        ];

        // Insert using the model so the password is hashed automatically
        $userModel = model('App\Models\UserModel');

        // Avoid duplicates: skip if the username already exists
        $existing = $userModel->where('username', $username)->first();
        if ($existing === null) {
            $userModel->insert($data);
            echo "Admin user '{$username}' created successfully.\n";
            if ($generated) {
                echo "IMPORTANT: No ADMIN_INITIAL_PASSWORD env var was set, so a\n";
                echo "random one-time password was generated:\n";
                echo "  Username: {$username}\n";
                echo "  Password: {$password}\n";
                echo "Please change it after your first login.\n";
            }
        } else {
            echo "Admin user already exists — skipping.\n";
        }
    }
}