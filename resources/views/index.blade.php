<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta property="og:image" content={{ url('pathpro-favicon.ico') }} />
    <title>{{ $projectSlug && $projectCustomDomainConfigured ? $projectTitle : 'PathPro' }}</title>
    <link rel="stylesheet" href="{{ mix('/css/style.css') }}">
    <script>
        window.isLoggedIn = {{ json_encode(auth()->check()) }};
    </script>
    <link rel="icon" href="{{ $projectSlug && $projectCustomDomainConfigured ? $projectFavicon : url('pathpro-favicon.ico') }}">
</head>

<body>
    <div id="root" projectSlug={{ $projectSlug }}></div>
    <div id="modal"></div>
    <div id="popup-notification"></div>
    <script src="{{ mix('/js/app.js') }}"></script>
</body>

</html>
