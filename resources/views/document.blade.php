
@extends("layout")

<!--
TODO
@section("prefetch")
    @@include("sub/prefetch", "/api/users/self")
    @@include("sub/prefetch", "/api/users/self")
@endsection
-->

@section("contents")
<section id="document">
    <p class='error'>{{$error ?? ""}}</p>
    <div id="view-document">
        <input id="trackingId" value="{{$trackingId ?? ""}}" type="hidden">
        <input id="routeId" value="{{$routeId ?? ""}}" type="hidden">
        <input id="document" value="{{$doc ?? ""}}" type="hidden">
        <input id="user" value="{{$user ?? ""}}" type="hidden">
        <h2>
            <span class='title'>doc title</span>
            <small>@ <span class='office'>office</span></small>
        </h2>
        <p class="info"><strong>tracking ID:</strong>
            <a class="trackingId"
               href="{{route('view-routes', $trackingId)}}">
                {{$trackingId}}
            </a>
            @if ($document->type == "parallel")
            <a href="{{route('view-subroutes', $trackingId)}}"
               class="action">other routes</a>
            @endif
        </p>
        <p class="info"><strong>state: </strong>
            <span class="doc-state {{$document->state}}">
                {{$document->state}}
            </span>
        </p>
        <p class='info'>
            <strong>classification level:</strong>
            <span class='classification'></span>
        </p>
        <p class='info'>
            <strong>status:</strong>
            <span class='status'>status</span>
        </p>
        <p class='info'>
            <strong>details:</strong>
            <span class='details'></span>
        </p>
        <p class='info'>
            <strong>annotations:</strong>
            <span class='annotations'></span>
        </p>
        <p class='info attachment'>
            <strong>attachment:</strong>
            <a href="#" target="_blank">filename.docx</a>
        </p>
        <p class='info'>
            <strong>seen by:</strong>
            <span class='seen-by'></span>
        </p>

        <hr>
        <p class="info">
            <strong>activity log: </strong>
            <ul class='activities'></ul>
        </p>

        <div class="hidden radios">
            <label><input type="radio" name="action-type" value="forward"> forward</label>
            <label><input type="radio" name="action-type" value="other"> other</label>
        </div>
        <div class="send-data hidden">
            <!--TODO-->
            <textarea name="annotation" rows="5" class="full annots"
                placeholder="comments, notes or annotation" ></textarea>
            <br>
            <strong>Destination</strong>
            @include("sub/office-selection")
        </div>
        <ul class="errors"></ul>
        <div class="center">
            <button class='pure-button-primary hidden action half send'>send</button>
            <button class='pure-button-primary hidden action half recv'>receive</button>
            <button class='pure-button-default hidden action finalize half affirm green'>finalize</button>
            <button class='pure-button-default hidden action reject half red'>reject</button>
            <button class='pure-button-primary hidden action return half '>return</button>
        </div>
    </div>
    <script src='{{asset("js/sub/office-selection.js")}}'></script>
    <script src="{{asset('js/sub/document-view.js')}}"></script>
</section>
@endsection
