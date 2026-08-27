<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DoctorSeeder extends Seeder
{
    public function run()
    {
        $table = $this->db->table('doctors');

        if ($table->countAllResults() > 0) {
            echo "Doctors table already has data. Seeder skipped.\n";
            return;
        }

        $jsonPath = FCPATH . 'assets/data/doctors.json';
        if (! is_file($jsonPath)) {
            echo "Doctor source JSON not found: {$jsonPath}\n";
            return;
        }

        $payload = json_decode((string) file_get_contents($jsonPath), true);
        $doctors = $payload['doctors'] ?? [];

        foreach ($doctors as $doctor) {
            $table->insert([
                'name'                 => $doctor['name'] ?? '',
                'specialization'       => $doctor['specialization'] ?? 'cardiology',
                'specialization_label' => $doctor['specializationLabel'] ?? null,
                'location'             => $doctor['location'] ?? '',
                'image'                => $doctor['image'] ?? '',
                'schedule'             => json_encode($doctor['schedule'] ?? []),
                'active'               => ! empty($doctor['active']) ? 1 : 0,
                'sort_order'           => (int) ($doctor['sortOrder'] ?? 0),
                'created_at'           => date('Y-m-d H:i:s'),
                'updated_at'           => date('Y-m-d H:i:s'),
            ]);
        }

        echo "Seeded " . count($doctors) . " doctors.\n";
    }
}