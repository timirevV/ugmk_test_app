import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GlobalStyleA } from "./style";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalStyleA />
    <App />
  </React.StrictMode>
);
