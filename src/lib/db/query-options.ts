import { pgTypes } from "@/lib/db/pg-types.ts";
import type { ParserOptions } from "@electric-sql/pglite";

const raw = (v: string) => v;

export const noParse: ParserOptions = Object.values(pgTypes).reduce(
  (acc, cur) => {
    acc[cur] = raw;
    return acc;
  },
  {} as ParserOptions,
);
