import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router";
import { GlobalStyleA } from "./style";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <GlobalStyleA />
    <App />
  </BrowserRouter>
);
