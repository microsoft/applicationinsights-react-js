# Microsoft Application Insights JavaScript SDK - React Plugin

[![npm version](https://badge.fury.io/js/%40microsoft%2Fapplicationinsights-react-js.svg)](https://badge.fury.io/js/%40microsoft%2Fapplicationinsights-react-js)

React Plugin for the Application Insights Javascript SDK, enables the following:

- Tracking of router changes
- React components usage statistics

Full documentation for the React Plugin for the Application Insights JavaScript SDK can be found on [Microsoft Docs](https://docs.microsoft.com/azure/azure-monitor/app/javascript-react-plugin).

## Getting Started

Install npm package:

```bash
npm install @microsoft/applicationinsights-react-js
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

[Azure-Samples/application-insights-react-demo](https://github.com/Azure-Samples/application-insights-react-demo).

## Compatibility Maxtrix

| Version |  Application Insights | React     | Branch
|---------|-----------------------|-----------|-----------
| 3.3.5   | 2.8.5                 | ^17.0.1   | [main](https://github.com/microsoft/applicationinsights-react-js) and [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.3.4   | 2.8.4                 | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.3.3   | 2.8.3                 | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.3.2   | 2.8.2                 | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.3.1   | 2.8.1                 | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.3.0   | 2.8.0                 | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.2.4   | 2.7.4                 | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.2.3   | 2.7.3                 | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.2.2   | 2.7.2                 | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.2.1   | 2.7.1                 | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.2.0   | 2.7.0                 | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.1.5   | ^2.6.5                | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.1.4   | ^2.6.4                | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.1.3   | ^2.6.3                | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.1.2   | ^2.6.2                | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.1.1   | ^2.6.2                | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.1.0   | ^2.6.0                | ^17.0.1   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.0.5   | ^2.5.10               | ^16.0.0   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)
| 3.0.4   | ^2.5.9                | ^16.0.0   | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js)

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

## License

[MIT](LICENSE)

[react-router]: https://github.com/ReactTraining/react-router/blob/master/FAQ.md#how-do-i-access-the-history-object-outside-of-components
