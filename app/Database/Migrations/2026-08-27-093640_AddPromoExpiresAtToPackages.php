<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddPromoExpiresAtToPackages extends Migration
{
    public function up()
    {
        $this->forge->addColumn('packages', [
            'promo_expires_at' => ['type' => 'DATE', 'null' => true, 'after' => 'promo_details'],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('packages', 'promo_expires_at');
    }
}