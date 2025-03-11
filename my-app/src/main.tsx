import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 18
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.scss"; // Import SCSS instead of CSS

const root = ReactDOM.createRoot(document.getElementById("root")!); // Use createRoot properly
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
