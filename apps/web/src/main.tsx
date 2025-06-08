import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ApiProvider } from "./api/ApiProvider.tsx";
import { MockApiClient } from "./api/mockClient.ts";
import { RealApiClient } from "./api/client.ts";
import type { ApiClient } from "./api/clientTypes.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const devMode = true; //disables api requests, use mock data instead
// will always be ignored in production builds

let client: ApiClient;

if (process.env.NODE_ENV === "test") {
  // In test mode, we use the mock client to avoid real API calls
  client = new MockApiClient();
}

if (import.meta.env.DEV && devMode) {
  // In development mode, we use the mock client to avoid real API calls
  client = new MockApiClient();
}

// default to the real client if no other client is set
if (!client || import.meta.env.prod) {
  client = new RealApiClient();
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApiProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ApiProvider>
  </StrictMode>
);
