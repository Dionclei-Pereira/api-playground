<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>API Playground</title>
    @yield('head')
    @stack('styles')
    @vite(['resources/css/app.css'])
</head>
<body>
    @yield('content')
    @stack('scripts')
</body>
</html>