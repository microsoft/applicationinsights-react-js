import { AppInsightsCore, IConfiguration, DiagnosticLogger, ITelemetryItem, IPlugin, IAppInsightsCore } from "@microsoft/applicationinsights-core-js";
import { IPageViewTelemetry } from "@microsoft/applicationinsights-common";
import ReactPlugin from "../src/ReactPlugin";
import { IReactExtensionConfig } from "../src/Interfaces/IReactExtensionConfig";
import { createBrowserHistory } from "history";

let reactPlugin: ReactPlugin;
let core: AppInsightsCore;
let coreConfig: IConfiguration;
let orgWarn = console && console.warn;

describe("ReactAI", () => {

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
    coreConfig = {
      instrumentationKey: 'testIkey',
      endpointUrl: 'testEndpoint',
      extensionConfig: {}
  };
  }

  it("React Configuration: Config options can be passed from root config", () => {
    const history = createBrowserHistory();
    init();
    coreConfig.extensionConfig = {
      [reactPlugin.identifier]: {
        history
      }
    }
    core.initialize(coreConfig, [ reactPlugin, new ChannelPlugin() ]);
    const reactConfig: IReactExtensionConfig = reactPlugin['_extensionConfig'];
    expect(reactConfig.history).toEqual(history);
  });

  it("React PageView using Analytics plugin", () => {
    const history = createBrowserHistory();
    jest.useFakeTimers();
    init();
    const analyticsExtension = {
      initialize: (config, core, extensions) => { },
      trackEvent: (event, customProperties) => { },
      trackPageView: (pageView, customProperties) => { },
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
        [reactPlugin.identifier]: {
          history
        },
      }
    };
    core.initialize(config, [reactPlugin, analyticsExtension, channel]);
    // Mock Analytics track
    const analyticsMock = analyticsExtension.trackPageView = jest.fn();

    // Emulate navigation to different URL-addressed pages
    history.push("/home", { some: "state" });
    history.push("/new-fancy-page");
    jest.runOnlyPendingTimers();
    expect(analyticsExtension.trackPageView).toHaveBeenCalledTimes(2);
    let event: IPageViewTelemetry = analyticsMock.mock.calls[0][0]
    expect(event.uri).toBe("/home");
    event = analyticsMock.mock.calls[1][0]
    expect(event.uri).toBe("/new-fancy-page");
  });

  it("React plugin with Analytics not available", () => {
    const history = createBrowserHistory();
    jest.useFakeTimers();
    init();
    const channel = new ChannelPlugin();
    const config: IConfiguration = {
      instrumentationKey: 'instrumentation_key',
      extensionConfig: {
        [reactPlugin.identifier]: {
          history
        }
      }
    };
    core.initialize(config, [reactPlugin, channel]);
    // Mock logger
    const loggerMock = core["logger"].throwInternal = jest.fn();
    history.push("/home");
    jest.runOnlyPendingTimers();
    expect(loggerMock).toHaveBeenCalledTimes(1);
  });

  it("React Dynamic Config: default Config history could be updated", () => {
    const history = createBrowserHistory();
    jest.useFakeTimers();
    init();
    
    const channel = new ChannelPlugin();
    const config: IConfiguration = {
      instrumentationKey: 'instrumentation_key',
      extensionConfig: {
        [reactPlugin.identifier]: {
          history
        },
      }
    };
    core.initialize(config, [reactPlugin, channel]);
    // Mock page view track
    const reactMock = reactPlugin.trackPageView = jest.fn();
    const newHistory = createBrowserHistory();

    // Emulate navigation to different URL-addressed pages
    history.push("/home", { some: "state" });
    history.push("/should-received");
    jest.runOnlyPendingTimers();
    let id = reactPlugin.identifier;
    //change config - history object
    core.config.extensionConfig[id].history  = newHistory;
    jest.advanceTimersByTime(1000)
    history.push("/old-history-should-not-received");
    jest.runOnlyPendingTimers();
    newHistory.push("/new-history-should-received")
    jest.runOnlyPendingTimers();
    
    expect(reactPlugin.trackPageView).toHaveBeenCalledTimes(3);
    let reactEvent: IPageViewTelemetry = reactMock.mock.calls[0][0]
    expect(reactEvent.uri).toBe("/home");
    reactEvent = reactMock.mock.calls[1][0]
    console.log("answer", reactEvent.uri)
    expect(reactEvent.uri).toBe("/should-received");
    reactEvent = reactMock.mock.calls[2][0]
    expect(reactEvent.uri).toBe("/new-history-should-received")
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

  }
}