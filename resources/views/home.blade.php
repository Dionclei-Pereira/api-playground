@extends('layouts.app')

@section('content')
    <header>
        <div class="container-fluid w-100">
            <h1 class="text-center">API Playground</h1>
        </div>
    </header>
    <main>

    </main>
    <footer class="fixed-bottom container-fluid d-flex align-items-center flex-column gap-2">
        <div>
            <img id="github"
            src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"
            alt="GitHub">
        </div>
        <p class="text-center fs-6 fs-md-3 fs-lg-1">© 2026 Dionclei de Souza Pereira. All rights reserved.</p>
    </footer>
@endsection

@push('scripts')
    @vite(['resources/js/views/home.index.ts'])
@endpush
