import React from 'react';
import {  BrowserRouter,Routes,Route, } from 'react-router-dom'
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TestPage from './TestPage';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/test" element={<TestPage />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);


