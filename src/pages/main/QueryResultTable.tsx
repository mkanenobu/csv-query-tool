import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import type { QueryResult } from "@/lib/db/queries.ts";

const displayValue = (value: any) => {
  if (value === null) {
    return "NULL";
  } else if (typeof value === "object") {
    return JSON.stringify(value);
  } else if (typeof value === "string") {
    return value;
  } else {
    return value.toString();
  }
};

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
      <Table>
        <TableCaption>Data Preview</TableCaption>
        <TableHeader>
          <TableRow>
            {fields.map((f, i) => (
              <TableHead key={i}>{f.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {fields.map(({ name }, j) => (
                <TableCell key={`${i}_${j}`}>
                  {/* @ts-expect-error */}
                  {displayValue(row[name])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
