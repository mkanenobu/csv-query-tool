import type { TableSchema } from "@/lib/db/queries.ts";
import { QueryEditor } from "@/pages/main/QueryEditor.tsx";

export type Table = {
  name: string;
  schema: TableSchema;
  createTableQuery: string;
};

export const PreviewTables = ({ tables }: { tables: Array<Table> }) => {
  return (
    <div>
      {tables.map((table) => (
        <div key={table.name}>
          <h3>Table name {table.name}</h3>
          <QueryEditor value={table.createTableQuery} readOnly />
        </div>
      ))}
    </div>
  );
};
