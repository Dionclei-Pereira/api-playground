<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProxyController;

Route::post('/proxy/execute', [ProxyController::class, 'execute']);
