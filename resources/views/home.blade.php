@extends('layouts.app')

@section('content')
    <x-header></x-header>
    <main>

    </main>
    <x-footer></x-footer>
@endsection

@push('scripts')
    @vite(['resources/js/views/home.index.ts'])
@endpush
