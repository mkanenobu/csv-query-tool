import type { PgType } from "@/lib/db/pg-types.ts";

export const formatValueToDisplay = (value: any, pgType: PgType) => {
  if (value === null) {
    return "NULL";
  } else if (pgType === "TEXT") {
    return JSON.stringify(value);
  } else {
    return value;
  }
};
