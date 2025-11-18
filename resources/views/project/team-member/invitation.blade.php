<x-mail::message>
@if (! empty($greeting))
# <center>{{ $greeting }}</center>
@endif
You have been invited as a Team Member to join the following project/s:
<x-mail::panel>
@foreach ($projects as $project)
<p>
<a href={{ route('project.show', ['project' => $project->slug]) }}>{{ $project->title }}</a>
</p>
@endforeach
</x-mail::panel>
<x-mail::button :url="$url" color="blue">
Accept Invitation
</x-mail::button>
@slot('subcopy')
@lang("If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n" . 'into your web browser: [:actionURL](:actionURL)', [
'actionText' => 'Accept Invitation',
'actionURL' => $url,
])
@endslot
</x-mail::message>
