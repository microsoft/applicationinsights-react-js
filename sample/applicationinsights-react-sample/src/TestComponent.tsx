import React from 'react';
import { useEffect, useState } from "react";
import { useAppInsightsContext, useTrackEvent } from "@microsoft/applicationinsights-react-js";
import { configPlugin } from './ApplicationInsightsService';

const TestComponent = () => {
  const appInsights = useAppInsightsContext();
  const [testNumber, setTestNumber] = useState(0);
  
  const trackEvent = useTrackEvent(appInsights, "TestNumber", testNumber);
  
  useEffect(() => {
    trackEvent(testNumber);
  }, [testNumber, trackEvent]);

  function onClick() {
    let curTestNumber = testNumber;
    setTestNumber(curTestNumber + 1);
  }

  function onClick2() {
    configPlugin.sync();
  }

  return (
    <div className="App">
      <h1>Test <code>useAppInsightsContext</code></h1>
      <div>
        <p>Current Number: {testNumber}</p>
        <button onClick={onClick}>Add Number</button>
        <button onClick={onClick2}>TEST</button>
      </div>
    </div>
  );
};

export default TestComponent;