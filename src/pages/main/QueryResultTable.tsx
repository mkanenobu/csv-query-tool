import { DataTable } from "@/components/ui/DataTable.tsx";
import { formatValueToDisplay } from "@/lib/db/display.ts";
import type { QueryResult } from "@/lib/db/queries.ts";

export const QueryResultTable = ({
  queryResult,
  timestamp,
}: {
  queryResult: QueryResult;
  timestamp: Date;
}) => {
  const { fields, rows } = queryResult;

  return (
    <div className="space-y-2">
      <p className="text-gray-600">Updated: {timestamp.toLocaleString()}</p>

      <DataTable
        columns={fields.map((f) => ({
          accessorFn: (row: any) => formatValueToDisplay(row[f.name]),
          header: f.name,
        }))}
        data={rows}
      />
    </div>
  );
};
