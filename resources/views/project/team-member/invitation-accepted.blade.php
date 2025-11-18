<x-mail::message>
@if (!empty($greeting))
# <center>{{ $greeting }}</center>
@endif
Just a friendly note to let you know that Team Member {{ $user->username }} has accepted the invitation
to join the project titled {{ $project->title }} and is officially part of the team! To view this Team
Member, feel free to review your Team Members section <a href={{ $url }}>here</a>.
</p>
<x-mail::button :url="$url" color="blue">
View Team Member
</x-mail::button>
@slot('subcopy')
@lang("If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n" . 'into your web browser: [:actionURL](:actionURL)', [
'actionText' => 'View Team Member',
'actionURL' => $url,
])
@endslot
</x-mail::message>
