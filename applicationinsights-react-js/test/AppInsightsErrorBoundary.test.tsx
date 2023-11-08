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

  function NewError() {
    const navigate = useNavigate();
    const ErrorDisplay = () => <div>You are on the error page</div>;
    function handleClick() {
      navigate(-1);
    }
    return (
      <div>
        <button onClick={handleClick}>go back</button>
      <AppInsightsErrorBoundary
        appInsights={reactPlugin}
        onError={ErrorDisplay}>
      <ErrorTestComponent />
      </AppInsightsErrorBoundary>
    </div>
    );
  }

  test("error state would not show again after user use back button", async () => {
    const orgError = console && console.error;
    if (orgError) {
      console.error = msg => { /* Do Nothing */ };
    }
    const Home = () => <div>Home Page</div>
    const About = () => <div>About Page</div>

    try {
      render(
        <Router>
            <div>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/error">Error</Link>
            <button type="button" onClick={() => { window.history.go(-1); }}>Back</button>
             <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/error" element={<NewError/>} />
            </Routes>
            <LocationDisplay />
          </div>
        </Router>
      );
      expect(screen.getByText(/Home Page/i)).toBeInTheDocument()
      
      // go to error page
      await userEvent.click(screen.getByText(/error/i))
      expect(screen.getByText(/You are on the error page/i)).toBeInTheDocument()
      expect(trackExceptionSpy).toHaveBeenCalledTimes(1);

      // go back to home page
      await userEvent.click(screen.getByText(/go back/i));
      expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
      expect(trackExceptionSpy).toHaveBeenCalledTimes(1);

      // go to error page again
      await userEvent.click(screen.getByText(/error/i))
      expect(screen.getByText(/You are on the error page/i)).toBeInTheDocument()
      console.log("track time", trackExceptionSpy.mock.calls.length);

      // navigate to about page
      await userEvent.click(screen.getByText(/about/i))
      expect(screen.getByText(/About Page/i)).toBeInTheDocument()
      console.log("track time", trackExceptionSpy.mock.calls.length);

    } finally {
      if (orgError) {
        console.error = orgError;
      }
    }
  });

});
