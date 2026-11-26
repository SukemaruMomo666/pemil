<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/e-voting');
Route::redirect('/cetak-qr', '/e-voting/cetak-qr');
Route::view('/e-voting', 'welcome');
Route::view('/e-voting/cetak-qr', 'welcome');
