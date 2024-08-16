import { parse } from "csv-parse/browser/esm/sync";

export const parseCsv = async (file: File) => {
  return parse(await file.text());
};
