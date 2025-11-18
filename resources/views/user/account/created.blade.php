<x-mail::message>
@if (! empty($greeting))
# <center>{{ $greeting }}</center>
@endif
<p>User <b>{{ $user->username }}</b> has created a new account on {{ config('app.name') }}.</p>
@slot('subcopy')
@endslot
</x-mail::message>
