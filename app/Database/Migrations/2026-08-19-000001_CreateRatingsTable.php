<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateRatingsTable extends Migration
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
            'patient_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
            ],
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
                'null'       => true,
            ],
            'department' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],
            'visit_date' => [
                'type' => 'DATE',
            ],
            'overall' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
            ],
            'staff_rating' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'null'       => true,
            ],
            'cleanliness_rating' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'null'       => true,
            ],
            'wait_rating' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'null'       => true,
            ],
            'communication_rating' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'null'       => true,
            ],
            'comment' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'would_recommend' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'null'       => true,
            ],
            'reference_code' => [
                'type'       => 'VARCHAR',
                'constraint' => 12,
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
        $this->forge->addKey('department');
        $this->forge->addKey('overall');
        $this->forge->addKey('created_at');
        $this->forge->createTable('ratings', true);
    }

    public function down()
    {
        $this->forge->dropTable('ratings', true);
    }
}
