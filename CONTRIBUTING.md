# Contributing

This project welcomes contributions and suggestions. Most contributions require you to
agree to a Contributor License Agreement (CLA) declaring that you have the right to,
and actually do, grant us the rights to use your contribution. For details, visit
https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need
to provide a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the
instructions provided by the bot. You will only need to do this once across all repositories using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)
or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Welcome

Welcome and thank you for your interest in contributing to ApplicationInsights-JS.

We strongly welcome and encourage contributions to this project. Please read the [contributor's guide][ContribGuide] located in the ApplicationInsights-Home repository. If making a large change we request that you open an [issue][GitHubIssue] first. We follow the [Git Flow][GitFlow] approach to branching.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

[ContribGuide]: https://github.com/microsoft/ApplicationInsights-Home/blob/master/CONTRIBUTING.md
[GitFlow]: http://nvie.com/posts/a-successful-git-branching-model/
[GitHubIssue]: https://github.com/microsoft/ApplicationInsights-JS/issues

## Clone and setup
1. Clone the repository and create a new branch
2. Select Node.js 24.22.1 (the version in `.nvmrc`) using your Node version manager.
   With nvm, run `nvm install` and `nvm use` from the repository root. With
   nvm-windows, run `nvm install 24.22.1` and `nvm use 24.22.1`.
3. Install all dependencies
	```
	npm install
	```
4. Build and test
	```
	npm run build
	npm run test
	```

### Node.js security baseline

Repository build, test, development, sample, and release tooling must use Node.js
22.23.4 or later in the 22.x line, 24.22.1 or later in the 24.x line, or 26.12.1 or
later in the 26.x line. These are the
[October 21, 2026 security release](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)
baselines. Node.js 18, 20, odd-numbered majors, and prereleases are not supported
for repository tooling. Review future major versions before enabling them.
This development policy does not change the published React plugin's browser
support or its React and Application Insights peer dependencies.

Run `npm run check-node-version` before installing dependencies or invoking tools
directly. The root and sample npm commands, Grunt, and the ZIP packaging script
also check the runtime. `npm run test:node-version` checks version boundaries and
the CI runtime selections without installing dependencies.

The same patched runtime is required for encoding-only tooling, including gzip
size reporting and ZIP packaging, as precautionary hardening. Compression remains
enabled; encoding-only use is not being classified as a decoding vulnerability.
Node-bundled libraries are updated through Node.js, not by changing unrelated npm
packages or the `@types/node` declarations.

The build and sample workflows exercise the patched 22.x and 24.x lines explicitly;
26.12.1+ meets the runtime guard but is not an additional CI lane. CodeQL
repository tooling uses `.nvmrc`. These selections do not replace Node embedded
in GitHub Actions or Azure DevOps tasks, the hosted runner's own runtime, or
consumer application runtimes. Those require updates by their respective owners.
Shared ReactJS release/nightly pipelines live in 1DS and are managed separately.

## Build and test

The root folder uses npm workspaces to manage sub-packages. When making changes, you can build and test using the following commands in the root folder:

1. npm run build

    This will build all packages in order of dependencies.

2. npm run test

    This will run tests in all packages.
