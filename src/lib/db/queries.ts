import type { PgType } from "@/lib/pg-types.ts";
import type { DB } from "@/lib/db/db.ts";
import { escapeIdentifier } from "@/lib/db/pg-utils/escape.ts";
import { detectDataType } from "@/lib/db/detect-data-type.ts";
import { formatDataToInsert } from "@/lib/db/format-data-to-insert.ts";

export type TableSchema = Array<{ columnName: string; pgType: PgType }>;

export type QueryResult = Awaited<ReturnType<DB["query"]>>;

export const generateDataSchemaFromCsvData = ({
  header,
  data,
}: {
  header: string[];
  data: string[][];
}) => {
  const schema: TableSchema = [];

  const record = data[0];

  header.forEach((h, i) => {
    schema.push({
      columnName: h,
      pgType: detectDataType(record[i]),
    });
  });

  return schema;
};

export const generateCreateTableQuery = (params: {
  tableName: string;
  schema: TableSchema;
}) => {
  const columns = params.schema.map(
    ({ columnName, pgType }) => `  ${escapeIdentifier(columnName)} ${pgType}`,
  );

  return `CREATE TABLE IF NOT EXISTS "${params.tableName}" (
${columns.join(",\n")}
);
  `;
};

export const generateBulkInsertQuery = ({
  tableName,
  schema,
  data,
}: {
  tableName: string;
  schema: TableSchema;
  data: string[][];
}) => {
  const columns = schema
    .map(({ columnName }) => `${escapeIdentifier(columnName)}`)
    .join(", ");

  const formatCell = (cell: string, i: number) =>
    formatDataToInsert(cell, schema[i].pgType);
  const values = data.map((row) => {
    const r = row.map(formatCell).join(", ");
    return `(${r})`;
  });

  const bulkInsertQuery = `INSERT INTO ${escapeIdentifier(tableName)} (${columns})
VALUES ${values.join(",\n")};`;
  return { query: bulkInsertQuery, params: data.flat() };
};
