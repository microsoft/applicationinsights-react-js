// app.js
import React from 'react'
import {Link, Route, Routes, useLocation} from 'react-router-dom'
import AppInsightsErrorBoundary from '../src/AppInsightsErrorBoundary';
import { ErrorTestComponent } from './TestComponent';

const Home = () => <div>You are home</div>
const ErrorDisplay = () => <div>You are on the error page</div>;

const Error = (reactPlugin) => <div><AppInsightsErrorBoundary
appInsights={reactPlugin}
onError={ErrorDisplay}
>
<ErrorTestComponent />
</AppInsightsErrorBoundary></div>

export const LocationDisplay = () => {
  const location = useLocation()

  return <div data-testid="location-display">{location.pathname}</div>
}

export const App = ({ reactPlugin }) => (
  <div>
    <Link to="/">Home</Link>

    <Link to="/error">Error</Link>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/error" element={<Error reactPlugin={reactPlugin} />} />
    </Routes>

    <LocationDisplay />
  </div>
)