<x-mail::message>
@if (!empty($greeting))
# <center>{{ $greeting }}</center>
@endif
<p>
Community Member {{ $user->username }} has submitted a new Feature Submission to the project titled:
{{ $project->title }}! Visit your Feature Submissions panel
<a href={{ $url }}>here</a> to review.
</p>
<x-mail::button :url="$url" color="blue">
View Feature Submissions
</x-mail::button>
@slot('subcopy')
@lang("If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n" . 'into your web browser: [:actionURL](:actionURL)', [
'actionText' => 'View Feature Submissions',
'actionURL' => $url,
])
@endslot
</x-mail::message>
