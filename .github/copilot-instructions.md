# Repository instructions

- Dependency installation must work with both the public npm registry and Microsoft's `1ds-sdk-js` Azure Artifacts feed.
- Do not assume that the newest version allowed by a dependency range is available from the Azure Artifacts feed. Preserve known-compatible lockfile versions when a transitive range resolves to a version missing from the feed.
- Pin feed-constrained packages as exact root `devDependencies` and regenerate `package-lock.json`. An `overrides` entry alone is not recorded in the lockfile and is ignored by the npm 10.x client used in Microsoft builds, so the pin silently has no effect.
- Pin the whole dependency chain, not just the package that 404s: a pin cannot apply if a parent's range excludes it.
- Keep public npm registry URLs in `package-lock.json` so external contributors can install dependencies without Microsoft credentials.
- Before accepting a dependency update, verify that the selected package versions and tarballs are available from the `1ds-sdk-js` feed used by Microsoft builds. Metadata alone is not sufficient: a version can be listed while its tarball 404s, and a warm npm cache hides the failure. Verify with an empty cache (`npm pack <pkg>@<version> --cache <empty-dir>`).
