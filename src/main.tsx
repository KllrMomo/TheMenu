import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import logoTabIcon from "./assets/images/logo-tab.png";
import "./assets/styles/globals.css";

// Set favicon dynamically
const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
if (link) {
  link.href = logoTabIcon;
} else {
  const newLink = document.createElement("link");
  newLink.rel = "icon";
  newLink.href = logoTabIcon;
  document.getElementsByTagName("head")[0].appendChild(newLink);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
