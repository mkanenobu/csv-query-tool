import { stringify } from "csv-stringify/sync";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";

const main = async () => {
  const rowCount = 100_000;

  const columns = ["id", "uuid", "name", "n"];

  const rows = Array.from({ length: rowCount }).map((_, i) => {
    return [i, randomUUID(), `name-${i}`, 1];
  });

  const buf = stringify(rows, {
    header: true,
    columns,
  });

  const filename = "dummy-data/one_hundred_thousand_rows.csv";
  await fs.writeFile(filename, buf).then(() => {
    console.log(`Wrote ${rowCount} rows to ${filename}`);
  });
};

main();
