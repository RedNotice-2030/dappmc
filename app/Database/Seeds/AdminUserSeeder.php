<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Default admin credentials:
        //   Username: admin
        //   Password: dappmc2026  (matches the original CMS default)
        $data = [
            'username'      => 'admin',
            'email'         => 'admin@dappmc.ph',
            'password'      => 'dappmc2026',
            'full_name'     => 'DAPPMC Administrator',
            'role'          => 'admin',
            'is_active'     => 1,
            'created_at'    => date('Y-m-d H:i:s'),
            'updated_at'    => date('Y-m-d H:i:s'),
        ];

        // Insert using the model so the password is hashed automatically
        $userModel = model('App\Models\UserModel');

        // Avoid duplicates: skip if the username already exists
        $existing = $userModel->where('username', 'admin')->first();
        if ($existing === null) {
            $userModel->insert($data);
            echo "Admin user created successfully.\n";
        } else {
            echo "Admin user already exists — skipping.\n";
        }
    }
}