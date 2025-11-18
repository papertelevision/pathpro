<x-mail::message>
@if (!empty($greeting))
# <center>{{ $greeting }}</center>
@endif
<p>
We’re happy to announce that {{ $project->title }} has published new Release Notes! Feel free to
review what’s included in this update <a href={{ $url }}>right this way</a>.
</p>
<x-mail::button :url="$url" color="blue">
View Release Note
</x-mail::button>
@slot('subcopy')
@lang("If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n" . 'into your web browser: [:actionURL](:actionURL)', [
'actionText' => 'View Release Note',
'actionURL' => $url,
])
@endslot
</x-mail::message>
