import React from "react";
import ReactDom from "react-dom/client";
import App from "./pages/_app";
import * as serviceWorker from "./serviceWorker.ts";

ReactDom.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();