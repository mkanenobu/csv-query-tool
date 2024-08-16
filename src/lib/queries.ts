import type { DB } from "@/db/db.ts";

export const defaultSchema = "csv_query_tool";

export const createDefaultSchema = async (db: DB) => {
  return db.query(`CREATE SCHEMA IF NOT EXISTS ${defaultSchema};`);
};
