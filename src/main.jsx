import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import AppState from './context/AppState.jsx';

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <AppState>
      <App />
      </AppState>
    </BrowserRouter>
  </React.StrictMode>
);

