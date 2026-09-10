# Repository instructions

- Dependency installation must work with both the public npm registry and Microsoft's `1ds-sdk-js` Azure Artifacts feed.
- Do not assume that the newest version allowed by a dependency range is available from the Azure Artifacts feed. Preserve known-compatible lockfile versions and use exact npm overrides when a transitive range resolves to a version missing from the feed.
- Keep public npm registry URLs in `package-lock.json` so external contributors can install dependencies without Microsoft credentials.
- Before accepting a dependency update, verify that the selected package versions and tarballs are available from the `1ds-sdk-js` feed used by Microsoft builds.
