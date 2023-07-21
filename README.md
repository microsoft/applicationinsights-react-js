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

## React Router

[react-router]: https://github.com/ReactTraining/react-router/blob/master/FAQ.md#how-do-i-access-the-history-object-outside-of-components

## Compatibility Matrix

As part of updating to support [ApplicationInsights 3.x](https://github.com/microsoft/ApplicationInsights-JS/blob/main/RELEASES.md) we will be bumping the major version
number of this extension to match the major version of the supported React-JS version (which will be v17.x for the first release).

Additionally, as part of this change the existing v3.x extension has been moved into the [release3.x branch](https://github.com/microsoft/applicationinsights-react-js/tree/release3.x)

| Version |  Application Insights | React     | Branch
|---------|-----------------------|-----------|-----------
| 17.0.0  | ^3.0.2                | >= 17.0.2 | [main](https://github.com/microsoft/applicationinsights-react-js)
| 3.4.3   | ^2.8.14               | >= 17.0.2 | [release3.x](https://github.com/microsoft/applicationinsights-react-js/tree/release3.x)
| 3.4.2   | ^2.8.12               | >= 17.0.1 | [main](https://github.com/microsoft/applicationinsights-react-js)
| 3.4.1   | ^2.8.10               | >= 17.0.1 | [main](https://github.com/microsoft/applicationinsights-react-js)
| 3.4.0   | ^2.8.5                | >= 17.0.1 | [main](https://github.com/microsoft/applicationinsights-react-js)
| 3.3.6   | ^2.8.5                | ^17.0.1   | [main](https://github.com/microsoft/applicationinsights-react-js) <-- First release from this repo
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

## Nightly Builds

To aid with testing and validation we also produce and publish nightly builds whenever there is a change from the previous build. These builds are published to the [NpmJs registry](https://www.npmjs.com/package/@microsoft/applicationinsights-react-js) on a successful build / test pass.

This process also [tags the source code](https://github.com/microsoft/applicationInsights-react-js/tags) so that we can track the specific changes included using a nightly build specific version number which is the format "nightly-yymm-##" eg. ```nightly-2208-05```

These nightly builds will not be retained indefinitely and should only be used for __pre-production__ testing and/or validation of any changes that have not yet been released.

### NPM

The NPM builds are tagged as "nightly" and can by downloaded using this as the version number ```npm install @microsoft/applicationinsights-react-js@nightly``` or using the nightly specific version number which is "nightly.yyyymm-###" (```npm install @microsoft/applicationinsights-react-js@2.7.3-nightly.2112-08```) where ## is the specific build number for the month (Note, slightly different version from the source code tag due to compatibility issues between the different systems).

### Deployment process

When a new release is deployed the following occurs as part of the release

- NPM packages are created and published to [NpmJs](https://www.npmjs.com/package/@microsoft/applicationinsights-react-js)

## Release Notes

[Release Notes](./RELEASES.md)

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
