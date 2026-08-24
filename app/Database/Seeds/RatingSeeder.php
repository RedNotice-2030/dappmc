<?php

namespace App\Database\Seeds;

use App\Models\RatingModel;
use CodeIgniter\Database\Seeder;

class RatingSeeder extends Seeder
{
    public function run()
    {
        $model = new RatingModel();

        if ($model->countAllResults() > 0) {
            return;
        }

        $rows = [
            [
                'patient_name'         => 'Margaret Okafor',
                'email'                => null,
                'department'           => 'Cardiology',
                'visit_date'           => date('Y-m-d', strtotime('-2 days')),
                'overall'              => 5,
                'staff_rating'         => 5,
                'cleanliness_rating'   => 5,
                'wait_rating'          => 4,
                'communication_rating' => 5,
                'comment'              => 'Dr. Reyes drew my echo results on paper so I could understand them. Nobody rushed me.',
                'would_recommend'      => 1,
                'reference_code'       => 'SA-K2M7',
            ],
            [
                'patient_name'         => 'Daniel Whitfield',
                'email'                => 'daniel@example.com',
                'department'           => 'Emergency',
                'visit_date'           => date('Y-m-d', strtotime('-3 days')),
                'overall'              => 4,
                'staff_rating'         => 5,
                'cleanliness_rating'   => 4,
                'wait_rating'          => 2,
                'communication_rating' => 4,
                'comment'              => 'The triage nurse kept me updated even when there was no news. The wait itself needs work.',
                'would_recommend'      => 1,
                'reference_code'       => 'SA-9TXP',
            ],
            [
                'patient_name'         => 'Priya Raman',
                'email'                => null,
                'department'           => 'Pediatrics',
                'visit_date'           => date('Y-m-d', strtotime('-5 days')),
                'overall'              => 5,
                'staff_rating'         => 5,
                'cleanliness_rating'   => 5,
                'wait_rating'          => 4,
                'communication_rating' => 5,
                'comment'              => 'The child-life specialist turned my daughter\'s IV into a spaceship mission.',
                'would_recommend'      => 1,
                'reference_code'       => 'SA-H4RD',
            ],
            [
                'patient_name'         => 'Helena Duarte',
                'email'                => 'helena@example.com',
                'department'           => 'General Medicine',
                'visit_date'           => date('Y-m-d', strtotime('-12 days')),
                'overall'              => 3,
                'staff_rating'         => 4,
                'cleanliness_rating'   => 3,
                'wait_rating'          => 2,
                'communication_rating' => 3,
                'comment'              => 'Treated kindly, but I sat 40 minutes past my appointment with zero explanation.',
                'would_recommend'      => 0,
                'reference_code'       => 'SA-D5SZ',
            ],
        ];

        foreach ($rows as $row) {
            $model->insert($row);
        }
    }
}
