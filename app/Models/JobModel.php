<?php

namespace App\Models;

use CodeIgniter\Model;

class JobModel extends Model
{
    protected $table = 'jobs';
    protected $primaryKey = 'id';
    protected $allowedFields = ['title', 'employment_type', 'active', 'sort_order'];
    protected $useTimestamps = true;

    /**
     * Get all jobs assembled with qualifications + benefits,
     * in the same shape your JSON file used.
     */
    public function getAssembled(bool $activeOnly = true): array
    {
        $builder = $this->db->table('jobs')->orderBy('sort_order', 'ASC');
        if ($activeOnly) {
            $builder->where('active', 1);
        }
        $jobs = $builder->get()->getResultArray();

        foreach ($jobs as &$job) {
            $job['qualifications'] = array_column(
                $this->db->table('job_qualifications')
                    ->where('job_id', $job['id'])
                    ->orderBy('sort_order', 'ASC')
                    ->get()->getResultArray(),
                'qualification_text'
            );

            $job['benefits'] = array_column(
                $this->db->table('benefits')
                    ->select('benefits.benefit_text')
                    ->join('job_benefits', 'job_benefits.benefit_id = benefits.id')
                    ->where('job_benefits.job_id', $job['id'])
                    ->orderBy('benefits.sort_order', 'ASC')
                    ->get()->getResultArray(),
                'benefit_text'
            );

            // Match old JSON shape exactly
            $job['type']      = ucwords(str_replace('-', ' ', $job['employment_type']));
            $job['active']    = (bool) $job['active'];
            $job['sortOrder'] = (int) $job['sort_order'];
        }

        return $jobs;
    }
}