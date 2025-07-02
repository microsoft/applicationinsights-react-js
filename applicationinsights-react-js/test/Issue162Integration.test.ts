import { AppInsightsCore, IConfiguration, DiagnosticLogger, ITelemetryItem, IPlugin, IAppInsightsCore } from "@microsoft/applicationinsights-core-js";
import { IPageViewTelemetry } from "@microsoft/applicationinsights-common";
import ReactPlugin from "../src/ReactPlugin";
import { createBrowserHistory } from "history";

/**
 * This integration test demonstrates the issue described in GitHub Issue #162
 * and validates that the fix correctly resets the ajax attempts counter.
 */

class ChannelPlugin implements IPlugin {
  public isFlushInvoked = false;
  public isTearDownInvoked = false;
  public isResumeInvoked = false;
  public isPauseInvoked = false;

  public identifier = "Sender";
  public priority: number = 1001;

  constructor() {
    this.processTelemetry = this._processTelemetry.bind(this);
  }
  
  public pause(): void {
    this.isPauseInvoked = true;
  }

  public resume(): void {
    this.isResumeInvoked = true;
  }

  public teardown(): void {
    this.isTearDownInvoked = true;
  }

  flush(async?: boolean, callBack?: () => void): void {
    this.isFlushInvoked = true;
    if (callBack) {
      callBack();
    }
  }

  public processTelemetry(env: ITelemetryItem) { }

  setNextPlugin(next: any) {
    // no next setup
  }

  public initialize = (config: IConfiguration, core: IAppInsightsCore, plugin: IPlugin[]) => {
    // Mocked - Do Nothing
  }

  private _processTelemetry(env: ITelemetryItem) {
    // Do nothing
  }
}

describe("Integration Test - Issue #162: TrackPageView resets maxAjaxCallsPerView", () => {
  it("should demonstrate the issue and fix", () => {
    // Setup
    const core = new AppInsightsCore();
    core.logger = new DiagnosticLogger();
    const reactPlugin = new ReactPlugin();
    const history = createBrowserHistory();

    // Mock a dependencies plugin that tracks ajax attempts
    let ajaxAttempts = 0;
    const mockDependenciesPlugin = {
      resetAjaxAttempts: jest.fn(() => {
        ajaxAttempts = 0;
      }),
      _trackAjaxAttempts: 0,
      // Simulate tracking ajax calls
      trackAjaxCall: () => {
        ajaxAttempts++;
        mockDependenciesPlugin._trackAjaxAttempts = ajaxAttempts;
      }
    };

    const dependenciesPluginWrapper = {
      initialize: (config, core, extensions) => { },
      processTelemetry: (env) => { },
      setNextPlugin: (next) => { },
      identifier: "AjaxPlugin",
      plugin: mockDependenciesPlugin
    };

    const analyticsExtension = {
      initialize: (config, core, extensions) => { },
      trackEvent: (event, customProperties) => { },
      trackPageView: jest.fn(),
      trackException: (exception, customProperties) => { },
      trackTrace: (trace, customProperties) => { },
      trackMetric: (metric, customProperties) => { },
      _onerror: (exception) => { },
      startTrackPage: (name) => { },
      stopTrackPage: (name, properties, measurements) => { },
      startTrackEvent: (name) => { },
      stopTrackEvent: (name, properties, measurements) => { },
      addTelemetryInitializer: (telemetryInitializer) => { },
      trackPageViewPerformance: (pageViewPerformance, customProperties) => { },
      processTelemetry: (env) => { },
      setNextPlugin: (next) => { },
      identifier: "ApplicationInsightsAnalytics"
    };

    const channel = new ChannelPlugin();

    const config: IConfiguration = {
      instrumentationKey: 'test-key',
      extensionConfig: {
        [reactPlugin.identifier]: {
          history
        }
      }
    };

    // Initialize the plugins
    core.initialize(config, [reactPlugin, analyticsExtension, dependenciesPluginWrapper, channel]);

    // Clear any initial calls from initialization
    mockDependenciesPlugin.resetAjaxAttempts.mockClear();

    console.log("=== Issue #162 Demonstration ===");
    
    // Simulate the scenario described in the issue:
    // 1. User navigates to a page that makes several ajax requests
    console.log("Step 1: User visits page /route1 and makes 3 ajax requests");
    mockDependenciesPlugin.trackAjaxCall();
    mockDependenciesPlugin.trackAjaxCall();
    mockDependenciesPlugin.trackAjaxCall();
    
    console.log(`Ajax attempts after requests: ${ajaxAttempts}`);
    expect(ajaxAttempts).toBe(3);

    // 2. User navigates to another page (triggers trackPageView)
    console.log("\nStep 2: User navigates to /route2 (should reset ajax counter)");
    reactPlugin.trackPageView({ uri: "/route2" });

    // 3. Verify that the ajax attempts counter was reset
    console.log(`Ajax attempts after trackPageView: ${ajaxAttempts}`);
    console.log(`resetAjaxAttempts called: ${mockDependenciesPlugin.resetAjaxAttempts.mock.calls.length} times`);
    
    expect(mockDependenciesPlugin.resetAjaxAttempts).toHaveBeenCalledTimes(1);
    expect(ajaxAttempts).toBe(0);

    // 4. Simulate more ajax requests on the new page
    console.log("\nStep 3: User makes 2 more ajax requests on new page");
    mockDependenciesPlugin.trackAjaxCall();
    mockDependenciesPlugin.trackAjaxCall();
    
    console.log(`Ajax attempts after new requests: ${ajaxAttempts}`);
    expect(ajaxAttempts).toBe(2);

    // 5. Another page navigation should reset again
    console.log("\nStep 4: User navigates to /route3 (should reset again)");
    reactPlugin.trackPageView({ uri: "/route3" });
    
    console.log(`Ajax attempts after second trackPageView: ${ajaxAttempts}`);
    console.log(`resetAjaxAttempts total calls: ${mockDependenciesPlugin.resetAjaxAttempts.mock.calls.length} times`);
    
    expect(mockDependenciesPlugin.resetAjaxAttempts).toHaveBeenCalledTimes(2);
    expect(ajaxAttempts).toBe(0);

    console.log("\n✅ Issue #162 is fixed! Ajax attempts counter resets on each trackPageView call.");
  });
});