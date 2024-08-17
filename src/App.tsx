import { Layout } from "@/Layout.tsx";
import { initDB } from "@/lib/db/db.ts";
import { ProviderGroup } from "@/ProviderGroup.tsx";
import { Suspense } from "react";

export const App = () => {
  const dbPromise = initDB();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProviderGroup dbPromise={dbPromise}>
        <Layout />
      </ProviderGroup>
    </Suspense>
  );
};
