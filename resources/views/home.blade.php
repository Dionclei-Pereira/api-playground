@extends('layouts.app')

@section('content')
    <main class="w-100 d-flex flex-column flex-md-row">
        <div id="list-panel" class="overflow-auto w-100 w-md-25 d-flex flex-row 
            flex-md-column align-items-center gap-2 justify-content-start px-3 py-2 py-md-3"
        >
        </div>
        <div id="main-panel" class="w-100 w-md-75 d-flex flex-column">
        </div>
    </main>
@endsection

@push('scripts')
    @vite(['resources/js/views/home.index.ts'])
    @vite(['resources/js/utils/home.api-menu.ts'])
@endpush

@push('styles')
    @vite(['resources/css/views/home.index.css'])
@endpush
