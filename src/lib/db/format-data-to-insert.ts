import type { PgType } from "@/lib/pg-types.ts";
import { escapeText } from "@/lib/db/pg-utils/escape.ts";

export const formatDataToInsert = (data: string, type: PgType) => {
  switch (type) {
    case "INT2":
    case "INT4":
    case "INT8":
    case "FLOAT4":
    case "FLOAT8":
      if (data === "") {
        return "NULL";
      }
      return data;
    default:
      return escapeText(data);
  }
};
