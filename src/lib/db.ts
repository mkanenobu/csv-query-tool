export const generateCreateTableQueryByCsv = (
  tableName: string,
  header: string[],
  _data: any[][],
) => {
  const columns = header.map((h) => `  ${h} TEXT`);
  const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (
${columns.join(",\n")}
);`;
  return createTableQuery;
};

export const generateBulkInsertQueryByCsv = (
  tableName: string,
  header: string[],
  data: any[][],
) => {
  const columns = header.map((h) => `${h}`).join(", ");

  const values = data
    .map((row) => `(${row.map((cell) => `'${cell}'`).join(", ")})`)
    .join(",\n");

  const bulkInsertQuery = `INSERT INTO ${tableName} (${columns}) VALUES ${values};`;
  return { query: bulkInsertQuery, params: data.flat() };
};
