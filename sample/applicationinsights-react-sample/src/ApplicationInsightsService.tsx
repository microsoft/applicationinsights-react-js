import {ApplicationInsights, IConfig, ITelemetryItem} from '@microsoft/applicationinsights-web';
import {ReactPlugin} from '@microsoft/applicationinsights-react-js';
import {CfgSyncPlugin, ICfgSyncConfig, ICfgSyncMode} from '@microsoft/applicationinsights-cfgsync-js';

const reactPlugin = new ReactPlugin();
const configPlugin = new CfgSyncPlugin();
const appInsights = new ApplicationInsights({
  config: {
    connectionString: "instrumentationKey=test",
    extensions: [reactPlugin, configPlugin],
    extensionConfig: {[configPlugin.identifier]:{ syncMode:1}as ICfgSyncConfig
  },
    enableAutoRouteTracking: true,
    disableAjaxTracking: false,
    autoTrackPageVisitTime: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
  }
});
appInsights.loadAppInsights();

appInsights.addTelemetryInitializer((env:ITelemetryItem) => {
    env.tags = env.tags || [];
    env.tags["ai.cloud.role"] = "testTag";
});

export { reactPlugin, appInsights, configPlugin };



