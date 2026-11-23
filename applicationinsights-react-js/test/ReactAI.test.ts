import { AppInsightsCore, IConfiguration, DiagnosticLogger, ITelemetryItem, IPlugin, IAppInsightsCore, IPageViewTelemetry } from "@microsoft/applicationinsights-core-js";
import ReactPlugin from "../src/ReactPlugin";
import { IReactExtensionConfig } from "../src/Interfaces/IReactExtensionConfig";
import { createBrowserHistory, createMemoryHistory, History, Location } from "history";

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
    expect(reactConfig.excludePageViewOnReplace).toBe(false);
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

  describe("history replacement page views", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      init();
    });

    afterEach(() => {
      core.unload(false);
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    function initializeHistoryTracking(history: History, excludePageViewOnReplace?: boolean) {
      coreConfig.extensionConfig = {
        [reactPlugin.identifier]: {
          history,
          excludePageViewOnReplace
        }
      };
      const trackPageView = reactPlugin.trackPageView = jest.fn();
      core.initialize(coreConfig, [reactPlugin, new ChannelPlugin()]);
      return trackPageView;
    }

    it.each([undefined, false, true])("history v5: excludePageViewOnReplace=%s", (excludePageViewOnReplace) => {
      const history = createMemoryHistory({ initialEntries: ["/initial"] });
      const trackPageView = initializeHistoryTracking(history, excludePageViewOnReplace);
      expect(trackPageView).toHaveBeenCalledWith({ uri: "/initial" });

      history.push("/home");
      history.replace("/home", { some: "state" });
      history.replace("/replaced");
      history.back();
      expect(trackPageView).toHaveBeenCalledTimes(1);
      jest.runOnlyPendingTimers();
      reactPlugin.trackPageView({ uri: "/manual" });

      const expectedPaths = excludePageViewOnReplace
        ? ["/initial", "/home", "/initial", "/manual"]
        : ["/initial", "/home", "/home", "/replaced", "/initial", "/manual"];
      expect(trackPageView.mock.calls.map(([pageView]) => pageView.uri)).toEqual(expectedPaths);
    });

    it.each([undefined, false, true])("history v4: excludePageViewOnReplace=%s", (excludePageViewOnReplace) => {
      const history = createMemoryHistory({ initialEntries: ["/initial"] });
      let listener: (location: Location, action: string) => void;
      // History v4 calls the listener with separate location and action arguments.
      jest.spyOn(history, "listen").mockImplementation((callback) => {
        listener = callback as unknown as (location: Location, action: string) => void;
        return jest.fn();
      });
      const trackPageView = initializeHistoryTracking(history, excludePageViewOnReplace);

      listener({ ...history.location, pathname: "/home" }, "PUSH");
      listener({ ...history.location, pathname: "/home", state: { some: "state" } }, "REPLACE");
      listener({ ...history.location, pathname: "/replaced" }, "REPLACE");
      listener(history.location, "POP");
      expect(trackPageView).toHaveBeenCalledTimes(1);
      jest.runOnlyPendingTimers();
      reactPlugin.trackPageView({ uri: "/manual" });

      const expectedPaths = excludePageViewOnReplace
        ? ["/initial", "/home", "/initial", "/manual"]
        : ["/initial", "/home", "/home", "/replaced", "/initial", "/manual"];
      expect(trackPageView.mock.calls.map(([pageView]) => pageView.uri)).toEqual(expectedPaths);
    });

    it("updates replacement tracking when the configuration changes", () => {
      const history = createMemoryHistory({ initialEntries: ["/initial"] });
      const trackPageView = initializeHistoryTracking(history);
      history.replace("/tracked-by-default");
      jest.runOnlyPendingTimers();

      core.config.extensionConfig[reactPlugin.identifier].excludePageViewOnReplace = true;
      jest.advanceTimersByTime(1000);
      history.replace("/excluded");
      jest.runOnlyPendingTimers();

      core.config.extensionConfig[reactPlugin.identifier].excludePageViewOnReplace = false;
      jest.advanceTimersByTime(1000);
      history.replace("/tracked-again");
      jest.runOnlyPendingTimers();

      expect(trackPageView.mock.calls.map(([pageView]) => pageView.uri)).toEqual([
        "/initial", "/tracked-by-default", "/tracked-again"
      ]);
    });
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

  it("React Dynamic Config: Config history could be removed and added", () => {
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

    // Emulate navigation to different URL-addressed pages
    history.push("/should-received");
    jest.runOnlyPendingTimers();
    let id = reactPlugin.identifier;
    //change config - history remove
    core.config.extensionConfig[id].history  = undefined;
    jest.advanceTimersByTime(1000)
    history.push("/removed-history-should-not-received");
    jest.runOnlyPendingTimers();
    //change config - history added back
    core.config.extensionConfig[id].history  = history;
    jest.advanceTimersByTime(1000)
    history.push("/new-history-should-received")
    jest.runOnlyPendingTimers();
    
    expect(reactPlugin.trackPageView).toHaveBeenCalledTimes(2);
    let reactEvent: IPageViewTelemetry = reactMock.mock.calls[0][0]
    expect(reactEvent.uri).toBe("/should-received");
    reactEvent = reactMock.mock.calls[1][0]
    console.log("answer", reactEvent.uri)
    expect(reactEvent.uri).toBe("/new-history-should-received");

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