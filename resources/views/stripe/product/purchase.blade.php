<x-mail::message>
@if (! empty($greeting))
# <center>{{ $greeting }}</center>
@endif
The user with the email <b>{{ $user->email }}</b> has purchased a <a href="{{ $stripeProductUrl }}">{{ $stripeProduct->name }}</a> plan.
<x-mail::button :url="$url" color="blue">
View User
</x-mail::button>
@slot('subcopy')
@lang("If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n" . 'into your web browser: [:actionURL](:actionURL)', [
'actionText' => 'View User',
'actionURL' => $url,
])
@endslot
</x-mail::message>
