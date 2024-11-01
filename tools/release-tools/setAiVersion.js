const fs = require("fs");
const globby = require("globby");

let newAiVer = null;
let testOnly = null;

const theVersion = require(process.cwd() + "/version.json");

function showHelp() {
    var scriptParts;
    var scriptName = process.argv[1];
    if (scriptName.indexOf("\\") !== -1) {
        scriptParts = scriptName.split("\\");
        scriptName = scriptParts[scriptParts.length - 1];
    } else if (scriptName.indexOf("/") !== -1) {
        scriptParts = scriptName.split("/");
        scriptName = scriptParts[scriptParts.length - 1];
    }

    console.log("");
    console.log(scriptName + " [<newAiVersion> [-test]");
    console.log("--------------------------");
    console.log(" <newAiVersion> - Identifies the application insights version to set for all packages");
    console.log(" -test       - Scan all of the package.json files and log the changes, but DON'T update the files");
}

function parseArgs() {
    if (process.argv.length < 2) {
        console.error("!!! Invalid number of arguments -- " + process.argv.length)
        return false;
    }

    let idx = 2;
    while(idx < process.argv.length) {
        let theArg = process.argv[idx];
        if (theArg === "-test") {
            testOnly = true;
        } else if (!newAiVer) {
            newAiVer = theArg;
        } else {
            console.error("!!! Invalid Argument [" + theArg + "] detected");
            return false;
        }

        idx ++;
    }

    // If no version,
    if (!newAiVer) {
        return false;
    }

    return true;
}

function shouldProcess(name) {
    if (name.indexOf("node_modules/") !== -1) {
        return false;
    }

    if (name.indexOf("common/temp") !== -1) {
        return false;
    }

    if (name.indexOf("examples/") !== -1) {
        return true;
    }

    if (name.indexOf("applicationinsights-react-js") !== -1) {
        return true;
    }

    if (name === "package.json") {
        return true;
    }

    return false;
}

function shouldUpdateDependency(name) {
    if (name.indexOf("@microsoft/applicationinsights-") === -1) {
        return false;
    }

    if (name.indexOf("applicationinsights-shims") !== -1) {
        return false;
    }

    if (name.indexOf("applicationinsights-rollup") !== -1) {
        return false;
    }

    return true;
}

function updateDependencies(target, newVersion) {
    let changed = false;
    if (target) {
        let isDigit = /^\d/.test(newVersion);
        Object.keys(target).forEach((value) => {
            if (shouldUpdateDependency(value)) {
                let version = target[value];
                if (version.startsWith("^") && isDigit) {
                    if (version !== "^" + newVersion) {
                        target[value] = "^" + newVersion;
                    }
                } else if (version.startsWith("~") && isDigit) {
                    if (version !== "~" + newVersion) {
                        target[value] = "~" + newVersion;
                    }
                } else if (version !== newVersion) {
                    target[value] = newVersion;
                }

                if (version != target[value]) {
                    console.log("          Updated: " + value + "  \"" + version + "\" => \"" + target[value] + "\"");
                    changed = true;
                } else {
                    console.log("          Skipped: " + value + "  \"" + version + "\"");
                }
            }
        });
    }

    return changed;
}

const setPackageJsonRelease = () => {
    const files = globby.sync(["./**/package.json", "!**/node_modules/**"]);
    let changed = false;
    files.map(packageFile => {
        // Don't update node_modules
        if (shouldProcess(packageFile)) {
            console.log("Loading - " + packageFile);

            let theFilename = packageFile;
            const package = require(process.cwd() + "\\" + theFilename);
            console.log("   Name - " + package.name);
    
            let updated = false;
            updated |= updateDependencies(package.dependencies, newAiVer);
            updated |= updateDependencies(package.peerDependencies, newAiVer);
            updated |= updateDependencies(package.devDependencies, newAiVer);

            if (updated && !testOnly) {
                // Rewrite the file
                const newContent = JSON.stringify(package, null, 4) + "\n";
                fs.writeFileSync(theFilename, newContent);
                changed = true;
            }
            console.log("          -------------------------------------------------------------------------------------");
        }
    });

    return changed;
};

if (parseArgs()) {
    if (setPackageJsonRelease()) {
        console.log("Version updated, now run 'npm run rupdate'");
    } else {
        console.log("Nothing Changed");
    }
} else {
    showHelp();
}
