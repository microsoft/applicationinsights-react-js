# Releases

## 19.3.5 (March 14th, 2025)

This release targets React 19 and upgrades to Application Insights 3.3.6. We are aligning the major version number with the React framework, following the numbering convention outlined [here](https://github.com/microsoft/applicationinsights-angularplugin-js/issues/57)
For users on React 18.x, ongoing maintenance and releases will be available from the [release18.x](https://github.com/microsoft/applicationinsights-react-js/tree/18.3.6)
For users on React 17.x, ongoing maintenance and releases will be available from the [release17.3.x](https://github.com/microsoft/applicationinsights-react-js/tree/17.3.6)

### Changelog

- #153 [React19] upgrade react to 19

## 18.3.6 (March 12th, 2025)

This release targets React 18 and upgrades to Application Insights 3.3.6. We are aligning the major version number with the React framework, following the numbering convention outlined [here](https://github.com/microsoft/applicationinsights-angularplugin-js/issues/57)
For users on React 17.x, ongoing maintenance and releases will be available from the [release17.3.x](https://github.com/microsoft/applicationinsights-react-js/tree/17.3.6)

### Changelog

- #142 [React18] upgrade to react 18 

## 17.3.6 (March 6th, 2025)

### Changelog

- #144 [Pre-Release] Update Application Insights dependencies to v3.3.6 

## 17.3.5 (Feb 4th, 2025)

### Changelog

- #139 Update to ApplicationInsights 3.3.5
- #127 Add AI version update script to assist with automated integration testing
- #130 Update Stale Issue action
- #131 Update Lock Issue action

## 17.3.4 (Oct 31st, 2024)

### Changelog

- #122 Bump http-proxy-middleware in /sample/applicationinsights-react-sample
- #123 Bump micromatch in /sample/applicationinsights-react-sample
- #124 [Pre-Release] Update Application Insights dependencies to v3.3.4

## 17.3.3 (Sep 27th, 2024)

### Changelog

- #112 Bump micromatch from 4.0.5 to 4.0.8
- #115 Bump serve-static from 1.15.0 to 1.16.2 
- #116 Bump express in /sample/applicationinsights-react-sample
- #118 [Pre-Release] Update Application Insights dependencies to v3.3.3

## 17.3.2 (Sep 3rd, 2024)

This release contains a potential type break change due to the definition of the expCfg in [IConfiguration](https://github.com/microsoft/ApplicationInsights-JS/blob/main/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IConfiguration.ts)

### Changelog

- #107 [doc] add document for how to fix type error in extensions for #95
- #109 Bump braces from 3.0.2 to 3.0.3
- #111 Bump webpack in /sample/applicationinsights-react-sample
- #113 [Pre-Release] Update Application Insights dependencies to v3.3.2

## 17.3.1 (Aug 20th, 2024)

### Changelog

- #104 Add an Example for Using startTrackPage and stopTrackPage to Measure Duration in an SPA 
- #106 Fix ITelemetryItem tags initialisation in sample 
- #108 [Pre-Release] Update Application Insights dependencies to v3.3.1 

### Potential breaking change (from @microsoft/applicationInsights-web v3.3.1)

This release contains a potential break change due to the new configuration **expCfg** under [IConfiguration](https://github.com/microsoft/ApplicationInsights-JS/blob/main/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IConfiguration.ts)

## 17.3.0 (July 2nd, 2024)

### Changelog

- #101 [Pre-Release] Update Application Insights dependencies to v3.3.0
  - Adds support to internally defer initialization completion of the SDK while waiting for the connectionString, instrumentationKey or endpointURL to be resolved via a Promise.
  - During this period the SDK will not send any telemetry, and it will be internally batched if the promise(s) never resolve then the telemetry will be dropped.
- #102 Bump braces from 3.0.2 to 3.0.3 in /sample/applicationinsights-react-sample
- #99 Update README.md
- #93 Bump express from 4.18.2 to 4.19.2 in /sample/applicationinsights-react-sample
- #71 Update Sample ApplicationInsightsService.tsx

### Potential breaking change (from @microsoft/applicationInsights-web v3.3.0)

This release contains a potential break change due to enhancing the definition of the [IConfiguration](https://github.com/microsoft/ApplicationInsights-JS/blob/main/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IConfiguration.ts) to support Promise types for the connectionString, instrumentationKey and endpointURL; any extension that relies on these base interfaces will VERY likely cause TypeScript to fail with potential warnings about the types being different.

## 17.2.0 (May 6th, 2024)

### Changelog

- #97 [pre-release] update application insight to 3.2.0 

## 17.1.2 (Mar 21st, 2024)

### Changelog

- #87 [pre-release] update application insight to 3.1.2 and remove node 14 from build 

## 17.1.1 (Mar 13rd, 2024)

### Changelog

- #84 [pre-release] update application insight to 3.1.1 

## 17.1.0 (Feb 15th, 2024)

### Changelog

- #75 Update Application Insights to ^3.1.0

## 17.0.4 (Feb 12th, 2024)

### Changelog

- #76 [npm fix] remove sample project from rush
- #75 Update Application Insights to ^3.0.8
- #77 Update @microsoft/rush to ^5.113.4
- #78 Bump postcss from 8.4.29 to 8.4.35

## 17.0.3 (Nov 3rd, 2023)

### Changelog

- #65 [pre-release] udpate application insight dependency, get ready for release 


## 17.0.2 (Oct 13rd, 2023)

### Changelog

- #60 [fix] add ts-utils dependency in package.json

## 17.0.1 (Sep 26th, 2023)

### Changelog

- #32 Fix Type error caused by application-insights
- #52 Update sample dependency 
- #55 Fix skipFirstRun at useCustomEvent in strict mode 


## 17.0.0 (July 21st, 2023)

Major update to support ApplicationInsights v3.x, see the [ApplicationInsights breaking changes](https://microsoft.github.io/ApplicationInsights-JS/upgrade/v3_BreakingChanges.html)

We are also re-numbering the plugin to match the major version number of the targeted react version used to create the plugin.

### Changelog

- #42 ApplicationInsights-JS v3 Compatibility
- #45 Update main branch to prepare for next major version.
- #47 Merge release3.x changes into main
- #49 Dynmic Config Change
- #50 fix version update

## 3.4.3 (June 8th, 2023)

Version 3.x is now being maintained / released from the [release3.x branch](https://github.com/microsoft/applicationinsights-react-js/tree/release3.x) as
[main](https://github.com/microsoft/applicationinsights-react-js/tree/main) is being updated to support [ApplicationInsights 3.x](https://github.com/microsoft/ApplicationInsights-JS/blob/main/RELEASES.md) and will have it's major version number bumped to match the major version of the supported React-JS version (which will be v17.x as the first release)
### Changelog

- #44 [Update to ApplicationInsights ^2.8.14 from ^2.8.12](https://github.com/microsoft/ApplicationInsights-JS/blob/master/RELEASES.md)
- Moved to release3.x branch

## 3.4.2 (Apr 12th, 2023)

### Changelog

- [Released from applicationinsights-react-js Repo](https://github.com/microsoft/applicationinsights-react-js)
- #39 Update to ApplicationInsights ^2.8.12
- #36 Internal Task 17133116: Add Policheck exclusion file
- #35 Fix up formatting / typo's in release notes

## 3.4.1 (Feb 7th, 2023)

### Changelog

- [Released from applicationinsights-react-js Repo](https://github.com/microsoft/applicationinsights-react-js)
- Updates React Plugin to v3.4.1 (with UNPINNED ApplicationInsights ^2.8.10 as dependency) -- using React 17, compatible with React 18
- #33 Update to ApplicationInsights v2.8.10
- #31 Update base applicationinsights to version 2.8.9
- #30 Add code owners
- #26 Change react-scripts to a dev dependency
- #23 Add --no-sandbox to test runs

## 3.4.0 (Aug 15th, 2022)

- [Released from applicationinsights-react-js Repo](https://github.com/microsoft/applicationinsights-react-js)
- Updates React Plugin to v3.4.0 (with UNPINNED ApplicationInsights ^2.8.5 as dependency) -- using React 17, compatible with React 18

### Changelog

- #14 Add react sample and build with rush
- #15 Upgrade to support React 18
- #17 Add nightly release documentation
- #16  Address Component Governance issues

## 3.3.6 (July 27th, 2022)

- First release from [new repo](https://github.com/microsoft/applicationinsights-react-js)
- Updates React Plugin to v3.3.6 (with UNPINNED ApplicationInsights ^2.8.5 as dependency) -- using React 17

## 3.3.5 (Jul 6th, 2022)

- [Released from ApplicationInsights Repo](https://github.com/Microsoft/ApplicationInsights-JS)
- Updates React Plugin to v3.3.5 (with v2.8.5 as dependency) -- using React 17

### Changelog

- #1636 [BUG] measurements not being sent when using stopTrackEvent(name, properties, measurements);
- #1857 [BUG] CDN Packaging is not exposing the internal tools (CoreUtils / Telemetry / etc)
  - This was caused by the updated tree-shaking component that we used, fixing this has increased the CDN payload but it provides backward compatibility again
- #1852 [BUG] Snippet initialization with IE8 fails with minified code (works with un-minified code)
  - This was specific to IE8 usages
- #1076 Refactor code to provide better tree shaking and minification of generated code
  - Final stage which provides automatic name crunching, however, because of the fix for #1857 the CDN package size does not show the full effect of this improvement
- #1860 Address Component Governance issues

## 3.3.4 (Jun 1st, 2022)

- [Released from ApplicationInsights Repo](https://github.com/Microsoft/ApplicationInsights-JS)
- Updates React Plugin to v3.3.4 (with v2.8.4 as dependency) -- using React 17

### Changelog

- #198 Run-time Telemetry initializers for Ajax requests
- #176 Single Page Application Page View Tracking
- #1776 How to modify traceflag in traceparent header?
- #1846 Task 7496325: Add Distributed tracing population for the properties for the core
- #1838 [master] Task 14447552: Fix Component Governance vulnerabilities
- #1841 Adding Microsoft SECURITY.MD
- #1845 add readme for ikey error messge
- #1840 add disableIkeyMessage config

## 3.3.3 (May 3rd, 2022)

- [Released from ApplicationInsights Repo](https://github.com/Microsoft/ApplicationInsights-JS)
- Updates React Plugin to v3.3.3 (with v2.8.3 as dependency) -- using React 17

This release has been manually validated to work with IE8 both directly and by extending the provided classes. While the previous version 2.8.2 also fully supported IE8 it did not handle classes extending the all of Core classes correctly in multiple cases. If you need to support IE8 it is strongly advised that you upgrade to, validate and use this version.

### Changelog

- #1831 Updates to dynamicProto() v1.1.6 which provides a final edge case fix for IE8
  - [#50](https://github.com/microsoft/DynamicProto-JS/issues/50) [IE8] Fix in 1.1.5 only handles 2 levels of dynamically nested classes
- #1828 Update README.md to redirect to Node.JS
- #1829 Extracting HOC tracked component class base for re-use
- #1804 [BUG] Error type in AppInsightsErrorBoundary after upgrading to react 18

## 3.3.2 (May 2nd, 2022)

- [Released from ApplicationInsights Repo](https://github.com/Microsoft/ApplicationInsights-JS)
- Updates React Plugin to v3.3.2 (with v2.8.2 as dependency) -- using React 17

This patch release restores complete ES3 support (broken in 2.8.0) and IE8 support (broken eariler via dynamicProto()) for the Sdk.

### Changelog

- #1822 [BUG] v2.8.1 with a Hosted IE environment fails to initialize for a hosted instance of IE #1822 (#1824)
- #1823 [BUG] IE8 Support was broken by several components #1823
- Also updates to dynamicProto() v1.1.5 to restore IE8 support

## 3.3.1 (Apr 22nd, 2022)

- [Released from ApplicationInsights Repo](https://github.com/Microsoft/ApplicationInsights-JS)
- Updates React Plugin to v3.3.1 (with v2.8.1 as dependency) -- using React 17

This patch release restores TypeScript 3.x support for the Sdk.

### Changelog

- #1807 [BUG] Angular project doesn't build after install latest version v.2.8.0
- #1810 v2.8.0 has incompatible TypeScript 3.x type declaration
- #1812 [BUG] Browser exceptions are no longer automatically tracked after 2.8.0
- #1814 [BUG]SPFx React project doesn't build after latest version of @microsoft/application-insights-core-js v.2.8.0 got published

## 3.3.0 (Apr 16th, 2022)

- [Released from ApplicationInsights Repo](https://github.com/Microsoft/ApplicationInsights-JS)
- Updates React Plugin to v3.3.0 (with v2.8.0 as dependency) -- using React 17

### Potential Breaking Change

- `fetch` Ajax tracking was also been change to be on by default from this version moving forward, if you are running in an environment without `fetch` support and you are using an incompatible polyfill (that doesn't identify itself as a polyfill) or the SDK you start seeing recursive or duplicate (`fetch` and `XHR` requests) being reported you WILL need to add `disableFetchTracking` with a value of `true` to your configuration to disable this functionality.
- TypeScript 4.x required for some typings from the core EnumHelperFuncs.d.ts  (Fixed in v2.8.1)

### Significant changes

This release adds support for the SDK to

- TelemetryInitializers have been moved to `BaseCore` so they are now available as part of all Sku's and not just those using the `analytics` plugin (@microsoft/applicationinsights-analytics-js) using the `appInsights.addTelemetryInitializer(...)`
- Web Events (addEventHandler) now support "event namespaces" (similar to jQuery) to enable the removing of events by just specifying the namespace and new specific `eventOn(...)` and `eventOff(...)` API's.
- Fully unload, removing all internal event handlers (may be re-initialized) via the `appInsights.unload(...)` function.
- Dynamically add a plugin to an already initialized SDK (optionally replacing an existing) via new `appInsights.addPlugin(...)` function
- New helper to get any plugin from an initialized SDK via `appInsights.getPlugin("...identifier...")`
- Dynamically remove a plugin via the `appInsights.getPlugin("...identifier..").remove()`
- Enable / Disable any plugin (even if the plugin doesn't support disabling itself) via `appInsights.getPlugin("...identifier...").setEnabled(true/false)`
- The standard name fro the `analytics` plugin @microsoft/applicationinsights-analytics-js has been renamed and is now exported as `AnalyticsPlugin`, for backward compatibility it is also exported as it's previous name `ApplicationInsights`, if you are using it directly it is recommended that you update to use the new exported name.

While this release contains a substantial amount of additional functionality and code, there has also been significant minification efforts (which also drove some of the SDK naming) to keep the minified code around the same size. We intend to keep working on additional improvements to attempt to bring the size changes down further. However, the minification improvements do generally cause a lower level of GZip compression most because of the removal of duplicate names. The main readme for the [AISKU](https://github.com/microsoft/ApplicationInsights-JS/tree/master/AISKU) has a table of the CDN base SKU sizes, as the CDN version includes all public API's (older versions for backward compatibility and newer smaller versions) when using NPM you should see smaller sizes than those shown.

> Note:
> Due to the above changes required to support the above, there may be some minor TypeScript Type compatibility warnings when you attempt to use components from v2.8.0 with older SDK's (forward compatibility), backward compatibility, using Core v2.8.0 with older components is supported and v2.8.0 is completely backward compatible. This is due to some API's now support both older (for back compat) and new enhanced arguments, we have attempted to keep these changes to a minimum.
> If you are getting typing errors such as "Argument of type 'XXXXX' os not assignable to parameter of type 'YYYY'", please ensure that you are using all v2.8.0 components and raise an issue if this does not resolve you issue. As a work around casting to work around this warning should not cause any issues.

> Due the the size of this change, the above date is the NPM release date and CDN deployment will be over an extended period.

### Changelog

- Task 13064945: Enable the option to remove all "added" SDK event listeners as part of calling teardown()
  - Partial, foundational support for #1427 Dynamically updating config (for extensions in my case)
- #1773 [BUG] IConfig and IConfiguration define different configuration "names" for the cookie manager config 
- #1779 Allow including custom properties in useTrackMetric
- #1791 Merge remote-tracking branch `upstream/beta` into `master`
  * Update version update script to support default "next" release version (major/minor) not just patch (#1756)
  * Additional Performance enhancements to use provided functions rather than internal polyfill's (#1758)
  * Enable GitHub Actions on [beta] branch
  * Beta Part 1: Part of Mega Dynamic Load/Unload support (#1766)
    - Refactor TelemetryPluginChain ready to start supporting load/unload
    - Move TelemetryInitializer to BaseCore
    - add getPlugin (will be used for remove)
    - Address Channel flush issue
  * Additional Performance enhancements to use provided functions rather than internal polyfill's (#1758)
  * Beta Part 2: Part of Mega Dynamic Load/Unload support (#1768)
    - Add Event Namespace support
    - Minification of constant values
    - Add part of the unload functionality (required for unified `teardown()` functionality)
  * Beta Part 3: Part of Mega Dynamic Load/Unload support (#1780)
    - Add Core SDK Unload support
  * Fix telemetry chain for null and undefined
  * Beta Part 4: Part of Mega Dynamic Load/Unload support (#1781)
    - Fix function typing issues
    - Update Analytics Extension to start supporting teardown / unload (more tests required)
    - Adds namespace option to instrumentation hooks (for debugging teardown issues)
    - Update AITest Class to log and optionally assert events and hooks that have not been removed
    - Add Update callback when plugins are added / removed (will be extended for config updates)
    - Some minor minification improvements
  * Add missing enum definition
  * Update Sender tests
  * Beta Part 5: Part of Mega Dynamic Load/Unload support (#1782)
    - Add Missing Exports
    - AnalyticsPlugin: Implement teardown and initial test validation
    - Dependencies Plugin: Implement teardown and initial test validation
    - Add flush() to IAppInsightsCore
  * AI Beta: Minor bug fixes and additional debug info (#1787)
  * Lint fixes: Enable Automatic formatting fixes (#1788)
  * Beta Part 6: Part of Mega Dynamic Load/Unload support (#1782) (#1789)
    - Add basic minimal unload / teardown support to all remaining components
    - Update rollup cleanup dependencies
  * Beta: Component Governance Updates to address known dependency issues (#1790)
- #1793 Master Minification Improvements
- #1796 Minification - Change to only use const enums internally
- #1798 More Common Minification Updates
- #1468 Enable fetch automatic dependency tracking by default
- #1805 Finalize and Update the processTelemetry helper functions

## 3.2.4 (Feb 28th, 2022)

- [Released from ApplicationInsights Repo](https://github.com/Microsoft/ApplicationInsights-JS)
- Updates React Plugin to v3.2.4 (with v2.7.4 as dependency)

This release is primarily a performance improvement release where we will now use any built in (or provided polyfill) function
over the internal polyfills for

- String trim()
- String endsWith()
- String startsWith()
- Additional Date toISOString()
- Array isArray()
- Array indexOf()
- Array map()
- Array reduce()
- Object freeze()
- Object seal()

### Changelog

- #1754 update react plugin readme
- #1758 Additional Performance enhancements to use provided functions rather than internal polyfill's

## 3.2.3 (Jan 31st, 2022)

- [Released from ApplicationInsights Repo](https://github.com/Microsoft/ApplicationInsights-JS)
- Updates the @microsoft/applicationinsights-shims module to 2.0.1
- Updates React Plugin to v3.2.3 (with v2.7.3 as dependency)

### Changelog

- #1735 [BUG] Dependency tracking is disabled when using an Embedded IE browser control
- #1736 [BUG] New Fetch keepAlive support can cause duplicate events to be sent during unload processing
- #1745 [Documentation] Document the deployed Module formats and release process
- #1746 [Documentation] Update AISku Size tracking
- #1744 Address CodeQL issues from https://github.com/microsoft/ApplicationInights-JS/security/code-scanning 
- Update to Rush 5.61.3 and NPM 8.4.0
- #1750 [Performance] Use the Date.toISOString() native function if it exists
- #1753 [Performance] Cache the result of the getGlobal() to reduce the number of typeof expressions

----
See [Releases from ApplicationInsights Repo](https://github.com/Microsoft/ApplicationInsights-JS/RELEASES.md) for previous release notes.
