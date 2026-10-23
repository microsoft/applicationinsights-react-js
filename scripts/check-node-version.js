const minimumVersions = {
    22: [23, 4],
    24: [22, 1],
    26: [12, 1]
};

function isSupportedNodeVersion(version) {
    const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(version);
    if (!match) {
        return false;
    }

    const minimum = minimumVersions[Number(match[1])];
    const minor = Number(match[2]);
    const patch = Number(match[3]);
    return !!minimum && (minor > minimum[0] || (minor === minimum[0] && patch >= minimum[1]));
}

function checkNodeVersion() {
    if (!isSupportedNodeVersion(process.versions.node)) {
        throw new Error(
            "Repository tooling requires Node.js 22.23.4+, 24.22.1+, or 26.12.1+ within those major versions " +
            "(October 21, 2026 security baseline). Current version: " + process.version +
            ". Use the version in .nvmrc. This does not change the browser SDK's consumer requirements."
        );
    }
}

module.exports = { isSupportedNodeVersion, checkNodeVersion };

if (require.main === module) {
    checkNodeVersion();
}
