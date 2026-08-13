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
