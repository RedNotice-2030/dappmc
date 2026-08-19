<?php

namespace App\Controllers;

use App\Models\NewsModel;

class News extends BaseController
{
    protected NewsModel $newsModel;
    protected $session;

    public function __construct()
    {
        $this->newsModel = model(NewsModel::class);
        $this->session   = service('session');
    }

    /**
     * Guard: only allow AJAX requests from logged-in users.
     */
    protected function requireAuth()
    {
        if (!$this->request->isAJAX()) {
            return $this->response->setStatusCode(403)->setJSON([
                'success' => false,
                'message' => 'Direct access is not allowed.',
            ]);
        }

        if ($this->session->get('is_logged_in') !== true) {
            return $this->response->setStatusCode(401)->setJSON([
                'success' => false,
                'message' => 'You must be logged in to manage news.',
            ]);
        }

        return null;
    }

    public function index()
    {
        $items = $this->newsModel->getNews();

        // Decode tags for each item
        $result = [];
        foreach ($items as $item) {
            $result[] = $this->newsModel->decodeTags($item);
        }

        return $this->response->setJSON([
            'success' => true,
            'news'    => $result,
        ]);
    }

    /**
     * Public: Get active news items filtered by category.
     */
    public function byCategory($category)
    {
        $items = $this->newsModel->getNews($category);

        $result = [];
        foreach ($items as $item) {
            $result[] = $this->newsModel->decodeTags($item);
        }

        return $this->response->setJSON([
            'success' => true,
            'news'    => $result,
        ]);
    }

    /**
     * Admin: Get all news items (including inactive) for the CMS.
     */
    public function adminList()
    {
        $guard = $this->requireAuth();
        if ($guard !== null) return $guard;

        $items = $this->newsModel->getAllForAdmin();

        $result = [];
        foreach ($items as $item) {
            $item = $this->newsModel->decodeTags($item);
            $item['is_active'] = (int) $item['is_active'];
            $result[] = $item;
        }

        return $this->response->setJSON([
            'success' => true,
            'news'    => $result,
        ]);
    }

    public function create()
    {
        $guard = $this->requireAuth();
        if ($guard !== null) return $guard;

        $category = trim((string) $this->request->getPost('category')) ?: 'news';
        $title    = trim((string) $this->request->getPost('title'));
        $excerpt  = trim((string) $this->request->getPost('excerpt'));
        $content  = trim((string) $this->request->getPost('content'));
        $image    = trim((string) $this->request->getPost('image'));
        $date     = trim((string) $this->request->getPost('date'));
        $tagsRaw  = $this->request->getPost('tags');
        $isActive = (int) $this->request->getPost('is_active');
        if ($isActive !== 0 && $isActive !== 1) {
            $isActive = 1;
        }

        // Validate
        if ($title === '' || $excerpt === '' || $date === '') {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Title, excerpt, and date are required.',
            ]);
        }

        // Parse tags (comma-separated string or JSON array)
        $tags = [];
        if (is_string($tagsRaw) && $tagsRaw !== '') {
            $tags = array_map('trim', explode(',', $tagsRaw));
            $tags = array_filter($tags);
        } elseif (is_array($tagsRaw)) {
            $tags = $tagsRaw;
        }

        $this->newsModel->skipValidation(true);
        $id = $this->newsModel->insert([
            'category'  => $category,
            'title'     => $title,
            'excerpt'   => $excerpt,
            'content'   => $content,
            'image'     => $image,
            'date'      => $date,
            'tags'      => $tags,
            'is_active' => $isActive,
        ]);
        $this->newsModel->skipValidation(false);

        if ($id === false) {
            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Failed to create news item.',
            ]);
        }

        return $this->response->setStatusCode(201)->setJSON([
            'success' => true,
            'message' => 'News item created successfully.',
            'news'    => [
                'id'        => $id,
                'category'  => $category,
                'title'     => $title,
                'excerpt'   => $excerpt,
                'content'   => $content,
                'image'     => $image,
                'date'      => $date,
                'tags'      => $tags,
                'is_active' => $isActive,
            ],
        ]);
    }

    /**
     * Admin: Update an existing news item.
     */
    public function update($id)
    {
        $guard = $this->requireAuth();
        if ($guard !== null) return $guard;

        $item = $this->newsModel->find($id);
        if ($item === null) {
            return $this->response->setStatusCode(404)->setJSON([
                'success' => false,
                'message' => 'News item not found.',
            ]);
        }

        $category = trim((string) $this->request->getPost('category')) ?: $item['category'];
        $title    = trim((string) $this->request->getPost('title'));
        $excerpt  = trim((string) $this->request->getPost('excerpt'));
        $content  = trim((string) $this->request->getPost('content'));
        $image    = trim((string) $this->request->getPost('image'));
        $date     = trim((string) $this->request->getPost('date'));
        $tagsRaw  = $this->request->getPost('tags');
        $isActive = (int) $this->request->getPost('is_active');
        if ($isActive !== 0 && $isActive !== 1) {
            $isActive = (int) $item['is_active'];
        }

        if ($title === '' || $excerpt === '' || $date === '') {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Title, excerpt, and date are required.',
            ]);
        }

        // Parse tags
        $tags = [];
        if (is_string($tagsRaw) && $tagsRaw !== '') {
            $tags = array_map('trim', explode(',', $tagsRaw));
            $tags = array_filter($tags);
        } elseif (is_array($tagsRaw)) {
            $tags = $tagsRaw;
        }

        $this->newsModel->skipValidation(true);
        $this->newsModel->update($id, [
            'category'  => $category,
            'title'     => $title,
            'excerpt'   => $excerpt,
            'content'   => $content,
            'image'     => $image,
            'date'      => $date,
            'tags'      => $tags,
            'is_active' => $isActive,
        ]);
        $this->newsModel->skipValidation(false);

        return $this->response->setJSON([
            'success' => true,
            'message' => 'News item updated successfully.',
            'news'    => [
                'id'        => $id,
                'category'  => $category,
                'title'     => $title,
                'excerpt'   => $excerpt,
                'content'   => $content,
                'image'     => $image,
                'date'      => $date,
                'tags'      => $tags,
                'is_active' => $isActive,
            ],
        ]);
    }

    public function delete($id)
    {
        $guard = $this->requireAuth();
        if ($guard !== null) return $guard;

        $item = $this->newsModel->find($id);
        if ($item === null) {
            return $this->response->setStatusCode(404)->setJSON([
                'success' => false,
                'message' => 'News item not found.',
            ]);
        }

        $this->newsModel->delete($id);

        return $this->response->setJSON([
            'success' => true,
            'message' => 'News item deleted successfully.',
        ]);
    }
}