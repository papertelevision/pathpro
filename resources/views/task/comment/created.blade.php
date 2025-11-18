<x-mail::message>
@if (! empty($greeting))
# <center>{{ $greeting }}</center>
@endif
A new suggestion from {{ $user->username }} has been added to the task <a href="{{ $url }}">{{ $task->title }}</a>.
<x-mail::panel>
{{ $comment->content }}
</x-mail::panel>
<x-mail::button :url="$url" color="blue">
View Suggestion
</x-mail::button>
@slot('subcopy')
@lang("If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n" . 'into your web browser: [:actionURL](:actionURL)', [
'actionText' => 'View Suggestion',
'actionURL' => $url,
])
@endslot
</x-mail::message>
