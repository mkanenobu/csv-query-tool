import { parse } from "pgsql-ast-parser";

export const parseSQL = (sqlStatement: string) => {
  try {
    return parse(sqlStatement);
  } catch (e) {
    return false;
  }
};
