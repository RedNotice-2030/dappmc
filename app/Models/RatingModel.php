<?php

namespace App\Models;

use CodeIgniter\Model;

class RatingModel extends Model
{
    protected $table            = 'ratings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;  // Matches INT auto_increment migration
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields = [
        'id',
        'patient_name',
        'email',
        'department',
        'visit_date',
        'overall',
        'staff_rating',
        'cleanliness_rating',
        'wait_rating',
        'communication_rating',
        'comment',
        'would_recommend',
        'reference_code',
        'created_at',
        'updated_at',
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'patient_name'         => 'permit_empty|max_length[100]',
        'email'                => 'permit_empty|valid_email|max_length[150]',
        'department'           => 'required|min_length[2]|max_length[100]',
        'visit_date'           => 'required|valid_date[Y-m-d]',
        'overall'              => 'required|integer|greater_than_equal_to[1]|less_than_equal_to[5]',
        'staff_rating'         => 'permit_empty|integer|greater_than_equal_to[1]|less_than_equal_to[5]',
        'cleanliness_rating'   => 'permit_empty|integer|greater_than_equal_to[1]|less_than_equal_to[5]',
        'wait_rating'          => 'permit_empty|integer|greater_than_equal_to[1]|less_than_equal_to[5]',
        'communication_rating' => 'permit_empty|integer|greater_than_equal_to[1]|less_than_equal_to[5]',
        'comment'              => 'permit_empty|max_length[600]',
        'would_recommend'      => 'permit_empty|in_list[0,1]',
        'reference_code'       => 'permit_empty|max_length[12]',
    ];

    protected $validationMessages = [
        'overall' => [
            'required' => 'Pick an overall score from 1 to 5 stars.',
        ],
        'department' => [
            'required' => 'Choose the department you visited.',
        ],
        'visit_date' => [
            'required' => 'Tell us the date of your visit.',
        ],
        'email' => [
            'valid_email' => 'That email address does not look right.',
        ],
    ];

    protected $skipValidation = false;

    protected $beforeInsert = ['generateReferenceCode', 'normaliseNullableFields'];
    protected $beforeUpdate = ['normaliseNullableFields'];

    protected function generateReferenceCode(array $data): array
    {
        if (empty($data['data']['reference_code'])) {
            $data['data']['reference_code'] = $this->referenceCode();
        }

        return $data;
    }

    protected function normaliseNullableFields(array $data): array
    {
        $nullable = [
            'patient_name',
            'email',
            'staff_rating',
            'cleanliness_rating',
            'wait_rating',
            'communication_rating',
            'comment',
            'would_recommend',
        ];

        foreach ($nullable as $field) {
            if (array_key_exists($field, $data['data']) && $data['data'][$field] === '') {
                $data['data'][$field] = null;
            }
        }

        return $data;
    }

    private function referenceCode(): string
    {
        $chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
        $out = 'SA-';

        for ($i = 0; $i < 4; $i++) {
            $out .= $chars[random_int(0, strlen($chars) - 1)];
        }

        return $out;
    }
}