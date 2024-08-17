import { Button } from "@/components/ui/button.tsx";
import { DataTable } from "@/components/ui/DataTable.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { stringifyCsv } from "@/lib/csv.ts";
import { formatValueToDisplay } from "@/lib/db/display.ts";
import { pgTypesByTypeId, usePgTypes, type TypeId } from "@/lib/db/pg-types.ts";
import type { QueryResult } from "@/lib/db/queries.ts";
import { downloadFile } from "@/lib/file-download.ts";
import dayjs from "dayjs";

const ExportMenu = ({ queryResult }: { queryResult: QueryResult }) => {
  const exportCsv = async (qr: QueryResult) => {
    const filename = dayjs().format("YYYY-MM-DD_HH-mm-ss") + ".csv";
    const columns = qr.fields.map((f) => f.name);
    // @ts-expect-error
    const records = qr.rows.map((r) => columns.map((c) => r[c]));
    const csv = await stringifyCsv({
      columns,
      records,
    });
    downloadFile({
      payload: new Blob([csv], { type: "text/csv" }),
      filename,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Export</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => exportCsv(queryResult)}>
          CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const QueryResultTable = ({
  queryResult,
  timestamp,
}: {
  queryResult: QueryResult;
  timestamp: Date;
}) => {
  const { fields, rows } = queryResult;
  const { getTypeNameByTypeId } = usePgTypes();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-600">Updated: {timestamp.toLocaleString()}</p>
        <ExportMenu queryResult={queryResult} />
      </div>

      <DataTable
        // FIXME: non-unique key error when duplicates field name
        columns={fields.map((f) => ({
          accessorFn: (row: any) =>
            formatValueToDisplay(
              row[f.name],
              pgTypesByTypeId[f.dataTypeID as TypeId],
            ),
          header: `${f.name} (${getTypeNameByTypeId(f.dataTypeID) ?? f.dataTypeID})`,
        }))}
        data={rows}
      />
    </div>
  );
};
