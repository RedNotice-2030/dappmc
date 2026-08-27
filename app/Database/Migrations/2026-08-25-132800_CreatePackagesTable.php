<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePackagesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'                => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'name'              => ['type' => 'VARCHAR', 'constraint' => 150],
            'short_description' => ['type' => 'TEXT'],
            'full_description'  => ['type' => 'TEXT', 'null' => true],
            'image'             => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'promo_badge'       => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true],
            'promo_details'     => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'operating_hours'   => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'availment_steps'   => ['type' => 'JSON', 'null' => true],
            'payment_options'   => ['type' => 'JSON', 'null' => true],
            'active'            => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'sort_order'        => ['type' => 'INT', 'unsigned' => true, 'default' => 1],
            'created_at'        => ['type' => 'DATETIME', 'null' => true],
            'updated_at'        => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('packages');
    }

    public function down()
    {
        $this->forge->dropTable('packages');
    }
}