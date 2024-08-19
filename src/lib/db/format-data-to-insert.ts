import type { PgType } from "@/lib/db/pg-types.ts";
import { escapeString } from "@/lib/db/pg-utils/escape.ts";

export const formatDataToInsert = (data: string, type: PgType | string) => {
  switch (type) {
    case "INT2":
    case "INT4":
    case "INT8":
    case "FLOAT4":
    case "FLOAT8":
    case "SERIAL":
      if (data === "") {
        return "NULL";
      }
      return data;
    default:
      return escapeString(data);
  }
};
