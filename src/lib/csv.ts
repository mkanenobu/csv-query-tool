import { parse } from "csv-parse/browser/esm/sync";
import { stringify } from "csv-stringify/browser/esm/sync";

export const parseCsv = async (file: File) => {
  return parse(await file.text());
};

export const stringifyCsv = async ({
  columns,
  records,
}: {
  columns: string[];
  records: string[][];
}) => {
  return stringify(records, {
    header: true,
    columns,
    encoding: "utf8",
  });
};
