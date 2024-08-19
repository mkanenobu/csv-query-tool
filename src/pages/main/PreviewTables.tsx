import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button.tsx";
import { useToast } from "@/components/ui/use-toast.ts";
import { escapeIdentifier } from "@/lib/db/pg-utils/escape.ts";
import { dropTableQuery } from "@/lib/db/queries.ts";
import { QueryEditor } from "@/pages/main/QueryEditor.tsx";
import { usePGlite } from "@electric-sql/pglite-react";
import { useEffect, useState } from "react";

export type Table = {
  name: string;
  sourceFilename: string;
  createTableQuery: string;
};

const PreviewTable = ({
  table,
  dropTable,
}: {
  table: Table;
  dropTable: () => Promise<void>;
}) => {
  const db = usePGlite();

  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    const countQuery = `SELECT COUNT(*) AS count FROM ${escapeIdentifier(table.name)}`;

    db.query(countQuery).then((res) => {
      const _count = (res.rows.at(0) as any)?.["count"];
      if (typeof _count === "number") {
        setCount(_count);
      }
    });
  }, [table]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="justify-normal gap-2">
          {table.name}
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          <p>Count: {count.toLocaleString()}</p>
          <Button onClick={dropTable}>Drop Table</Button>
          <div>
            Table schema:
            <QueryEditor value={table.createTableQuery} readOnly />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export const PreviewTables = ({
  tables,
  removeTableFromList,
}: {
  tables: Array<Table>;
  removeTableFromList: (tableName: string) => void;
}) => {
  const db = usePGlite();
  const { toast } = useToast();

  const dropTable = async (tbl: string) => {
    await db
      .query(dropTableQuery(tbl))
      .then(() => {
        toast({
          title: "Table dropped",
          description: escapeIdentifier(tbl),
        });
        removeTableFromList(tbl);
      })
      .catch((error) => {
        toast({
          title: "Table drop error",
          description: error.message as string,
          variant: "destructive",
        });
      });
  };

  return (
    <div>
      <p>Tables</p>
      <div>
        {tables.length === 0 && <p className="text-gray-500">No tables</p>}
        {tables.map((table) => (
          <div key={table.name}>
            <PreviewTable
              table={table}
              dropTable={() => dropTable(table.name)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
