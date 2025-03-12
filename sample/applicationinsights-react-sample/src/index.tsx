import React from 'react';
import {  BrowserRouter,Routes,Route, } from 'react-router-dom'
import './index.css';
import App from './App';
import TestPage from './TestPage';
import { createRoot } from "react-dom/client";

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/test" element={<TestPage />} />
        </Routes>
    </BrowserRouter>
);


