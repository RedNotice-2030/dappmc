<?php

namespace App\Models;

use CodeIgniter\Model;

class DoctorModel extends Model
{
    protected $table = 'doctors';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'name',
        'specialization',
        'specialization_label',
        'location',
        'image',
        'schedule',
        'active',
        'sort_order',
    ];
    protected $useTimestamps = true;

    public function getActive(): array
    {
        $rows = $this->where('active', 1)
            ->orderBy('sort_order', 'ASC')
            ->findAll();

        return array_map([$this, 'shapeRow'], $rows);
    }

    public function getAllForAdmin(): array
    {
        $rows = $this->orderBy('sort_order', 'ASC')->findAll();

        return array_map([$this, 'shapeRow'], $rows);
    }

    public function shapeRow(array $row): array
    {
        $row['schedule'] = json_decode($row['schedule'] ?? '[]', true) ?: [];
        $row['specializationLabel'] = $row['specialization_label'] ?: ucwords(str_replace('-', ' ', $row['specialization'] ?? ''));
        $row['active'] = (bool) $row['active'];
        $row['sortOrder'] = (int) $row['sort_order'];

        return $row;
    }
}