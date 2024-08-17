import { Toaster } from "@/components/ui/toaster";
import { type DB } from "@/lib/db/db.ts";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { ReactNode, use } from "react";

export const ProviderGroup = ({
  children,
  dbPromise,
}: {
  children: ReactNode;
  dbPromise: Promise<DB>;
}) => {
  const db = use(dbPromise);

  return (
    <PGliteProvider db={db}>
      {children}
      <Toaster />
    </PGliteProvider>
  );
};
