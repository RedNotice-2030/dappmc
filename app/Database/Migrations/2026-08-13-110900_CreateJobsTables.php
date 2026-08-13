<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateJobsTables extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'              => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'title'           => ['type' => 'VARCHAR', 'constraint' => 150],
            'employment_type' => ['type' => 'ENUM', 'constraint' => ['full-time', 'part-time', 'project-based'], 'default' => 'full-time'],
            'active'          => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'sort_order'      => ['type' => 'INT', 'unsigned' => true, 'default' => 1],
            'created_at'      => ['type' => 'DATETIME', 'null' => true],
            'updated_at'      => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('jobs');

        $this->forge->addField([
            'id'                 => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'job_id'             => ['type' => 'INT', 'unsigned' => true],
            'qualification_text' => ['type' => 'VARCHAR', 'constraint' => 255],
            'sort_order'         => ['type' => 'INT', 'unsigned' => true, 'default' => 1],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('job_id', 'jobs', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('job_qualifications');

        $this->forge->addField([
            'id'           => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'benefit_text' => ['type' => 'VARCHAR', 'constraint' => 255],
            'sort_order'   => ['type' => 'INT', 'unsigned' => true, 'default' => 1],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('benefits');

        $this->forge->addField([
            'job_id'     => ['type' => 'INT', 'unsigned' => true],
            'benefit_id' => ['type' => 'INT', 'unsigned' => true],
        ]);
        $this->forge->addKey(['job_id', 'benefit_id'], true);
        $this->forge->addForeignKey('job_id', 'jobs', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('benefit_id', 'benefits', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('job_benefits');
    }

    public function down()
    {
        $this->forge->dropTable('job_benefits');
        $this->forge->dropTable('benefits');
        $this->forge->dropTable('job_qualifications');
        $this->forge->dropTable('jobs');
    }
}