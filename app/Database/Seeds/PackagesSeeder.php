<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class PackagesSeeder extends Seeder
{
    public function run()
    {
        $packages = [
            [
                'name' => "Women's Health Package",
                'short_description' => 'Includes Lipid Profile, Urinalysis, Pap Smear, 12-Lead ECG, and Breast Ultrasound.',
                'full_description' => "Avail our August Women's Health promo package valid until August 31, 2026 only.",
                'image' => 'assets/images/packages/whp1.jpg',
                'promo_badge' => '20% OFF',
                'promo_details' => 'Promo valid Aug 1–31, 2026 · Cash transactions only',
                'operating_hours' => '8:00am to 5:00pm, Mondays to Fridays.',
                'availment_steps' => json_encode([
                    'Contact DAPPMC Information landline at 228-2202 or mobile number 09499946474.',
                    'The information staff will assist your schedule and book accordingly.',
                    'The information staff will provide preparation guidelines and ask for the PWD/Senior Citizen ID Number if the client is a PWD/Senior Citizen.',
                ]),
                'payment_options' => json_encode([
                    'Pay in cash', 'Pay online via online banking payment schemes',
                    'Pay through GCash or PayMaya', 'Email the proof of payment to dchi.accounting@yahoo.com',
                ]),
                'active' => 1, 'sort_order' => 1,
            ],
            [
                'name' => 'Thyroid Health Package',
                'short_description' => 'Includes Neck Ultrasound, TSH, T3, and T4.',
                'full_description' => 'Avail our August Thyroid Health promo package valid until August 31, 2026 only.',
                'image' => 'assets/images/packages/thp1.jpg',
                'promo_badge' => '20% OFF',
                'promo_details' => 'Promo valid Aug 1–31, 2026 · Cash transactions only',
                'operating_hours' => '8:00am to 5:00pm, Mondays to Fridays.',
                'availment_steps' => json_encode([
                    'Contact DAPPMC Information landline at 228-2202 or mobile number 09499946474.',
                    'The information staff will assist your schedule and book accordingly.',
                    'The information staff will provide preparation guidelines and ask for the PWD/Senior Citizen ID Number if the client is a PWD/Senior Citizen.',
                ]),
                'payment_options' => json_encode([
                    'Pay in cash', 'Pay online via online banking payment schemes',
                    'Pay through GCash or PayMaya', 'Email the proof of payment to dchi.accounting@yahoo.com',
                ]),
                'active' => 1, 'sort_order' => 2,
            ],
            [
                'name' => 'Prostate Cancer Awareness Month',
                'short_description' => "Package A: Includes Prostate Specific Antigen (PSA), Ultrasound of Prostate.\nPackage B: Includes Prostate Specific Antigen (PSA), Ultrasound of KUB & Prostate",
                'full_description' => 'Avail our August promo package in celebration of Prostate Cancer Awareness Month valid until August 31, 2026 only.',
                'image' => 'assets/images/packages/pcam1.jpg',
                'promo_badge' => '20% OFF',
                'promo_details' => 'Promo valid Aug 1–31, 2026 · Cash transactions only',
                'operating_hours' => '8:00am to 5:00pm, Mondays to Fridays.',
                'availment_steps' => json_encode([
                    'Contact DAPPMC Information landline at 228-2202 or mobile number 09499946474.',
                    'The information staff will assist your schedule and book accordingly.',
                    'The information staff will provide preparation guidelines and ask for the PWD/Senior Citizen ID Number if the client is a PWD/Senior Citizen.',
                ]),
                'payment_options' => json_encode([
                    'Pay in cash', 'Pay online via online banking payment schemes',
                    'Pay through GCash or PayMaya', 'Email the proof of payment to dchi.accounting@yahoo.com',
                ]),
                'active' => 1, 'sort_order' => 3,
            ],
        ];

        foreach ($packages as $pkg) {
            $this->db->table('packages')->insert(array_merge($pkg, [
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]));
        }
    }
}