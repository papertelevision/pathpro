<?php

namespace App\Http\Controllers;

use App\Domain\Feature\Enums\FeatureVisibilityEnum;
use App\Domain\Feature\Models\Feature;
use App\Domain\FeatureType\Models\FeatureType;
use App\Domain\Project\Models\Project;
use App\Http\Domain\Feature\Requests\StoreFeatureRequest;
use App\Http\Domain\Feature\Requests\UpdateFeatureRequest;
use App\Http\Resources\FeatureResource;
use Illuminate\Http\Request;

class ProjectFeatureController extends Controller
{
    public function index(
        Request $request,
        Project $project
    ) {
        $canViewDraftedFeatures = auth()->check() &&
            $request->user()->assignedAsAdminOrTeamMemberToProjects->contains($project);

        $featuresQuery =
            $project
            ->features()
            ->when(
                !$canViewDraftedFeatures,
                fn($query) => $query->public()
            )
            ->withCount('upvotes')
            ->orderByDesc('upvotes_count');

        $featuresOverallRanks =
            $featuresQuery
            ->get()
            ->pluck('id')
            ->toArray();

        $orderedFeaturesIds = implode(',', $featuresOverallRanks);

        $featuresQuery = $featuresQuery->when($request->input('type'), function ($query) use ($request) {
            $featureType = FeatureType::find($request->input('type'));

            if ($featureType) {
                return $query->where('feature_type_id', $featureType->id);
            }

            if ($request->input('type') === 'confirmed') {
                return $query->where('is_task_confirmed', true);
            }

            if ($request->input('type') === 'community-suggested') {
                return $query->has('communityMembers');
            }

            if ($request->input('type') === 'suggested-by-us') {
                return $query->doesntHave('communityMembers');
            }
        })
            ->withCount([
                'upvotes',
                'communityMembers',
                'comments',
                'highlightedComments',
            ])
            ->with([
                'upvotes',
                'subscribers',
                'featureTaskType',
                'communityMembers',
            ])
            ->orderByRaw("FIELD(id, " . $orderedFeaturesIds . " )")
            ->paginate(11);

        return FeatureResource::collection($featuresQuery)
            ->additional([
                'meta' => ['overall_ranks' => $featuresOverallRanks]
            ]);
    }

    public function show(
        Feature $feature
    ) {
        $project = $feature->project;

        $sortedFeatures = $project
            ->features()
            ->withCount('upvotes')
            ->orderByDesc('upvotes_count')
            ->get()
            ->pluck('id')
            ->toArray();

        $overallRank =
            array_search($feature->id, $sortedFeatures);

        $feature
            ->loadCount([
                'upvotes',
                'comments',
                'highlightedComments'
            ])
            ->load([
                'featureTaskType',
                'upvotes',
                'communityMembers.media',
                'communityMembers.permissions' => function ($query) use ($project) {
                    return $query->where('project_id', $project->id);
                },
            ]);

        return FeatureResource::make($feature)->additional(['overall_rank' => $overallRank]);
    }

    public function store(
        StoreFeatureRequest $request,
        Project $project,
    ) {
        if ($request->user()->cannot('create', [Feature::class, $project])) {
            abort(403);
        }

        $validated = $request->validated();

        $feature = $project->features()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'feature_type_id' => $validated['feature_type_id'],
            'is_task_confirmed' => false,
            'are_stats_public' => $validated['are_stats_public'],
            'feature_group_id' => $project->featureGroup->id,
            'visibility' => FeatureVisibilityEnum::tryFrom($validated['visibility']),
        ]);

        $feature->communityMembers()->sync([]);
        $feature->communityMembers()->sync($validated['community_members']);

        return FeatureResource::make($feature);
    }

    public function update(
        UpdateFeatureRequest $request,
        Feature $feature
    ) {
        $validated = $request->validated();

        $feature->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'feature_type_id' => $validated['feature_type_id'],
            'are_stats_public' => $validated['are_stats_public'],
            'visibility' => FeatureVisibilityEnum::from($validated['visibility']),
        ]);

        $feature->communityMembers()->sync([]);
        $feature->communityMembers()->sync($validated['community_members']);

        return response([
            'message' => 'success',
        ]);
    }

    public function destroy(
        Feature $feature
    ) {
        $feature->delete();
    }
}
