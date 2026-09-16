@extends('layouts.app')

@section('content')
    <main class="w-100 h-75 bg-warning d-flex flex-column flex-md-row">
        <div id="list-panel" class="overflow-scroll w-100 w-md-25 h-10 h-md-100 bg-danger d-flex flex-row 
            flex-md-column align-items-center align-items-md-center gap-2 justify-content-start px-3 px-md-0 py-md-3">
            
        </div>
        <div id="main-panel" class="w-100 w-md-75 h-100 bg-success">

        </div>
    </main>
@endsection

@push('scripts')
    @vite(['resources/js/views/home.index.ts'])
    @vite(['resources/js/utils/home.api-list.ts'])
    @vite(['resources/js/utils/home.api-resolver.ts'])
@endpush

@push('styles')
    @vite(['resources/css/views/home.index.css'])
@endpush
