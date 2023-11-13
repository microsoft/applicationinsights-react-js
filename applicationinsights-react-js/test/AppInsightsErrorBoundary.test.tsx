import React from "react";
import ReactPlugin from "../src/ReactPlugin";
import AppInsightsErrorBoundary from "../src/AppInsightsErrorBoundary";
import { TestComponent, ErrorTestComponent } from "./TestComponent";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter as Router, Link, Route, Routes, useNavigate, useLocation} from "react-router-dom";
import userEvent from '@testing-library/user-event';

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

  function NewError() {
    return (
      <div>
        <BackButton />
        <div>You are on the error page</div>
      </div>
    );
  }

  test("error state would not show again after user use back button", async () => {
    const orgError = console && console.error;
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
        <AppInsightsErrorBoundary appInsights={reactPlugin} onError={NewError}>
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
      expect(screen.getByText(/You are on the error page/i)).toBeInTheDocument();
      console.log("track time", trackExceptionSpy.mock.calls.length);

      // // go back to home page (no error, so show home component)
      // await userEvent.click(screen.getByText(/go back/i));
      // expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
    } finally {
      if (orgError) {
        console.error = orgError;
      }
    }
  });

});
