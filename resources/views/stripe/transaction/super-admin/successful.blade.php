<x-mail::message>
@if (! empty($greeting))
# <center>{{ $greeting }}</center>
@endif
<p>User <b>{{ $customer->username }}</b> has subscribed to {{ config('app.name') }} with the following details:</p>
<p>
    {{ $stripeProduct->name }}<br />
    {{ $stripeProductAmount }}<br />
    This user has been successfully charged ${{ $transactionAmount }}.
</p>
@slot('subcopy')
@endslot
</x-mail::message>
