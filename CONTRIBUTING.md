## Git Workflow

The starting point for all of the work is __Issues__. Always, create a new branch from `master` and named it `{ISSUE_NUMBER}/{FEATURE_WORK}` (e.g. `134/add-project-resource`).

 1) `git fetch` // To fetch the latest data from remote
 2) `git checkout master` // Switch to `master` branch
 3) `git checkout -b "{ISSUE_NUMBER}/{FEATURE_WORK}"` // Create a new branch from `master`. Always create branches from `master`

Once you are ready with the branch, open a new Pull Request from GitHub and merge it with master.

You can create multiple branches for a single Issue. E.g. if the Issue is "Develop API Endpoints (!135)", you can have the following branches:

 * `135/add-product-endpoint`
 * `135/add-product-resource-class`
 * `135/change-product-to-project`

Each of these branches should be created from the latest `master` branch and then merged into `master` via a Pull Request.

### Deployment on Staging

The staging branch is set up to deploy on each commit on `production`.
