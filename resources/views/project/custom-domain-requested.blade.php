<x-mail::message>
@if (! empty($greeting))
# <center>{{ $greeting }}</center>
@endif
<p>You have a new custom domain request on {{ config('app.name') }}. User {{ $user->username }} has added a custom domain: <b>{{ $project->custom_domain }}</b> for the <a href={{ route('project.show', ['project' => $project->slug]) }}>{{ $project->title }}</a> project.</p>
@slot('subcopy')
@endslot
</x-mail::message>
