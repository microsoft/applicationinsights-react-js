import {ApplicationInsights, ITelemetryItem} from '@microsoft/applicationinsights-web';
import {ReactPlugin} from '@microsoft/applicationinsights-react-js';

const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
  config: {
    connectionString: "instrumentationKey=test",
    extensions: [reactPlugin],
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
    //custom props
    if (env.data) {
            env.data["ms-appName"] = "<app-name>";
            env.data["ms-user"] = "user-info";
            env.data["ms-userid"] = "auth-id";
        }
});

export { reactPlugin, appInsights };



