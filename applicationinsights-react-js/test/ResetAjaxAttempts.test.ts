import { AppInsightsCore, IConfiguration, DiagnosticLogger, ITelemetryItem, IPlugin, IAppInsightsCore } from "@microsoft/applicationinsights-core-js";
import { IPageViewTelemetry } from "@microsoft/applicationinsights-common";
import ReactPlugin from "../src/ReactPlugin";

let reactPlugin: ReactPlugin;
let core: AppInsightsCore;
let orgWarn = console && console.warn;

describe("ReactPlugin - Reset Ajax Attempts", () => {

  beforeEach(() => {
    if (orgWarn) {
      console.warn = (msg) => { /* Swallow */ }
    }
  });

  afterEach(() => {
    if (orgWarn) {
      console.warn = orgWarn;
    }
  });

  function init() {
    core = new AppInsightsCore();
    core.logger = new DiagnosticLogger();
    reactPlugin = new ReactPlugin();
  }

  it("should find dependencies plugin with correct identifier", () => {
    init();
    
    // Mock dependencies plugin 
    const mockDependenciesPlugin = {
      resetAjaxAttempts: jest.fn(),
      _trackAjaxAttempts: 5
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
      instrumentationKey: 'instrumentation_key',
      extensionConfig: {
        [reactPlugin.identifier]: {}
      }
    };

    core.initialize(config, [reactPlugin, analyticsExtension, dependenciesPluginWrapper, channel]);

    // Test that we can find the dependencies plugin directly
    const foundPlugin = core.getPlugin("AjaxPlugin");
    expect(foundPlugin).not.toBeNull();
    expect((foundPlugin?.plugin as any)?.plugin).toBe(mockDependenciesPlugin);
  });

  it("trackPageView should call resetAjaxAttempts when dependencies plugin is available", () => {
    init();
    
    // Mock dependencies plugin
    const mockDependenciesPlugin = {
      resetAjaxAttempts: jest.fn(),
      _trackAjaxAttempts: 5
    };

    const dependenciesPluginWrapper = {
      initialize: (config, core, extensions) => { },
      processTelemetry: (env) => { },
      setNextPlugin: (next) => { },
      identifier: "AjaxPlugin",
      plugin: mockDependenciesPlugin
    };

    // Mock analytics plugin
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
      instrumentationKey: 'instrumentation_key',
      extensionConfig: {
        [reactPlugin.identifier]: {}
      }
    };

    core.initialize(config, [reactPlugin, analyticsExtension, dependenciesPluginWrapper, channel]);

    // Call trackPageView
    const pageView: IPageViewTelemetry = { uri: "/test-page" };
    reactPlugin.trackPageView(pageView);

    // Verify analytics trackPageView was called
    expect(analyticsExtension.trackPageView).toHaveBeenCalledWith(pageView);
    
    // Verify resetAjaxAttempts was called on dependencies plugin
    expect(mockDependenciesPlugin.resetAjaxAttempts).toHaveBeenCalledTimes(1);
  });

  it("trackPageView should reset _trackAjaxAttempts directly when resetAjaxAttempts method is not available", () => {
    init();
    
    // Mock dependencies plugin without resetAjaxAttempts method
    const mockDependenciesPlugin = {
      _trackAjaxAttempts: 5
    };

    const dependenciesPluginWrapper = {
      initialize: (config, core, extensions) => { },
      processTelemetry: (env) => { },
      setNextPlugin: (next) => { },
      identifier: "AjaxPlugin",
      plugin: mockDependenciesPlugin
    };

    // Mock analytics plugin
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
      instrumentationKey: 'instrumentation_key',
      extensionConfig: {
        [reactPlugin.identifier]: {}
      }
    };

    core.initialize(config, [reactPlugin, analyticsExtension, dependenciesPluginWrapper, channel]);

    // Call trackPageView
    const pageView: IPageViewTelemetry = { uri: "/test-page" };
    reactPlugin.trackPageView(pageView);

    // Verify analytics trackPageView was called
    expect(analyticsExtension.trackPageView).toHaveBeenCalledWith(pageView);
    
    // Verify _trackAjaxAttempts was reset to 0
    expect(mockDependenciesPlugin._trackAjaxAttempts).toBe(0);
  });

  it("trackPageView should work normally when no dependencies plugin is available", () => {
    init();
    
    // Mock analytics plugin only
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
      instrumentationKey: 'instrumentation_key',
      extensionConfig: {
        [reactPlugin.identifier]: {}
      }
    };

    core.initialize(config, [reactPlugin, analyticsExtension, channel]);

    // Call trackPageView - should not throw error even without dependencies plugin
    const pageView: IPageViewTelemetry = { uri: "/test-page" };
    expect(() => reactPlugin.trackPageView(pageView)).not.toThrow();

    // Verify analytics trackPageView was called
    expect(analyticsExtension.trackPageView).toHaveBeenCalledWith(pageView);
  });
});

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