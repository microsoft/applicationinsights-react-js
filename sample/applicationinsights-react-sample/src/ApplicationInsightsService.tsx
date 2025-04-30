import {ApplicationInsights, ITelemetryItem} from '@microsoft/applicationinsights-web';
import {ReactPlugin} from '@microsoft/applicationinsights-react-js';
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';
 
const reactPlugin = new ReactPlugin();
const clickPluginInstance = new ClickAnalyticsPlugin();
const clickPluginConfig = {
  autoCapture: true
};
const appInsights = new ApplicationInsights({
  config: {
    connectionString: "InstrumentationKey=814a172a-92fd-4950-9023-9cf13bb65696;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/",
    extensions: [
      reactPlugin, clickPluginInstance
    ],
    extensionConfig: {
      [clickPluginInstance.identifier]: clickPluginConfig
    }
  }
});
appInsights.loadAppInsights();
 
// appInsights.addTelemetryInitializer((env:ITelemetryItem) => {
//     env.tags = env.tags || {};
//     env.tags["ai.cloud.role"] = "<app-role-frontend>";
//     //custom props
//     env.data = env.data || {};
//     env.data["ms-appName"] = "<frontend-name>";
//     env.data["ms-user"] = "<frontend-auth-user>";
//     env.data["ms-userid"] = "<frontend-auth-userid>";
// });

// Extend the Window interface to include appInsights
declare global {
  interface Window {
    appInsights: typeof appInsights;
  }
}

window["appInsights"] = appInsights; // For debugging purposes
 
export { reactPlugin, appInsights };