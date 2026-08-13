<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Pages::index');
$routes->get('about', 'Pages::about');
$routes->get('services', 'Pages::services');
$routes->get('doctors', 'Pages::doctors');
$routes->get('careers', 'Pages::careers');
$routes->get('news', 'Pages::news');
$routes->get('faqs', 'Pages::faqs');
$routes->get('org', 'Pages::org');
$routes->get('hmo', 'Pages::hmo');
$routes->get('cms', 'Pages::cms');

// --- CMS Authentication (AJAX) ---
$routes->post('auth/login', 'Auth::login');
$routes->post('auth/logout', 'Auth::logout');
$routes->post('auth/change-password', 'Auth::changePassword');
$routes->get('auth/check', 'Auth::check');

// --- CMS User Management (AJAX) ---
$routes->get('users', 'Users::index');
$routes->get('users/list', 'Users::index');
$routes->post('users/create', 'Users::create');
$routes->post('users/update/(:num)', 'Users::update/$1');
$routes->post('users/set-active/(:num)', 'Users::setActive/$1');
$routes->get('careers/jobs.json', 'Jobs::publicList');       // public, for content-renderer.js
$routes->get('jobs/list', 'Jobs::index');                     // admin
$routes->post('jobs/create', 'Jobs::create');
$routes->post('jobs/update/(:num)', 'Jobs::update/$1');
$routes->post('jobs/delete/(:num)', 'Jobs::delete/$1');
$routes->get('jobs/benefits', 'Jobs::benefitsList');
$routes->post('jobs/benefits/create', 'Jobs::createBenefit');
// $routes->get('debug-ssl-check', function() {
//     $path = WRITEPATH . 'ssl/aiven-ca.pem';
//     echo 'Path: ' . $path . '<br>';
//     echo 'Exists: ' . (file_exists($path) ? 'YES' : 'NO') . '<br>';
//     echo 'Readable: ' . (is_readable($path) ? 'YES' : 'NO');
// });
// $routes->get('debug-db-config', function() {
//     $db = config('Database')->default;
//     echo 'Hostname: ' . ($db['hostname'] ?: '(empty)') . '<br>';
//     echo 'Username: ' . ($db['username'] ?: '(empty)') . '<br>';
//     echo 'Database: ' . ($db['database'] ?: '(empty)') . '<br>';
//     echo 'Port: ' . ($db['port'] ?: '(empty)') . '<br>';
//     echo 'DBDriver: ' . ($db['DBDriver'] ?: '(empty)') . '<br>';
//     echo 'SSL CA: ' . (is_array($db['encrypt']) ? ($db['encrypt']['ssl_ca'] ?? '(not set)') : 'encrypt is not an array: ' . var_export($db['encrypt'], true));
// });