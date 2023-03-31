# Count cpp file
<!--  UPDATE_README:START -->
**I have 3 cpp files.**
<!-- UPDATE_README:END -->
Usage
Add the following two strings to your README.md file where you want the update to appear:

```
<!--  UPDATE_README:START -->
<!-- UPDATE_README:END -->
```

Create a new workflow file (e.g. .github/workflows/update-readme.yml) in your repository with the following code:


```yaml
on: [push]

jobs:
  update_readme_job:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    name: Update_README
    steps:
      - uses: actions/checkout@v3
      - name: Update_README
        uses: [your-github-username]/[your-github-action-repo-name]@[version]
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          COMMITTER_USERNAME: "[your-github-username]"
          COMMITTER_EMAIL: "[your-github-email]"
          COMMIT_REPO: "[your-repo-name]"
          COMMIT_OWNER: "[your-github-username]"
          COMMIT_PATH: "[optional-commit-path]"
 ```
Replace the following placeholders:

- [your-github-username]: your GitHub username.
- [your-github-action-repo-name]: the name of your GitHub Action repository.
- [version]: the version of your GitHub Action, e.g. v1.
- [your-github-email]: your email address associated with your GitHub account.
- [your-repo-name]: the name of the repository where you want to update the README.
- [optional-commit-path]: the path to the folder where you want to count the number of files. If not specified, the root directory of the repository will be searched.
Commit the changes to your workflow file and push them to your repository.

Your workflow will now run automatically on every push event, and update the number of files in your README file accordingly.

Check the Actions tab in your repository to see the status of your workflow. If everything ran successfully, you should see a green checkmark.

Note: Make sure to keep the [optional-commit-path] parameter the same as the one you used in your README file. Otherwise, the action will not be able to find the right location to update the README.
