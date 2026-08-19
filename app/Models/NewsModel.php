<?php

namespace App\Models;

use CodeIgniter\Model;

class NewsModel extends Model
{
    protected $table         = 'news';
    protected $primaryKey    = 'id';
    protected $useAutoIncrement = true;
    protected $returnType    = 'array';
    protected $useSoftDeletes = false;
    protected $allowedFields = [
        'category',
        'title',
        'excerpt',
        'content',
        'image',
        'date',
        'tags',
        'is_active',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'category' => 'required|max_length[20]',
        'title'    => 'required|max_length[255]',
        'excerpt'  => 'required',
    ];

    protected $validationMessages = [
        'title' => [
            'required' => 'Title is required.',
        ],
        'excerpt' => [
            'required' => 'Excerpt is required.',
        ],
    ];

    /**
     * Get all news items, optionally filtered by category.
     *
     * @param string|null $category
     * @return array
     */
    public function getNews(?string $category = null): array
    {
        $builder = $this->where('is_active', 1);

        if ($category !== null && $category !== '') {
            $builder->where('category', $category);
        }

        return $builder->orderBy('date', 'DESC')->findAll();
    }

    /**
     * Get all news items for the CMS admin (including inactive).
     *
     * @return array
     */
    public function getAllForAdmin(): array
    {
        return $this->orderBy('date', 'DESC')->findAll();
    }

    /**
     * Decode the tags JSON column into an array.
     *
     * @param array $item
     * @return array
     */
    public function decodeTags(array $item): array
    {
        if (!empty($item['tags'])) {
            $decoded = json_decode($item['tags'], true);
            if (is_array($decoded)) {
                $item['tags'] = $decoded;
            } else {
                $item['tags'] = [];
            }
        } else {
            $item['tags'] = [];
        }
        return $item;
    }

    /**
     * Encode tags array into JSON for storage.
     *
     * @param array $data
     * @return array
     */
    protected function encodeTags(array $data): array
    {
        if (isset($data['tags']) && is_array($data['tags'])) {
            $data['tags'] = json_encode($data['tags']);
        }
        return $data;
    }

    protected function beforeInsert(array $data): array
    {
        return $this->encodeTags($data);
    }

    protected function beforeUpdate(array $data): array
    {
        return $this->encodeTags($data);
    }
}