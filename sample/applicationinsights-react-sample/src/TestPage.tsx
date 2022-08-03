import React from 'react';
import {SeverityLevel} from '@microsoft/applicationinsights-web';
import { appInsights} from './ApplicationInsightsService';
import './App.css';


function TestPage() {

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
    </div>
  )
}

export default TestPage;