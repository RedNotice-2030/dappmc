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

        if (empty($jobs)) {
            return [];
        }

        $jobIds = array_column($jobs, 'id');

        // One query for ALL qualifications across all jobs
        $allQualifications = $this->db->table('job_qualifications')
            ->whereIn('job_id', $jobIds)
            ->orderBy('sort_order', 'ASC')
            ->get()->getResultArray();

        // One query for ALL benefits across all jobs
        $allBenefits = $this->db->table('benefits')
            ->select('benefits.id, benefits.benefit_text, job_benefits.job_id')
            ->join('job_benefits', 'job_benefits.benefit_id = benefits.id')
            ->whereIn('job_benefits.job_id', $jobIds)
            ->orderBy('benefits.sort_order', 'ASC')
            ->get()->getResultArray();

        // Group by job_id in PHP (no extra DB round-trips)
        $qualByJob = [];
        foreach ($allQualifications as $q) {
            $qualByJob[$q['job_id']][] = $q['qualification_text'];
        }

        $benefitsByJob = [];
        $benefitIdsByJob = [];
        foreach ($allBenefits as $b) {
            $benefitsByJob[$b['job_id']][] = $b['benefit_text'];
            $benefitIdsByJob[$b['job_id']][] = (int) $b['id'];
        }

        foreach ($jobs as &$job) {
            $job['qualifications'] = $qualByJob[$job['id']] ?? [];
            $job['benefits']       = $benefitsByJob[$job['id']] ?? [];
            $job['benefit_ids']    = $benefitIdsByJob[$job['id']] ?? [];
            $job['type']      = ucwords(str_replace('-', ' ', $job['employment_type']));
            $job['active']    = (bool) $job['active'];
            $job['sortOrder'] = (int) $job['sort_order'];
        }

        return $jobs;
    }
}