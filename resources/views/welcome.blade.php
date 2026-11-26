<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name="asset-base" content="{{ rtrim(asset(''), '/') }}">
        <meta name="app-base" content="{{ rtrim(request()->getBasePath(), '/') }}">
        <title>Simulasi Pemilihan Kepala Desa Bendungan</title>
        <link rel="icon" type="image/png" href="{{ asset('images/logo-subang.png') }}">
        @fonts
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="bg-slate-100 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <div id="app"></div>
    </body>
</html>
