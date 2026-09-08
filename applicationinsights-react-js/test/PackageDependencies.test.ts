const packageJson = require("../package.json");

describe("package dependencies", () => {
    const corePackage = "@microsoft/applicationinsights-core-js";

    it("uses the consumer's core SDK while keeping build SDK versions aligned", () => {
        const coreVersion = packageJson.devDependencies[corePackage];

        expect(packageJson.dependencies[corePackage]).toBeUndefined();
        expect(packageJson.peerDependencies[corePackage]).toBe(`^${coreVersion}`);
        expect(packageJson.devDependencies["@microsoft/applicationinsights-properties-js"]).toBe(coreVersion);
    });
});
