# Contributing to neverthrow-pattern

Thank you for your interest in contributing to neverthrow-pattern! This document provides guidelines and instructions for contributing to this project.

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
    ```bash
    pnpm install
    ```
3. Run tests to make sure everything is working:
    ```bash
    pnpm test
    ```

## Making Changes

1. Create a new branch:
    ```bash
    git checkout -b my-feature
    ```
2. Make your changes
3. Run tests to ensure your changes don't break existing functionality:
    ```bash
    pnpm test
    ```
4. Build the project:
    ```bash
    pnpm build
    ```

## Creating Changesets

We use [Changesets](https://github.com/changesets/changesets) to manage versions and changelogs.

### When to Create a Changeset

Create a changeset when you:

-   Add a new feature
-   Fix a bug
-   Make a breaking change
-   Update dependencies
-   Make any significant change that should be noted in the changelog

### How to Create a Changeset

After making your changes:

1. Run the changeset command:
    ```bash
    pnpm changeset
    ```
2. Follow the prompts:
    - Select the package(s) your changes affect (usually just neverthrow-pattern)
    - Choose the type of semver change (patch, minor, major)
    - Provide a summary of your changes
3. Commit the generated changeset file along with your other changes:
    ```bash
    git add .
    git commit -m "Your commit message"
    ```

## Pull Requests

1. Push your changes to your fork:
    ```bash
    git push origin my-feature
    ```
2. Open a pull request against the master branch
3. Ensure your PR includes:
    - A clear description of the changes
    - Tests for new functionality
    - A changeset describing the change (if applicable)
4. Wait for code review and CI checks to pass

## Release Process

Releases are handled automatically by GitHub Actions:

1. When changes are merged to master, a PR is created or updated with all pending changesets
2. When the release PR is merged, a new version is published to npm

## Code Style and Standards

-   Follow the existing code style
-   Include tests for new functionality
-   Ensure TypeScript typings are correct
-   Keep exports minimal and focused

Thank you for contributing to neverthrow-pattern!
