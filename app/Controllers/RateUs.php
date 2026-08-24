<?php

namespace App\Controllers;

use App\Models\RatingModel;
use CodeIgniter\HTTP\ResponseInterface;
use DateTime;

class RateUs extends BaseController
{
    private RatingModel $ratingModel;

    public function __construct()
    {
        helper(['url', 'text']);
        $this->ratingModel = new RatingModel();
    }

    /**
     * GET /rate-us
     * Full page view containing the rating modal, monitor, and feedback wall.
     */
    public function index(): string
    {
        return view('rate_us', [
            'departments' => $this->departments(),
            'initialData' => $this->ratingsPayload(),
            'csrf'       => $this->csrfPayload(),
        ]);
    }

    /**
     * GET /api/ratings
     */
    public function ratings(): ResponseInterface
    {
        return $this->withCors(
            $this->response->setJSON($this->ratingsPayload())
        );
    }

    /**
     * POST /api/ratings
     */
    public function create(): ResponseInterface
    {
        $payload = $this->request->getJSON(true);

        if (! is_array($payload)) {
            return $this->jsonError('Invalid JSON payload.', 400);
        }

        [$data, $errors] = $this->normaliseIncomingPayload($payload);

        if ($errors !== []) {
            return $this->jsonError('Some fields need attention.', 400, $errors);
        }

        // ID is auto-incremented by the DB (INT AUTO_INCREMENT) — no manual UUID.
        // Only generate the reference code (model also auto-generates it if missing).
        $data['reference_code'] = $this->referenceCode();

        $insertId = $this->ratingModel->insert($data);

        if ($insertId === false) {
            return $this->jsonError('Some fields need attention.', 400, $this->ratingModel->errors());
        }

        $inserted = $this->ratingModel->find($insertId);

        return $this->withCors(
            $this->response
                ->setStatusCode(201)
                ->setJSON([
                    'ok'       => true,
                    'review'   => $this->reviewPayload($inserted),
                    'csrfHash' => $this->csrfPayload()['hash'],
                ])
        );
    }

    /**
     * OPTIONS /api/ratings
     * Useful when this endpoint is called from a separate frontend domain.
     */
    public function options(): ResponseInterface
    {
        return $this->withCors($this->response->setStatusCode(204));
    }

    private function ratingsPayload(): array
    {
        $db = db_connect();

        $agg = $db->table('ratings')
            ->select('COUNT(*) AS count', false)
            ->select('AVG(overall) AS avg_overall', false)
            ->select('AVG(staff_rating) AS avg_staff', false)
            ->select('AVG(cleanliness_rating) AS avg_clean', false)
            ->select('AVG(wait_rating) AS avg_wait', false)
            ->select('AVG(communication_rating) AS avg_comm', false)
            ->select('COUNT(CASE WHEN would_recommend = 1 THEN 1 END) AS rec_yes', false)
            ->select('COUNT(CASE WHEN would_recommend IS NOT NULL THEN 1 END) AS rec_total', false)
            ->get()
            ->getRowArray();

        $distribution = [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0];
        $distRows = $db->table('ratings')
            ->select('overall, COUNT(*) AS n', false)
            ->groupBy('overall')
            ->get()
            ->getResultArray();

        foreach ($distRows as $row) {
            $distribution[(int) $row['overall']] = (int) $row['n'];
        }

        $total    = (int) ($agg['count'] ?? 0);
        $recTotal = (int) ($agg['rec_total'] ?? 0);

        $stats = [
            'count'         => $total,
            'average'       => $agg['avg_overall'] !== null ? round((float) $agg['avg_overall'], 1) : null,
            'distribution'  => $distribution,
            'categories'    => [
                'staffRating'         => $agg['avg_staff'] !== null ? round((float) $agg['avg_staff'], 1) : null,
                'cleanlinessRating'   => $agg['avg_clean'] !== null ? round((float) $agg['avg_clean'], 1) : null,
                'waitRating'          => $agg['avg_wait'] !== null ? round((float) $agg['avg_wait'], 1) : null,
                'communicationRating' => $agg['avg_comm'] !== null ? round((float) $agg['avg_comm'], 1) : null,
            ],
            'recommendRate' => $recTotal > 0 ? (int) round(((int) $agg['rec_yes'] / $recTotal) * 100) : null,
        ];

        $rows = $this->ratingModel
            ->orderBy('created_at', 'DESC')
            ->limit(15)
            ->findAll();

        return [
            'stats'   => $stats,
            'reviews' => array_map([$this, 'reviewPayload'], $rows),
        ];
    }

    private function normaliseIncomingPayload(array $payload): array
    {
        $errors = [];

        $overall = $this->scoreOrNull($payload['overall'] ?? null);
        if ($overall === null) {
            $errors['overall'] = 'Pick an overall score from 1 to 5 stars.';
        }

        $department = trim((string) ($payload['department'] ?? ''));
        if (! in_array($department, $this->departments(), true)) {
            $errors['department'] = 'Choose the department you visited.';
        }

        $visitDate = trim((string) ($payload['visitDate'] ?? ''));
        if (! $this->isValidDate($visitDate)) {
            $errors['visitDate'] = 'Tell us the date of your visit.';
        } elseif ($visitDate > date('Y-m-d')) {
            $errors['visitDate'] = 'Visit date cannot be in the future.';
        }

        $email = trim((string) ($payload['email'] ?? ''));
        if ($email !== '' && ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'That email address does not look right.';
        }

        $comment = trim((string) ($payload['comment'] ?? ''));
        if (mb_strlen($comment) > 600) {
            $errors['comment'] = 'Please keep your comment under 600 characters.';
        }

        $name = trim((string) ($payload['patientName'] ?? ''));

        $wouldRecommend = null;
        if (array_key_exists('wouldRecommend', $payload) && $payload['wouldRecommend'] !== null) {
            $wouldRecommend = filter_var($payload['wouldRecommend'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($wouldRecommend !== null) {
                $wouldRecommend = $wouldRecommend ? 1 : 0;
            }
        }

        $data = [
            'patient_name'         => $name !== '' ? mb_substr($name, 0, 100) : null,
            'email'                => $email !== '' ? mb_substr($email, 0, 150) : null,
            'department'           => $department,
            'visit_date'           => $visitDate,
            'overall'              => $overall,
            'staff_rating'         => $this->scoreOrNull($payload['staffRating'] ?? null),
            'cleanliness_rating'   => $this->scoreOrNull($payload['cleanlinessRating'] ?? null),
            'wait_rating'          => $this->scoreOrNull($payload['waitRating'] ?? null),
            'communication_rating' => $this->scoreOrNull($payload['communicationRating'] ?? null),
            'comment'              => $comment !== '' ? mb_substr($comment, 0, 600) : null,
            'would_recommend'      => $wouldRecommend,
        ];

        return [$data, $errors];
    }

    private function reviewPayload(?array $row): array
    {
        if (! $row) {
            return [];
        }

        return [
            'id'                  => $row['id'],
            'patientName'         => $row['patient_name'],
            'department'          => $row['department'],
            'visitDate'           => $row['visit_date'],
            'overall'             => (int) $row['overall'],
            'staffRating'         => $row['staff_rating'] !== null ? (int) $row['staff_rating'] : null,
            'cleanlinessRating'   => $row['cleanliness_rating'] !== null ? (int) $row['cleanliness_rating'] : null,
            'waitRating'          => $row['wait_rating'] !== null ? (int) $row['wait_rating'] : null,
            'communicationRating' => $row['communication_rating'] !== null ? (int) $row['communication_rating'] : null,
            'comment'             => $row['comment'],
            'wouldRecommend'      => $row['would_recommend'] !== null ? (bool) $row['would_recommend'] : null,
            'referenceCode'       => $row['reference_code'],
            'createdAt'           => $row['created_at'] ? date(DATE_ATOM, strtotime($row['created_at'])) : null,
        ];
    }

    private function departments(): array
    {
        $path = FCPATH . 'assets/rate-us/json/departments.json';
        if (is_file($path)) {
            $json = json_decode((string) file_get_contents($path), true);
            if (is_array($json) && isset($json['departments']) && is_array($json['departments'])) {
                return array_values(array_filter($json['departments'], 'is_string'));
            }
        }

        return [
            'Cardiology',
            'Pediatrics',
            'Emergency',
            'Orthopedics',
            'Oncology',
            'Maternity & Newborn',
            'Neurology',
            'General Medicine',
            'Radiology & Imaging',
            'Physical Therapy',
        ];
    }

    private function scoreOrNull(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (! is_numeric($value)) {
            return null;
        }

        $score = (int) round((float) $value);
        return $score >= 1 && $score <= 5 ? $score : null;
    }

    private function isValidDate(string $value): bool
    {
        $dt = DateTime::createFromFormat('Y-m-d', $value);
        return $dt !== false && $dt->format('Y-m-d') === $value;
    }

    private function jsonError(string $message, int $status, array $errors = []): ResponseInterface
    {
        return $this->withCors(
            $this->response
                ->setStatusCode($status)
                ->setJSON([
                    'error'    => $message,
                    'errors'   => $errors,
                    'csrfHash' => $this->csrfPayload()['hash'],
                ])
        );
    }

    private function csrfPayload(): array
    {
        return [
            'tokenName'  => function_exists('csrf_token') ? csrf_token() : null,
            'headerName' => function_exists('csrf_header') ? csrf_header() : 'X-CSRF-TOKEN',
            'hash'       => function_exists('csrf_hash') ? csrf_hash() : null,
        ];
    }

    private function withCors(ResponseInterface $response): ResponseInterface
    {
        $origin = env('RATE_US_ALLOWED_ORIGIN', '*');

        return $response
            ->setHeader('Access-Control-Allow-Origin', $origin)
            ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            ->setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, X-CSRF-TOKEN');
    }

    private function referenceCode(): string
    {
        $chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
        $out = 'DAPPMC-';

        for ($i = 0; $i < 4; $i++) {
            $out .= $chars[random_int(0, strlen($chars) - 1)];
        }

        return $out;
    }
}
