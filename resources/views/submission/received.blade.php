<x-mail::message>
@if (!empty($greeting))
# <center>{{ $greeting }}</center>
@endif
<p>
Just a friendly note to let you know we’ve received your feature / Idea submission for the
project titled {{ $project->title }}! Our team will review the submission to see if it’s a fit for the project,
and will follow up accordingly. We very much appreciate your feedback!
</p>
<p>
Thank you!
</p>
</x-mail::message>
