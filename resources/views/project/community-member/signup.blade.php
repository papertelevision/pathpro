<x-mail::message>
@if (! empty($greeting))
# <center>{{ $greeting }}</center>
@endif
The user with the email <b>{{ $user->email }}</b> has signed up as a Community Member to your project <a href={{ route('project.show', ['project' => $project->slug]) }}>{{ $project->title }}</a>.
<x-mail::button :url="$url" color="blue">
View Community Member
</x-mail::button>
@slot('subcopy')
@lang("If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n" . 'into your web browser: [:actionURL](:actionURL)', [
'actionText' => 'View Community Member',
'actionURL' => $url,
])
@endslot
</x-mail::message>
