import React, { useState, useEffect, useRef } from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { appInsights } from './ApplicationInsightsService';
import './App.css';
import { start } from 'repl';

function TestPage() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  function trackException() {
    appInsights.trackException({ error: new Error('some error'), severityLevel: SeverityLevel.Error });
  }

  function trackTrace() {
    appInsights.trackTrace({ message: 'some trace', severityLevel: SeverityLevel.Information });
  }

  function trackEvent() {
    appInsights.trackEvent({ name: 'some event' });
  }

  function flush() {
    appInsights.flush();
  }

  function startTrackPageView() {
    appInsights.startTrackPage("TestPage");
    startClock();
  }

  function stopTrackPageView() {
    appInsights.stopTrackPage("TestPage");
    stopClock();
  }

  function throwError() {
    throw new Error("test error");
  }

  function ajaxRequest() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://httpbin.org/status/200');
    xhr.send();
  }

  function fetchRequest() {
    fetch('https://httpbin.org/status/200');
  }

  const startClock = () => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          setTime(Date.now() - startTimeRef.current);
        }
      }, 100);
    }
  };

  const stopClock = () => {
    if (isRunning && timerRef.current !== null) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  const resetClock = () => {
    setTime(0);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);



  return (
    <div className="App">
      <h1>Test Page</h1>
      <div>
        <div>Flush</div>
        <button onClick={flush}>Flush</button>
      </div>
      <div>
        <div>Test TrackEvent</div>
        <button onClick={trackEvent}>Track Event</button>
      </div>
      <div>
        <div>Test TrackTrace</div>
        <button onClick={trackTrace}>Track Trace</button>
      </div>
      <div>
        <div>Test Track AjaxRequest</div>
        <button onClick={ajaxRequest}>Autocollect a Dependency (XMLHttpRequest)</button>
      </div>
      <div>
        <div>Test Track FetchRequest</div>
        <button onClick={fetchRequest}>Autocollect a dependency (Fetch)</button>
      </div>
      <div>
        <div>Test trackException</div>
        <button onClick={trackException}>Track Exception</button>
      </div>
      <div>
        <div>Test track Throw Error</div>
        <button onClick={throwError}>Autocollect an Error</button>
      </div>
      <div>
        <div>Start Track Page View</div>
        <button onClick={startTrackPageView}>Start Track Page View</button>
      </div>
      <div>
        <div>Stop Track Page View</div>
        <button onClick={stopTrackPageView}>Stop Track Page View</button>
      </div>
      <div>
        <div>Clock</div>
        <h1>Time: {(time / 1000).toFixed(3)}s</h1>
        <button onClick={resetClock}>Reset clock</button>
      </div>
    </div>
  )
}

export default TestPage;
