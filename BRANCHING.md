# Branching & Workflow

### Quick Legend

<table>
  <thead>
    <tr>
      <th>Instance</th>
      <th>Branch</th>
      <th>Description, Instructions, Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Stable</td>
      <td>main</td>
      <td>Accepts merges from Working</td>
    </tr>
    <tr>
      <td>Working</td>
      <td>develop</td>
      <td>Accepts merges from Features and Bugfixes</td>
    </tr>
    <tr>
      <td>Features</td>
      <td>feature/**</td>
      <td>Always branch off HEAD of Working</td>
    </tr>
    <tr>
      <td>Bugfixes</td>
      <td>bugfix/**</td>
      <td>Always branch off HEAD of Working</td>
    </tr>
    <tr>
      <td>Hotfix</td>
      <td>hotfix/**</td>
      <td>Always branch off Stable</td>
    </tr>
  </tbody>
</table>

### Main Branches

- **Main Branch (`main`)**: The `main` branch is the stable production branch. It should always contain tested and deployable code. During day to day development, the `main` branch will not be interacted with.

- **Development Branch (`develop`)**: The `develop` branch serves as the integration branch for features. It is the latest working state of your project, incorporating all completed features and bug fixes. As a developer, you will be branching and merging from `develop`.

- When the source code in the `develop` branch is stable and has been deployed, all of the changes will be merged into `main` and tagged with a release number.

### Supporting Branches

Supporting branches are used to aid parallel development between team members, ease tracking of features, and to assist in quickly fixing live production problems. Unlike the main branches, these branches always have a limited life time, since they will be removed eventually.

**Branch Naming Convention**:

- `feature/` for new features (e.g., `feature/pfr-e1-u1-fe-homepage`)
- `bugfix/` for bug fixes (e.g., `bugfix/pfr-b1-error-on-post-button`)
- `hotfix/` for urgent fixes directly applied to `main` (e.g., `hotfix/pfr-h1-error-on-login`)
- `docs/` for any documentations needed to be applied to `main` (e.g., `docs/sprint-2`)

**Branch Format**:

- User Story

```
feature/pfr-<epic id>-<user story id>-<title>
```

- Subtask

```
feature/pfr-<epic id>-<user story id>-<subtask type>-<title>
```

- Task

```
feature/<type>/pfr-<task id>-<title>
```

- Bug

```
bugfix/pfr-<bug id>-<title>
```

- Hotfix

```
hotfix/pfr-<hotfix id>-<title>
```

- Documentations (from Confluence)

```
docs/<title>
```

### Git Branches Workflow

![Git Branching Model](/src/resources/img/git-branches-flow.drawio.svg)

<p align="right">(<a href="#lost--hound---a-pet-finder-mobile-application">back to top</a>)</p>

<br>

# Development & Deployment Steps

### Development Procedures

1. During Sprint Planning, a task will be assigned to developer.
2. Create a branch from the issue created:

- **From `develop`**:
  - Make sure your `develop` branch is up-to-date:
    ```bash
    git checkout develop
    git pull origin develop
    ```
  - Create a new feature or bugfix branch from `develop`:
    ```bash
    git checkout -b feature/your-feature-name
    ```

3. Develop on Your Branch
4. Perform commit changes regularly with meaningful commit messages:

```bash
git pull origin develop
git add .
git commit -m "Description of the changes made"
```

5. Once done, perform push all commits to the branch:

```bash
git push
```

6. Create a pull request with included assignees for approval
7. Automated testing for the frontend, backend, and OpenAI will run automatically once the pull request is created.
8. Other developers will check the code for approval (need at least 2) and discuss proposed changes
9. Once approved, perform a merge to the `develop` branch and current branch should be deleted. Deletions can be done in Github or locally.
10. Once the changes are reflected on `develop`, they will be automatically deployed to Heroku

```bash
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

### Development Lifecycle Diagram

![Development procedure](/src/resources/img/dev-lifecycle.drawio.svg)

### Deployment Steps into `main`

In this section, we will be migrating all the changes made in the sprint from develop to main and perform a release.

1. Once your develop branch has accumulated completed and tested features, prepare to merge into main.
2. Create a new pull request from develop to main.
3. Conduct a final review and testing before merging.
4. Merge the pull request and consider tagging the release in main:

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

5. Deploy the code from the main branch.

<p align="right">(<a href="#lost--hound---a-pet-finder-mobile-application">back to top</a>)</p>
