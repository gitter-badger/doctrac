<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document Tracking</title>
    <link rel="stylesheet" href="{{asset('css/site.css')}}">
    @yield("styles")
</head>
<body>
    <h1>....</h1>
    <hr>
    <div class="site-wrap">
        @yield("contents")
    </div>
    <script src="{{asset('js/jquery.min.js')}}"></script>
    <script src="{{asset('js/util.js')}}"></script>
    <script src="{{asset('js/ui.js')}}"></script>
    <script src="{{asset('js/api.js')}}"></script>
    @yield("scripts")
</body>
</html>