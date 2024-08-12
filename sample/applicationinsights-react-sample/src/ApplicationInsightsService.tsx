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
    env.tags = env.tags || {};
    env.tags["ai.cloud.role"] = "<app-role-frontend>";
    //custom props
    env.data = env.data || {};
    env.data["ms-appName"] = "<frontend-name>";
    env.data["ms-user"] = "<frontend-auth-user>";
    env.data["ms-userid"] = "<frontend-auth-userid>";
});

export { reactPlugin, appInsights };



