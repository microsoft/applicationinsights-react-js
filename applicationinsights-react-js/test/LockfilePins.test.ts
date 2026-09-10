const rootPackageJson = require("../../package.json");
const rootPackageLock = require("../../package-lock.json");

/**
 * Microsoft builds install from an Azure Artifacts feed that does not mirror every
 * version published to npmjs. Exact versions are pinned in the root package.json to
 * keep resolution on versions the feed can serve.
 *
 * A pin only takes effect if it is recorded in package-lock.json: npm installs from the
 * lockfile, and an "overrides" entry alone is ignored by the npm 10.x client used in CI.
 * These tests fail when a pin is declared but the lockfile was not regenerated.
 */
describe("lockfile pins", () => {
    const exactVersion = /^\d+\.\d+\.\d+$/;
    const pinnedDevDependencies = Object.entries<string>(rootPackageJson.devDependencies)
        .filter(([, range]) => exactVersion.test(range));

    it("pins at least the feed-constrained packages", () => {
        const pinned = pinnedDevDependencies.map(([name]) => name);

        expect(pinned).toContain("browserslist");
        expect(pinned).toContain("electron-to-chromium");
    });

    it.each(pinnedDevDependencies)("resolves %s to the pinned version in the lockfile", (name, range) => {
        const entry = rootPackageLock.packages[`node_modules/${name}`];

        expect(entry).toBeDefined();
        expect(entry.version).toBe(range);
    });

    it("keeps every override pinned to an exact version", () => {
        for (const [name, range] of Object.entries<string>(rootPackageJson.overrides || {})) {
            if (!exactVersion.test(range)) {
                continue;
            }

            const entry = rootPackageLock.packages[`node_modules/${name}`];

            expect(entry).toBeDefined();
            expect(entry.version).toBe(range);
        }
    });

    it("resolves packages from the public npm registry", () => {
        const privateFeeds = Object.entries<any>(rootPackageLock.packages)
            .filter(([, entry]) => typeof entry.resolved === "string" && /^https?:/.test(entry.resolved))
            .filter(([, entry]) => !entry.resolved.startsWith("https://registry.npmjs.org/"))
            .map(([name]) => name);

        expect(privateFeeds).toEqual([]);
    });
});
