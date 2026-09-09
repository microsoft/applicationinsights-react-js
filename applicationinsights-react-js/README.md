# Microsoft Application Insights JavaScript SDK - React Plugin

[![npm version](https://badge.fury.io/js/%40microsoft%2Fapplicationinsights-react-js.svg)](https://badge.fury.io/js/%40microsoft%2Fapplicationinsights-react-js)

React Plugin for the Application Insights Javascript SDK, enables the following:

- Tracking of router changes
- React components usage statistics

Full documentation for the React Plugin for the Application Insights JavaScript SDK can be found on [Microsoft Docs](https://docs.microsoft.com/azure/azure-monitor/app/javascript-react-plugin).

## Getting Started

Install the React plugin and the Application Insights web SDK together:

```bash
npm install @microsoft/applicationinsights-react-js @microsoft/applicationinsights-web
```

Use compatible versions of the two packages from the
[compatibility matrix](https://github.com/microsoft/applicationinsights-react-js#compatibility-matrix),
and update them together. Mismatched Application Insights dependencies can cause TypeScript errors
such as:

```plaintext
Type 'ReactPlugin' is not assignable to type 'ITelemetryPlugin'.
```

## Basic Usage

```js
import React from 'react';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from "history";

const browserHistory = createBrowserHistory({ basename: '' });
var reactPlugin = new ReactPlugin();
var appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
        extensions: [reactPlugin],
        extensionConfig: {
          [reactPlugin.identifier]: { history: browserHistory }
        }
    }
});
appInsights.loadAppInsights();

// To instrument various React components usage tracking, apply the `withAITracking` higher-order
// component function.

class MyComponent extends React.Component {
    ...
}

export default withAITracking(reactPlugin, MyComponent);
```
For `react-router v6` or other scenarios where router history is not exposed, appInsights config `enableAutoRouteTracking` can be used to auto track router changes.

```js
var reactPlugin = new ReactPlugin();
var appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
        enableAutoRouteTracking: true,
        extensions: [reactPlugin]
        }
    }
});
appInsights.loadAppInsights();
```

## Choosing a tracking approach

The tracking options collect different telemetry and can be used together:

| Option | Telemetry | When to use it |
|--------|-----------|----------------|
| `enableAutoRouteTracking` | Page views | Track URL changes made through the browser History API, including routes in a single-page application. Virtual page-view duration is reported as zero because a URL change does not identify when rendering finishes. |
| `autoTrackPageVisitTime` | `PageVisitTime` metrics | Measure how long a user stays on a page. The metric for the previous page is sent when the next page view is tracked. This is visit time, not page-load time. |
| `withAITracking` | `React Component Engaged Time (seconds)` metrics | Measure how long a wrapped React component is mounted, excluding idle time. The metric is sent when the component unmounts. |

For example, enable `enableAutoRouteTracking` for navigation telemetry and wrap only the
components whose engagement time you want to measure with `withAITracking`. Enabling automatic
route tracking does not make component tracking redundant because the options send different
telemetry.

Use the SDK's explicit tracking methods for application-specific telemetry:

| Method | Common use case |
|--------|-----------------|
| `trackEvent` | Record a user action or business event. Use `startTrackEvent` and `stopTrackEvent` when the event duration matters. |
| `trackPageView` | Record navigation when automatic route tracking is disabled, or attach custom page-view properties. Avoid calling it for the same navigation already captured by `enableAutoRouteTracking`. Use `startTrackPage` and `stopTrackPage` when you can determine when a virtual page finishes loading. |
| `trackPageViewPerformance` | Record browser page-load performance measurements. |
| `trackException` | Record a handled error that automatic exception collection does not capture. |
| `trackTrace` | Record diagnostic or workflow information. |
| `trackMetric` | Record an application-specific measurement or preaggregated metric. |
| `trackDependencyData` | Record a dependency call that automatic `fetch` or `XMLHttpRequest` collection does not capture. |

See the [Application Insights JavaScript SDK API documentation](https://microsoft.github.io/ApplicationInsights-JS/webSdk/applicationinsights-web/classes/ApplicationInsights.html)
for method parameters and additional configuration.



## Configuration

| Name | Default | Description |
|------|---------|-------------|
| history | null | React router history for more information see the [documentation][react-router] of the `react-router` package. |

#### React components usage tracking

To instrument various React components usage tracking, apply the `withAITracking` higher-order
component function.


It will measure time from the `ComponentDidMount` event through the `ComponentWillUnmount` event.
However, in order to make this more accurate, it will subtract the time in which the user was idle.
In other words, `React Component Engaged Time = ComponentWillUnmount timestamp - ComponentDidMount timestamp - idle time`.

To see this metric in the Azure portal you need to navigate to the Application Insights resource, select "Metrics" tab and configure the empty charts to display Custom metric named "React Component Engaged Time (seconds)", select aggregation (sum, avg, etc.) of your liking and apply split by "Component Name".

![image](https://user-images.githubusercontent.com/1005174/51357010-c168ac80-1a71-11e9-8df9-348febd2d6dd.png)

You can also run custom queries to slice and dice AI data to generate reports and visualizations as per your requirements. In the Azure portal, navigate to the Application Insights resource, select "Analytics" from the top menu of the Overview tab and run your query.

![image](https://user-images.githubusercontent.com/1005174/51356821-e872ae80-1a70-11e9-9e12-e56a1edcde68.png)

Please note that it can take up to 10 minutes for new custom metric to appear in the Azure Portal.


## Sample App

[Application Insights React sample](https://github.com/microsoft/applicationinsights-react-js/tree/main/sample/applicationinsights-react-sample).

## React Router

[react-router]: https://github.com/ReactTraining/react-router/blob/master/FAQ.md#how-do-i-access-the-history-object-outside-of-components

## Compatibility Matrix

The [Compatibility Matrix](https://github.com/microsoft/applicationinsights-react-js#compatibility-matrix)
is tracked and updated on the main project README.md page.

## Nightly Builds

See the [Main Readme](https://github.com/microsoft/applicationinsights-react-js#nightly-builds)

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Data Collection

As this SDK is designed to enable applications to perform data collection which is sent to the Microsoft collection endpoints the following is required to identify our privacy statement.

The software may collect information about you and your use of the software and send it to Microsoft. Microsoft may use this information to provide services and improve our products and services. You may turn off the telemetry as described in the repository. There are also some features in the software that may enable you and Microsoft to collect data from users of your applications. If you use these features, you must comply with applicable law, including providing appropriate notices to users of your applications together with a copy of Microsoft’s privacy statement. Our privacy statement is located at https://go.microsoft.com/fwlink/?LinkID=824704. You can learn more about data collection and use in the help documentation and our privacy statement. Your use of the software operates as your consent to these practices.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft’s Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general). Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos are subject to those third-party’s policies.

## License

[MIT](LICENSE)
