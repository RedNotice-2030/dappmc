<?php

namespace App\Models;

use CodeIgniter\Model;

class PackageModel extends Model
{
    protected $table = 'packages';
    protected $primaryKey = 'id';
    protected $allowedFields = [
    'name', 'short_description', 'full_description', 'image',
    'promo_badge', 'promo_details', 'promo_expires_at', 'operating_hours',
    'availment_steps', 'payment_options', 'active', 'sort_order',
    ];
    protected $useTimestamps = true;

    public function getActive(): array
    {
        $rows = $this->where('active', 1)
            ->groupStart()
                ->where('promo_expires_at IS NULL', null, false)
                ->orWhere('promo_expires_at >=', date('Y-m-d'))
            ->groupEnd()
            ->orderBy('sort_order', 'ASC')
            ->findAll();
        return array_map([$this, 'shapeRow'], $rows);
    }

    public function getAllForAdmin(): array
    {
        $rows = $this->orderBy('sort_order', 'ASC')->findAll();
        return array_map([$this, 'shapeRow'], $rows);
    }

    private function shapeRow(array $row): array
    {
        $row['availmentSteps']   = json_decode($row['availment_steps'] ?? '[]', true) ?: [];
        $row['paymentOptions']   = json_decode($row['payment_options'] ?? '[]', true) ?: [];
        $row['shortDescription'] = $row['short_description'];
        $row['fullDescription']  = $row['full_description'];
        $row['promoBadge']       = $row['promo_badge'];
        $row['promoDetails']     = $row['promo_details'];
        $row['promoExpiresAt']   = $row['promo_expires_at'];
        $row['operatingHours']   = $row['operating_hours'];
        $row['active']           = (bool) $row['active'];
        $row['sortOrder']        = (int) $row['sort_order'];
        $row['isExpired']        = !empty($row['promo_expires_at']) && $row['promo_expires_at'] < date('Y-m-d');
        return $row;
    }
}