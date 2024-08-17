import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatValueToDisplay } from "@/lib/db/display.ts";
import { escapeIdentifier } from "@/lib/db/pg-utils/escape.ts";
import type { QueryResult } from "@/lib/db/queries.ts";
import { noParse } from "@/lib/db/query-options.ts";
import { pgTypesByTypeId, TypeId } from "@/lib/db/pg-types.ts";
import { usePGlite } from "@electric-sql/pglite-react";
import { useEffect, useState } from "react";

export const DataPreviewTable = ({ tableName }: { tableName: string }) => {
  const db = usePGlite();
  const [count, setCount] = useState<number>(0);
  const [fields, setFields] = useState<QueryResult["fields"]>([]);
  const [rows, setRows] = useState<QueryResult["rows"]>([]);

  useEffect(() => {
    if (!tableName) return;

    const countQuery = tableName
      ? `SELECT COUNT(*) AS count FROM ${escapeIdentifier(tableName)}`
      : "SELECT 0 AS count";

    db.query(countQuery).then((res) => {
      const _count = (res.rows.at(0) as any)?.["count"];
      if (typeof _count === "number") {
        setCount(_count);
      }
    });
  }, [tableName]);

  useEffect(() => {
    if (!tableName) return;

    const previewQuery = tableName
      ? `SELECT * FROM ${escapeIdentifier(tableName)} LIMIT 5`
      : "SELECT NULL";

    db.query(previewQuery, [], { parsers: noParse }).then((res) => {
      setFields(res.fields);
      setRows(res.rows);
    });
  }, [tableName]);

  return (
    <Table>
      <TableCaption>
        Data Preview, total count: {(count ?? 0).toLocaleString()}
      </TableCaption>
      <TableHeader>
        <TableRow>
          {fields.map((h, i) => (
            <TableHead key={i}>
              {h.name} ({pgTypesByTypeId[h.dataTypeID as TypeId] || "unknown"})
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            {fields.map((h, j) => (
              <TableCell key={`${i}_${j}`}>
                {/* @ts-expect-error */}
                {formatValueToDisplay(row[h.name])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
