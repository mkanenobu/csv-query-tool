import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";

export const db = await PGlite.create({
  extensions: { live },
});

export type DB = typeof db;
