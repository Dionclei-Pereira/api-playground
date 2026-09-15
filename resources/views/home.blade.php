@extends('layouts.app')

@section('content')
    <main class="w-100 h-75 bg-warning d-flex flex-column flex-md-row">
        <div class="w-100 w-md-25 h-50 h-md-100 bg-danger">

        </div>
        <div class="w-100 w-md-75 h-100 bg-success">

        </div>
    </main>
@endsection

@push('scripts')
    @vite(['resources/js/views/home.index.ts'])
@endpush
