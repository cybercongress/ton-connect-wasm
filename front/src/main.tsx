import React from "react";
import ReactDOM from "react-dom/client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

import App from "./App.tsx";

// const manifestUrl = "https://nextonserver.s3.eu-north-1.amazonaws.com/config.json";
const manifestUrl =
  "https://ton-wasm-cyber-hackathon.netlify.app/tonconnect-manifest.json";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>
);