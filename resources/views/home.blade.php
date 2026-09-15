@extends('layouts.app')

@section('content')
    <h1 class="text-danger">Hello World</h1>
@endsection

@push('scripts')
    @vite(['resources/js/views/home.index.ts'])
@endpush