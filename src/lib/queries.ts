import type { DB } from "@/db/db.ts";
import type { PgType } from "@/lib/pg-types.ts";

export const defaultSchema = "csv_query_tool";

export const createDefaultSchema = async (db: DB) => {
  return db.query(`CREATE SCHEMA IF NOT EXISTS "${defaultSchema}";`);
};

export const createTableQuery = (params: {
  tableName: string;
  schema: Record<string, PgType>;
}) => {
  const columns = Object.entries(params.schema).map(
    ([name, type]) => `  ${name} ${type}`,
  );

  return `CREATE TABLE IF NOT EXISTS "${params.tableName}" (
${columns.join(",\n")}
);
  `;
};

export const createTable = async (
  db: DB,
  params: { tableName: string; schema: Record<string, PgType> },
) => {
  return db.query(createTableQuery(params));
};
