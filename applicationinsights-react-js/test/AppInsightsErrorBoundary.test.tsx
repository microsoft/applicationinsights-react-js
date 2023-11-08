import React from "react";
import ReactPlugin from "../src/ReactPlugin";
import AppInsightsErrorBoundary from "../src/AppInsightsErrorBoundary";
import { TestComponent, ErrorTestComponent } from "./TestComponent";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { App, LocationDisplay } from "./testapp";
import userEvent from '@testing-library/user-event';

let reactPlugin: ReactPlugin;
let trackExceptionSpy;
let orgWarn = console && console.warn;

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

  test("error state would not show again after user use back button", async () => {
    const orgError = console && console.error;
    if (orgError) {
      console.error = msg => { /* Do Nothing */ };
    }
    const history = useHistory();
    const Home = () => <div>Home Page</div>
    const ErrorDisplay = () => <div>You are on the error page</div>;
    const Error = () => 
    <div>
      <AppInsightsErrorBoundary
        appInsights={reactPlugin}
        onError={ErrorDisplay}>
      <ErrorTestComponent />
      </AppInsightsErrorBoundary>
    </div>
    try {
      render(
        <BrowserRouter>
            <div>
            <Link to="/">Home</Link>
            <Link to="/error">Error</Link>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/error" element={<Error/>} />
            </Routes>
            <LocationDisplay />
          </div>
        </BrowserRouter>
      );
      expect(screen.getByText(/Home Page/i)).toBeInTheDocument()
      // verify page content for expected route after navigating
      await userEvent.click(screen.getByText(/error/i))
      // console.log("------------get", screen)
      expect(screen.getByText(/You are on the error page/i)).toBeInTheDocument()
    
      expect(trackExceptionSpy).toHaveBeenCalledTimes(1);

      await userEvent.click(screen.getByText(/home/i))
      console.log("------------go back to home")
      expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
      expect(trackExceptionSpy).toHaveBeenCalledTimes(1);

    } finally {
      if (orgError) {
        console.error = orgError;
      }
    }
  });

});
