<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateDoctorsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
            ],
            'specialization' => [
                'type'       => 'VARCHAR',
                'constraint' => 80,
            ],
            'specialization_label' => [
                'type'       => 'VARCHAR',
                'constraint' => 120,
                'null'       => true,
            ],
            'location' => [
                'type'       => 'VARCHAR',
                'constraint' => 180,
                'null'       => true,
            ],
            'image' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'schedule' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'active' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 1,
            ],
            'sort_order' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('specialization');
        $this->forge->addKey('active');
        $this->forge->createTable('doctors', true);
    }

    public function down()
    {
        $this->forge->dropTable('doctors', true);
    }
}