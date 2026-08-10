<?php

namespace App\Controllers;

class Pages extends BaseController
{
    public function index(): string
    {
        return view('home', ['title' => 'DAPPMC - Home']);
    }

    public function about(): string
    {
        return view('about', ['title' => 'DAPPMC - About Us']);
    }

    public function services(): string
    {
        return view('services', ['title' => 'DAPPMC - Services']);
    }

    public function doctors(): string
    {
        return view('doctors', ['title' => 'DAPPMC - Doctors & Specialists']);
    }

    public function careers(): string
    {
        return view('careers', ['title' => 'DAPPMC - Careers']);
    }

    public function news(): string
    {
        return view('news', ['title' => 'DAPPMC - News & Announcements']);
    }

    public function faqs(): string
    {
        return view('faqs', ['title' => 'DAPPMC - FAQs']);
    }

    public function org(): string
    {
        return view('org', ['title' => 'DAPPMC - Organization']);
    }

    public function hmo(): string
    {
        return view('hmo', ['title' => 'DAPPMC - HMO Partners']);
    }

    public function cms(): string
    {
        return view('cms', ['title' => 'DAPPMC - Content Manager']);
    }
}
