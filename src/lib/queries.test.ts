import { createTableQuery } from "@/lib/queries.ts";
import { test, expect } from "vitest";

test("createTableQuery", () => {
  expect(
    createTableQuery({
      tableName: "tname",
      schema: { t: "TEXT" },
    }).trim(),
  ).toBe(
    `
CREATE TABLE IF NOT EXISTS "tname" (
  t TEXT
);`.trim(),
  );

  expect(
    createTableQuery({
      tableName: "n",
      schema: { t: "TEXT", integer: "INT8" },
    }).trim(),
  ).toBe(
    `
CREATE TABLE IF NOT EXISTS "n" (
  t TEXT,
  integer INT8
);`.trim(),
  );
});
