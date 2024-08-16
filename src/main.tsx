import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "@/Layout.tsx";
import { ProviderGroup } from "./ProviderGroup";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <ProviderGroup>
        <Layout />
      </ProviderGroup>
    </Suspense>
  </React.StrictMode>,
);
