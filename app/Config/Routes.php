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
