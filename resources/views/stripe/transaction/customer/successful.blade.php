<x-mail::message>
@if (! empty($greeting))
# <center>{{ $greeting }}</center>
@endif
<p>
    This is a friendly note to let you know you’ve successfully subscribed to {{ config('app.name')}} with the following details:
</p>
<p>
    {{ $stripeProduct->name }}<br />
    {{ $stripeProductAmount }}<br />
    You have been successfully charged an initial payment of ${{ $transactionAmount }}.
</p>
<p>
    We want to welcome you as you forge an all new path with {{ config('app.name') }}!<br />
    You can access you’re account <a href={{ config('app.url') }}>here</a>.<br />
    Need help getting started? Check out our knowledge base.<br />
</p>
@slot('subcopy')
@endslot
</x-mail::message>
