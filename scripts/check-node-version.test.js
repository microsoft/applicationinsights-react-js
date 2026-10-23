/* eslint-disable @typescript-eslint/no-var-requires -- Node runs this dependency-free test file as CommonJS. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { isSupportedNodeVersion, checkNodeVersion } = require("./check-node-version");

test("accepts the security releases and later patches within supported lines", () => {
    [
        "22.23.4", "24.22.1", "26.12.1",
        "v24.22.1", "22.23.5", "24.22.2", "26.12.2",
        "22.24.0", "24.23.0", "26.13.0"
    ].forEach(version => {
        assert.equal(isSupportedNodeVersion(version), true, version);
    });
});

test("rejects older releases, unreviewed major versions, and prereleases", () => {
    [
        "18.20.8", "20.20.0", "22.23.3", "24.22.0", "26.12.0",
        "22.22.99", "24.21.99", "26.11.99",
        "23.99.0", "25.99.0", "27.0.0",
        "24.22.1-rc.1", "24.22.1+custom", "24", "24.x", "invalid", ""
    ].forEach(version => {
        assert.equal(isSupportedNodeVersion(version), false, version);
    });
});

test("the developer runtime pin meets the security baseline", () => {
    const version = fs.readFileSync(path.join(__dirname, "..", ".nvmrc"), "utf8").trim();
    assert.equal(isSupportedNodeVersion(version), true, version);
});

test("both build matrices map stable job names to patched runtimes", () => {
    ["ci.yml", "npm-grunt.yml"].forEach(file => {
        const workflow = fs.readFileSync(path.join(__dirname, "..", ".github", "workflows", file), "utf8");
        assert.ok(workflow.includes("name: build (${{ matrix.node-line }})"), file);
        assert.ok(workflow.includes("node-version: ${{ matrix.node-version }}"), file);
        const entries = [...workflow.matchAll(/^\s*- node-line: (\d+\.x)\r?\n\s*node-version: "([^"]+)"\s*$/gm)];
        assert.deepEqual(entries.map(entry => entry[1]), ["22.x", "24.x"], file);
        entries.forEach(([, line, version]) => {
            assert.equal(isSupportedNodeVersion(version), true, file + ": " + version);
            assert.equal(line, version.split(".")[0] + ".x", file + ": " + line);
        });
    });
});

test("the current runtime meets the security baseline", () => {
    assert.doesNotThrow(checkNodeVersion);
});
