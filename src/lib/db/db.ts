import { PGlite } from "@electric-sql/pglite";
import { live, type PGliteWithLive } from "@electric-sql/pglite/live";

let cache: ReturnType<typeof PGlite.create> = undefined;
export const initDB = () => {
  if (cache) {
    return cache;
  }
  cache = PGlite.create({
    extensions: { live },
  });
  return cache;
};

export type DB = PGliteWithLive;
