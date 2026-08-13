<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class JobsSeeder extends Seeder
{
    public function run()
    {
        // Shared benefits (same 3 for every current job)
        $benefitIds = [];
        $benefitTexts = [
            'Competitive salary and comprehensive benefits package',
            'A supportive, collaborative, and people-friendly work environment',
            'Opportunities for professional development and continuous learning',
        ];
        foreach ($benefitTexts as $i => $text) {
            $benefitIds[] = $this->db->table('benefits')->insert([
                'benefit_text' => $text,
                'sort_order'   => $i + 1,
            ]) ? $this->db->insertID() : null;
        }

        $jobs = [
            [
                'title' => 'PT Aide',
                'employment_type' => 'full-time',
                'sort_order' => 1,
                'qualifications' => [
                    'NC-II in Health Care Holder',
                    'Good organizational and coordination skills',
                    'With or Without Experience',
                ],
            ],
            [
                'title' => 'Warehouse Staff',
                'employment_type' => 'full-time',
                'sort_order' => 2,
                'qualifications' => [
                    'Graduate or undergraduate of any business course',
                    'With experience of warehousing',
                    'With initiative, must know how to use basic computer',
                    'Strong personality, hardworking, honest and trustworthy',
                    'Preferably Male',
                ],
            ],
            [
                'title' => 'Staff Nurse',
                'employment_type' => 'full-time',
                'sort_order' => 3,
                'qualifications' => [
                    'Graduate of Bachelor of Science in Nursing (BSN)',
                    'With or Without Experience',
                    'Must be a licensed Registered Nurse (RN)',
                    'Must be knowledgeable, competent, and has a positive attitude',
                ],
            ],
            [
                'title' => 'Aircon Technician',
                'employment_type' => 'full-time',
                'sort_order' => 4,
                'qualifications' => [
                    'Graduate of Air Conditioning Technician Course or High School Graduate',
                    'At least one (1) year related experience',
                    'Preferably with TESDA Certificate of Training',
                ],
            ],
        ];

        foreach ($jobs as $job) {
            $this->db->table('jobs')->insert([
                'title'           => $job['title'],
                'employment_type' => $job['employment_type'],
                'active'          => 1,
                'sort_order'      => $job['sort_order'],
                'created_at'      => date('Y-m-d H:i:s'),
                'updated_at'      => date('Y-m-d H:i:s'),
            ]);
            $jobId = $this->db->insertID();

            foreach ($job['qualifications'] as $i => $q) {
                $this->db->table('job_qualifications')->insert([
                    'job_id'             => $jobId,
                    'qualification_text' => $q,
                    'sort_order'         => $i + 1,
                ]);
            }

            foreach ($benefitIds as $benefitId) {
                $this->db->table('job_benefits')->insert([
                    'job_id'     => $jobId,
                    'benefit_id' => $benefitId,
                ]);
            }
        }
    }
}