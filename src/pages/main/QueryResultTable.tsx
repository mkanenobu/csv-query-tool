import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

export const QueryResultTable = ({
  queryResult,
}: {
  queryResult: {
    rows: Array<Record<string, any>>;
    fields: Array<{ name: string; dataTypeId: number }>;
  };
}) => {
  const { fields, rows } = queryResult;

  return (
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
              <TableCell key={`${i}_${j}`}>{row[name]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
