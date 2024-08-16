import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const DataPreviewTable = ({
  header,
  data,
  totalCount,
}: {
  header: string[];
  data: string[][];
  totalCount: number;
}) => {
  return (
    <Table>
      <TableCaption>
        Data Preview{totalCount && `, total count: ${totalCount}`}
      </TableCaption>
      <TableHeader>
        <TableRow>
          {header.map((h, i) => (
            <TableHead key={i}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i}>
            {row.map((cell, j) => (
              <TableCell key={`${i}_${j}`}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
