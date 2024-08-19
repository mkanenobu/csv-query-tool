import type { PgType } from "@/lib/db/pg-types.ts";

export const formatValueToDisplay = (value: any, pgType: PgType) => {
  if (value === null) {
    return "NULL";
  } else if (pgType === "TEXT") {
    if (typeof value === "string" && value.length === 0) {
      // Empty string
      return '""';
    }
    return value;
  } else {
    return value;
  }
};
