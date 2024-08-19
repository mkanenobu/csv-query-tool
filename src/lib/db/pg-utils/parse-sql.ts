import type { PgType } from "@/lib/db/pg-types.ts";
import type { TableSchema } from "@/lib/db/queries.ts";
import { parse } from "pgsql-ast-parser";

export const parseSQL = (sqlStatement: string) => {
  return parse(sqlStatement);
};

export const getTableSchemaFromCreateQuery = (
  sqlStatement: string,
): TableSchema => {
  const parsed = parseSQL(sqlStatement);
  if (!parsed) {
    throw new Error("Failed to parse SQL");
  }

  const table = parsed[0];
  if (!table) {
    throw new Error("Failed to parse SQL");
  }
  if (table.type !== "create table") {
    throw new Error("SQL is not a CREATE TABLE statement");
  }

  const schema: TableSchema = [];
  for (const col of table.columns) {
    if (col.kind === "column") {
      const name = col.name.name;
      // NOTE: array type is not supported
      if (col.dataType.kind === "array") continue;
      const type = col.dataType.name;

      schema.push({
        columnName: name,
        pgType: type.toUpperCase() as PgType,
      });
    }
  }

  return schema;
};
