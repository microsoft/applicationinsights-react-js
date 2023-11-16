import React from "react";
import ReactPlugin from "../src/ReactPlugin";
import AppInsightsErrorBoundary from "../src/AppInsightsErrorBoundary";
import { TestComponent, ErrorTestComponent } from "./TestComponent";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter as Router, Link, Route, Routes, useNavigate, useLocation, BrowserRouter, Navigate} from "react-router-dom";
import userEvent from '@testing-library/user-event';
import { createBrowserHistory, createMemoryHistory } from "history";
import { AppInsightsCore, DiagnosticLogger, IAppInsightsCore, IConfiguration, IPlugin, ITelemetryItem } from "@microsoft/applicationinsights-core-js";

let reactPlugin: ReactPlugin;
let trackExceptionSpy;
let orgWarn = console && console.warn;
const LocationDisplay = () => {
  const location = useLocation()

  return <div data-testid="location-display">{location.pathname}</div>
}

describe("<AppInsightsErrorBoundary />", () => {
  beforeEach(() => {
    if (orgWarn) {
      console.warn = (msg) => { /* Swallow */ }
    }
    reactPlugin = new ReactPlugin();
    trackExceptionSpy = reactPlugin.trackException = jest.fn();
  });

  afterEach(() => {
    if (orgWarn) {
      console.warn = orgWarn;
    }
  });

  it("should render a non-erroring component", () => {
    const aiErrorBoundry = render(
      <AppInsightsErrorBoundary
        appInsights={reactPlugin}
        onError={() => <div></div>}
      >
        <TestComponent />
      </AppInsightsErrorBoundary>
    );
    const testComponent = render(<TestComponent />);
    expect(aiErrorBoundry.container).toEqual(testComponent.container);
  });

  it("should catch the error and render the alternative component", async () => {
    const orgError = console && console.error;
    if (orgError) {
      console.error = msg => { /* Do Nothing */ };
    }

    try {
      const ErrorDisplay = () => <div>Error</div>;
      const aiErrorBoundry = render(
        <AppInsightsErrorBoundary
          appInsights={reactPlugin}
          onError={ErrorDisplay}
        >
          <ErrorTestComponent />
        </AppInsightsErrorBoundary>
      );
      const errorDisplay = render(<ErrorDisplay />);
      expect(aiErrorBoundry.container).toEqual(errorDisplay.container);
    } finally {
      if (orgError) {
        console.error = orgError;
      }
    }
  });

  it("should catch the error and track exception", async () => {
    const orgError = console && console.error;
    if (orgError) {
      console.error = msg => { /* Do Nothing */ };
    }

    try {
      const ErrorDisplay = () => <div>Error</div>;
      const aiErrorBoundry = render(
        <AppInsightsErrorBoundary
          appInsights={reactPlugin}
          onError={ErrorDisplay}
        >
          <ErrorTestComponent />
        </AppInsightsErrorBoundary>
      );
      expect(trackExceptionSpy).toHaveBeenCalledTimes(1);
    } finally {
      if (orgError) {
        console.error = orgError;
      }
    }
  });

  function BackButton() {
    const navigate = useNavigate();
    console.log("BackButton", BackButton);
    return (
      <button type="button" onClick={() => navigate(-1)}>Back</button>
    );
  }

  test("error state would not show again after user use back button", async () => {
    const history = createBrowserHistory();
    jest.useFakeTimers();
    let core = new AppInsightsCore();
    core.logger = new DiagnosticLogger();
    reactPlugin = new ReactPlugin();
  
    const channel = new ChannelPlugin();
    const config: IConfiguration = {
      instrumentationKey: 'instrumentation_key',
      extensionConfig: {
        [reactPlugin.identifier]: {
          history,
          errorReset: true
        },
      }
    };
    reactPlugin.initialize(config, core, [channel]);
    // Mock page view track
    const reactMock = reactPlugin.trackPageView = jest.fn();

    // Emulate navigation to different URL-addressed pages
    history.push("/test");
    jest.runOnlyPendingTimers();
    jest.advanceTimersByTime(1000)
    history.push("/test");
    jest.runOnlyPendingTimers();

    const orgError = console && console.error;
    const ErrorDisplay = ({history}) => {
      // Use the navigate function as needed
      history.push("/error");
      return null;
    };

    const ErrorPage = () => <div>Error</div>;
    if (orgError) {
      console.error = msg => { /* Do Nothing */ };
    }
    const Home = () => <div>Home Page</div>;
    const About = () => {
      throw new Error("something went wrong");
    };
    const NewPage = () => <div>New Page</div>;

   
     try {
      render(
        <AppInsightsErrorBoundary appInsights={reactPlugin} onError={() => <ErrorDisplay history={history} />}>
          <Router>
            <div>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/newpage">newPage</Link>
              <BackButton />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/newpage" element={<NewPage />} />
                <Route path="/error" element={<ErrorPage />} />
              </Routes>
              <LocationDisplay />
            </div>
          </Router>
        </AppInsightsErrorBoundary>
      );
      expect(screen.getByText(/Home Page/i)).toBeInTheDocument()

       // navigate to new page 
       await userEvent.click(screen.getByText(/newpage/i));
       // go back to home page (no error, so show home component)
      await userEvent.click(screen.getByText(/Back/i));
      expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
      
      
      // navigate to about page (throws error, so show error component)
      await userEvent.click(screen.getByText(/about/i)); // compile error useNavigate() may be used only in the context of a <Router> component.
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
      console.log("track time", trackExceptionSpy.mock.calls.length);

      // go back to home page (no error, so show home component)
      history.push('/');
      expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
      console.log("track time", trackExceptionSpy.mock.calls.length);

    } finally {
      if (orgError) {
        console.error = orgError;
      }
    }

  });

  // test("error state would not show again after user use back button", async () => {
  //   const orgError = console && console.error;
  //   if (orgError) {
  //     console.error = msg => { /* Do Nothing */ };
  //   }
  //   // const history = useHistory();
  //   const Home = () => <div>Home Page</div>
  //   const ErrorDisplay = () => <div>You are on the error page</div>;
  //   const Error = () => 
  //   <div>
  //     <AppInsightsErrorBoundary
  //       appInsights={reactPlugin}
  //       onError={ErrorDisplay}>
  //     <ErrorTestComponent />
  //     </AppInsightsErrorBoundary>
  //   </div>
  //   try {
  //     render(
  //       <BrowserRouter>
  //           <div>
  //           <Link to="/">Home</Link>
  //           <Link to="/error">Error</Link>
  //           <Routes>
  //             <Route path="/" element={<Home />} />
  //             <Route path="/error" element={<Error/>} />
  //           </Routes>
  //           <LocationDisplay />
  //         </div>
  //       </BrowserRouter>
  //     );
  //     expect(screen.getByText(/Home Page/i)).toBeInTheDocument()
  //     // verify page content for expected route after navigating
  //     await userEvent.click(screen.getByText(/error/i))
  //     // console.log("------------get", screen)
  //     expect(screen.getByText(/You are on the error page/i)).toBeInTheDocument()

  //     expect(trackExceptionSpy).toHaveBeenCalledTimes(1);

  //     await userEvent.click(screen.getByText(/home/i))
  //     console.log("------------go back to home")
  //     expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
  //     expect(trackExceptionSpy).toHaveBeenCalledTimes(1);

  //   } finally {
  //     if (orgError) {
  //       console.error = orgError;
  //     }
  //   }
  // });

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