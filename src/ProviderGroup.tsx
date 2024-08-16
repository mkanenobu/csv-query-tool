import { ReactNode } from "react";
import { db } from "@/lib/db/db.ts";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { Toaster } from "@/components/ui/toaster";

export const ProviderGroup = ({ children }: { children: ReactNode }) => {
  return (
    <PGliteProvider db={db}>
      {children}
      <Toaster />
    </PGliteProvider>
  );
};
