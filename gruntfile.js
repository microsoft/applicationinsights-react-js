module.exports = function (grunt) {

   const versionPlaceholder = '"#version#"';

   const aiCoreDefaultNameReplacements = [
   ];

   const aiDefaultNameReplacements = [
    ];

    const aiInternalConstants = [
        "./src/InternalConstants.ts"
    ];

    function _encodeStr(str) {
        return str.replace(/\\/g, '\\\\').
        replace(/"/g, '\\"').
        replace(/'/g, '\\\'').
        replace(/\u0008/g, '\\b').
        replace(/\r/g, '\\r').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f');

    }

    function _createRegEx(str) {
        // Converts a string into a global regex, escaping any special characters
        return new RegExp(str.replace(/([.+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g');
    }
    
    function setVersionNumber(path, packageVersion) {
        var expectedVersion = _createRegEx(versionPlaceholder);
        var replaceVersion = "'" + packageVersion + "'";
        var srcPath = path + '/src';

        // This is the grunt string-replace configuration to replace version placeholder with the actual version number
        return {
            files: [{
                expand: true,
                cwd: srcPath,
                dest: srcPath,
                src: '**/*.ts'
            }],
            options: {
                replacements: [{
                    pattern: expectedVersion,
                    replacement: replaceVersion
                }]
            }
        };
    }

    function restoreVersionPlaceholder(path, packageVersion) {
        var expectedVersion1 = _createRegEx("'" + packageVersion + "'");
        var expectedVersion2 = _createRegEx('"' + packageVersion + '"');
        var srcPath = path + '/src';

        // This is the grunt string-replace configuration to replace the actual version number with the version placeholder
        return {
            files: [{
                expand: true,
                cwd: srcPath,
                dest: srcPath,
                src: '**/*.ts'
            }],
            options: {
                replacements: [{
                    pattern: expectedVersion1,
                    replacement: versionPlaceholder
                },{
                    pattern: expectedVersion2,
                    replacement: versionPlaceholder
                }]
            }
        };
    }

    function deepMerge(target, src) {
        try {
            var newValue = Object.assign({}, target, src);

            if (target && src) {
                Object.keys(target).forEach((key) => {
                    // Any existing src[key] value would have been assigned over the target[key] version
                    if (src[key] !== undefined) {
                        if (Array.isArray(newValue[key])) {
                            target[key].forEach((value) => {
                                newValue[key].push(value);
                            });
                        } else if (typeof newValue[key] === "object") {
                            // Make sure we merge all properties
                            newValue[key] = deepMerge(newValue[key], target[key]);
                        }
                    }
                });
            }

            return newValue;
        } catch (e) {
            console.error("stack: '" + e.stack + "', message: '" + e.message + "', name: '" + e.name + "'");
        }
    }

    // const perfTestVersions = ["2.0.0","2.0.1","2.1.0","2.2.0","2.2.1","2.2.2","2.3.0","2.3.1",
    // "2.4.1","2.4.3","2.4.4","2.5.2","2.5.3","2.5.4","2.5.5","2.5.6","2.5.7","2.5.8","2.5.9","2.5.10","2.5.11",
    // "2.6.0","2.6.1","2.6.2","2.6.3","2.6.4","2.6.5","2.7.0"];
    const perfTestVersions=["2.8.1"];

    function buildConfig(modules) {
        var buildCmds = {
            ts: {
                options: {
                    comments: true
                }            
            },
            "eslint-ts": {
                options: {
                    debug: true
                }
            },
            "ai-minify": {
                options: {
                    debug: true,
                    //testOnly: true,
                }
            },
            "qunit" : {
                all: {
                    options: {
                    }
                }
            },
            connect: {
                server: {
                    options: {
                        port: 9001,
                        base: '.',
                        debug: true
                    }
                }        
            },
            "string-replace": {

            }
        };

        for (var key in modules) {
            if (modules.hasOwnProperty(key)) {
                var modulePath = modules[key].path;
                var moduleCfg = modules[key].cfg;
                var packageJsonFile = modulePath + '/package.json';

                if (grunt.file.exists(packageJsonFile)) {
                    // Read the actual module version from the package.json
                    var pkg = grunt.file.readJSON(modulePath + '/package.json');

                    var addMinifyTasks = modules[key].autoMinify !== false;
                    if (addMinifyTasks) {
                        var nameMaps = aiDefaultNameReplacements;
                        var internalConstants = aiInternalConstants;
                        if (pkg['name'] === "@microsoft/applicationinsights-core-js") {
                            nameMaps = aiCoreDefaultNameReplacements;
                            internalConstants = [ "./src/JavaScriptSDK/InternalConstants.ts" ];
                        }
    
                        var aiMinify = buildCmds["ai-minify"];
                        aiMinify[key] = {
                            options: {
                                projectRoot: modulePath,
                                src: "./src/**/*.ts",
                                nameMaps: nameMaps,
                                internalConstants: internalConstants
                            }
                        };
    
                        aiMinify[key + "-reverse"] = {
                            options: {
                                projectRoot: modulePath,
                                src: "./src/**/*.ts",
                                restore: true,
                                nameMaps: nameMaps,
                                internalConstants: internalConstants
                            }
                        };
                    }

                    var addStringReplace = modules[key].stringReplace !== false;
                    if (addStringReplace) {
                        var replaceCmds = buildCmds['string-replace'];
                        // Read the actual module version from the package.json
                        var packageVersion = pkg['version'];

                        replaceCmds[key] = setVersionNumber(modulePath, packageVersion);
                        replaceCmds[key + '-reverse'] = restoreVersionPlaceholder(modulePath, packageVersion);                        
                    }
                }

                if (grunt.file.exists(modulePath + '/src/tsconfig.json')) {
                    // Use the src tsconfig (if available)
                    buildCmds.ts[key] = {
                        'tsconfig': modulePath + "/src/tsconfig.json",
                    };
                } else if (grunt.file.exists(modulePath + '/tsconfig.json')) {
                    // Otherwise fall back to the root tsconfig (if available)
                    buildCmds.ts[key] = {
                        'tsconfig': modulePath + "/tsconfig.json",
                    };
                } else {
                    throw new Error("TSConfig not found for [" + key + "]");
                }

                if (moduleCfg) {
                    buildCmds.ts[key] = Object.assign(buildCmds.ts[key], moduleCfg);
                }

                // If the tests have their own tsconfig, add that as a new target
                var addQunit = false;
                var testRoot = "";
                if (modules[key].testHttp !== false) {
                    testRoot = "http://localhost:9001/";
                }

                var testUrl = testRoot + modulePath + "/test/UnitTests.html";
                if (grunt.file.exists(modulePath + '/test/tsconfig.json')) {
                    addQunit = true;
                    buildCmds.ts[key + '-tests'] = {
                        tsconfig: modulePath + "/test/tsconfig.json",
                        src: [
                            modulePath + "/test/Unit/src/**/*.ts"
                        ],
                        out: modulePath + "/test/Unit/dist/" + (modules[key].unitTestName || key + ".tests.js")
                    };
                } else if (grunt.file.exists(modulePath + '/Tests/tsconfig.json')) {
                    addQunit = true;
                    testUrl = testRoot + modulePath + "/Tests/UnitTests.html";
                    buildCmds.ts[key + '-tests'] = {
                        tsconfig: modulePath + "/Tests/tsconfig.json",
                        src: [
                            modulePath + "/Tests/Unit/src/**/*.ts"
                        ],
                        out: modulePath + "/Tests/Unit/dist/" + (modules[key].unitTestName || key + ".tests.js")
                    };
                }

                if (addQunit) {
                    // Remove any "/./" values from the path
                    testUrl = testUrl.replace(/\/\.\//g, "/");
 
                    buildCmds.qunit[key] = {
                        options: {
                            urls: [ testUrl ],
                            timeout: 300 * 1000, // 5 min
                            console: true,
                            summaryOnly: false,
                            httpBase: ".",
                            puppeteer: { 
                                headless: true, 
                                timeout: 30000,
                                ignoreHTTPErrors: true,
                                args:[
                                    "--enable-precise-memory-info",
                                    "--expose-internals-for-testing",
                                    "--no-sandbox"
                                ]
                            }
                        }
                    };
                }

                // If the tests have their own tsconfig, add that as a new target
                addQunit = false;
                var testUrl = testRoot + modulePath + "/test/PerfTests.html";
                if (grunt.file.exists(modulePath + '/test/PerfTests.html')) {
                    addQunit = true;
                    buildCmds.ts[key + '-perftest'] = {
                        tsconfig: modulePath + "/test/tsconfig.json",
                        src: [
                            modulePath + "/test/Perf/src/**/*.ts"
                        ],
                        out: modulePath + "/test/Perf/dist/" + (modules[key].perfTestName || key + ".perf.tests.js")
                    };
                } else if (grunt.file.exists(modulePath + '/Tests/PerfTests.html')) {
                    addQunit = true;
                    testUrl = testRoot + modulePath + "/Tests/PerfTests.html";
                    buildCmds.ts[key + '-perftest'] = {
                        tsconfig: modulePath + "/Tests/tsconfig.json",
                        src: [
                            modulePath + "/Tests/Perf/src/**/*.ts"
                        ],
                        out: modulePath + "/Tests/Perf/dist/" + (modules[key].perfTestName || key + ".perf.tests.js")
                    };
                }

                if (addQunit) {
                    var testUrls = [ testUrl ];
                    if (key === "aisku") {
                        testUrls = perfTestVersions.map((version) => {
                            return testUrl + `?version=${version}`;
                        });
                    }

                    buildCmds.qunit[key + "-perf"] = {
                        options: {
                            urls: [ testUrls ],
                            timeout: 300 * 1000, // 5 min
                            console: true,
                            summaryOnly: false,
                            puppeteer: { 
                                headless: true, 
                                timeout: 30000, 
                                ignoreHTTPErrors: true,
                                args:[
                                    '--enable-precise-memory-info',
                                    '--expose-internals-for-testing',
                                    "--no-sandbox"
                                ] 
                            }
                        }
                    };
                }

                let esLintCmd = buildCmds["eslint-ts"];
                esLintCmd[key + '-lint'] = {
                    options: {
                        tsconfig: modulePath + '/tsconfig.json'
                    }
                };

                if (moduleCfg) {
                    esLintCmd[key + '-lint'] = Object.assign(buildCmds.ts[key], moduleCfg);
                }

                esLintCmd[key + '-lint-fix'] = deepMerge({ options: { fix: true } }, esLintCmd[key + '-lint']);
            }
        }

        return buildCmds;
    }

    try {
        var theBuildConfig = deepMerge(buildConfig({
            "react":                {
                                        autoMinify: false,
                                        path: "./applicationinsights-react-js",
                                        cfg: {
                                            src: [
                                                "./applicationinsights-react-js/src/index.ts"
                                            ]
                                        },
                                        unitTestName: "reactplugin.tests.js"
                                    },
    
            // Tools
            "rollupuglify":         {
                                        autoMinify: false,
                                        path: "./tools/rollup-plugin-uglify3-js",
                                        cfg: {
                                            src: [
                                                "./tools/rollup-plugin-uglify3-js/src/*.ts",
                                                "!node_modules/**"
                                            ],
                                            out: './tools/rollup-plugin-uglify3-js/out/src/uglify3-js.js'
                                        },
                                        testHttp: false
                                    },
            // Common
            "tst-framework":        {
                                        autoMinify: false,
                                        path: "./common/Tests/Framework",
                                        cfg: {
                                            src: [
                                                "./common/Tests/Framework/src/*.ts"
                                            ]
                                        } 
                                    }
        }));
    
        function tsBuildActions(name, addTests, replaceName) {
            var actions = [
                "eslint-ts:" + name + "-lint-fix"
            ];
    
            var aiMinifyConfig = theBuildConfig["ai-minify"] || {};
            var gruntTsConfig = theBuildConfig["ts"];
            var replaceConfig = theBuildConfig["string-replace"] || {};
            if (replaceName === true || replaceConfig[name]) {

                actions.push("string-replace:" + name);
                if (aiMinifyConfig[name]) {
                    // Make sure all translations are reversed first
                    actions.push("ai-minify:" + name + "-reverse");
                    // Attempt to compile without any translations (Validates that the original source code is fine before transforming it)
                    actions.push("ts:" + name);
                    actions.push("ai-minify:" + name);
                }

                // Now perform the "real" final compile after minification
                actions.push("ts:" + name);
        
                if (addTests && gruntTsConfig[name + "-tests"]) {
                    actions.push("ts:" + name + "-tests");
                }
                if (aiMinifyConfig[name + "-reverse"]) {
                    actions.push("ai-minify:" + name + "-reverse");
                }
    
                actions.push("string-replace:" + name + "-reverse");
            } else {
                if (aiMinifyConfig[name]) {
                    // Attempt to compile without any translations (Validates that the original source code is fine before transforming it)
                    actions.push("ts:" + name);
                    actions.push("ai-minify:" + name);
                }

                // Now perform the "real" final compile after minification
                actions.push("ts:" + name);
                if (addTests && gruntTsConfig[name + "-tests"]) {
                    actions.push("ts:" + name + "-tests");
                }
                
                if (aiMinifyConfig[name + "-reverse"]) {
                    actions.push("ai-minify:" + name + "-reverse");
                }
            }
    
            actions.push("eslint-ts:" + name + "-lint");
    
            return actions;
        }

        function tsTestActions(name, minifySrc, compileSrc) {
            var gruntTsConfig = theBuildConfig["ts"];
            var aiMinifyConfig = theBuildConfig["ai-minify"] || {};

            var actions = [
                "connect"
            ];

            var replaceConfig = theBuildConfig["string-replace"] || {};
            if (replaceConfig[name]) {
                actions.push("string-replace:" + name);
            }

            if (aiMinifyConfig[name]) {
                if (minifySrc) {
                    // Attempt to compile with translations (Validates that the original source code is fine before transforming it)
                    actions.push("ai-minify:" + name);
                } else if (aiMinifyConfig[name + "-reverse"]){
                    // Attempt to compile without any translations (Validates that the original source code is fine before transforming it)
                    actions.push("ai-minify:" + name + "-reverse");
                }

                if (compileSrc && gruntTsConfig[name]) {
                    actions.push("ts:" + name);
                }
            }

            // If this helper is called then these should always exist
            actions.push("ts:" + name + "-tests");
            actions.push("qunit:" + name);

            if (minifySrc && aiMinifyConfig[name + "-reverse"]) {
                actions.push("ai-minify:" + name + "-reverse");
            }

            if (replaceConfig[name]) {
                actions.push("string-replace:" + name + "-reverse");
            }

            return actions;
        }

        function minTasks(name) {
            var actions = [
            ];
    
            var aiMinifyConfig = theBuildConfig["ai-minify"] || {};
            if (aiMinifyConfig[name]) {
                actions.push("ai-minify:" + name);
            }

            return actions;
        }

        function restoreTasks(name) {
            var actions = [
            ];
    
            var aiMinifyConfig = theBuildConfig["ai-minify"] || {};
            if (aiMinifyConfig[name + "-reverse"]) {
                actions.push("ai-minify:" + name + "-reverse");
            }

            return actions;
        }

        grunt.initConfig(deepMerge(
            theBuildConfig, {
            uglify: {
                snippetvNext: {
                    files: {
                        'AISKU/snippet/snippet.min.js': ['AISKU/snippet/snippet.js']
                    },
                    options: {
                        sourceMap: false,
                        ie8: true,
                        compress: {
                          passes:3,
                          unsafe: true,
                        },
                        output: {
                          webkit:true
                        }
                    }
                }
            },
            'string-replace': {
            }
        }));
    
        grunt.event.on('qunit.testStart', function (name) {
            grunt.log.ok('Running test: ' + name);
        });
    
        grunt.loadNpmTasks("@nevware21/grunt-ts-plugin");
        grunt.loadNpmTasks("@nevware21/grunt-eslint-ts");
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-qunit');
        grunt.loadNpmTasks('grunt-contrib-connect');
        grunt.loadNpmTasks('grunt-string-replace');
        grunt.loadTasks('./tools/grunt-tasks');
        grunt.registerTask("default", ["ts:rollupuglify", "ts:default"]);

        grunt.registerTask("ai", tsBuildActions("react"));
        grunt.registerTask("ai-min", minTasks("react"));
        grunt.registerTask("ai-restore", restoreTasks("react"));
        grunt.registerTask("aitests", tsTestActions("react"));
        grunt.registerTask("ai-mintests", tsTestActions("react", true));

        grunt.registerTask("test", ["connect", "ts:default", "ts:test", "ts:testSchema", "ts:testE2E", "qunit:all"]);

        grunt.registerTask("react", tsBuildActions("react"));
        grunt.registerTask("react-min", minTasks("react"));
        grunt.registerTask("react-restore", restoreTasks("react"));
        grunt.registerTask("reacttests", tsTestActions("react"));
        grunt.registerTask("react-mintests", tsTestActions("react", true));

        grunt.registerTask("rollupuglify", tsBuildActions("rollupuglify"));
        grunt.registerTask("tst-framework", tsBuildActions("tst-framework"));
        grunt.registerTask("serve", ["connect:server:keepalive"]);
    } catch (e) {
        console.error(e);
        console.error("stack: '" + e.stack + "', message: '" + e.message + "', name: '" + e.name + "'");
    }
};
