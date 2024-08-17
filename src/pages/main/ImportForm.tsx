import { Card } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useToast } from "@/components/ui/use-toast.ts";
import { escapeIdentifier } from "@/lib/db/pg-utils/escape.ts";
import {
  generateBulkInsertQuery,
  generateCreateTableQuery,
  generateDataSchemaFromCsvData,
} from "@/lib/db/queries.ts";
import { parseCsv } from "@/lib/csv.ts";
import { PreviewTables, Table } from "@/pages/main/PreviewTables.tsx";
import { usePGlite } from "@electric-sql/pglite-react";
import {
  type ChangeEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";

const useCreateTableAndData = (appendTableToList: (table: Table) => void) => {
  const db = usePGlite();
  const { toast } = useToast();

  return async ({
    tableName,
    header,
    data,
  }: {
    tableName: string;
    header: string[];
    data: string[][];
  }) => {
    const dataSchema = generateDataSchemaFromCsvData({
      header,
      data,
    });

    const createTableQuery = generateCreateTableQuery({
      tableName,
      schema: dataSchema,
    });
    console.log("creatTableQuery", createTableQuery);
    await db
      .query(createTableQuery)
      .then((res) => {
        console.log("table created", res);
      })
      .catch((error) => {
        console.error("table creation error", error);
        toast({
          title: "Table Creation Error",
          description: error.message as string,
          variant: "destructive",
        });
      });

    const bulkInsertQuery = generateBulkInsertQuery({
      tableName,
      schema: dataSchema,
      data,
    });
    console.log("bulkInsertQuery", bulkInsertQuery.query);

    await db
      .query(bulkInsertQuery.query)
      .then((res) => {
        console.log("data inserted", res);
      })
      .catch((error) => {
        console.error("data insertion error", error);
        toast({
          title: "Data Insertion Error",
          description: error.message as string,
          variant: "destructive",
        });
      });

    appendTableToList({
      name: tableName,
      schema: dataSchema,
      createTableQuery,
    });
  };
};

export const ImportForm = ({
  inputRef,
  tableName,
  setTableName,
  setQuery,
  tables,
  appendTableToList,
}: {
  inputRef: RefObject<HTMLInputElement>;
  tableName: string;
  setTableName: (tbl: string) => void;
  setQuery: Dispatch<SetStateAction<string>>;
  tables: Array<Table>;
  appendTableToList: (table: Table) => void;
}) => {
  const createTableAndData = useCreateTableAndData(appendTableToList);

  const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    const parsed = await parseCsv(file);
    const [head, ...rest] = parsed;

    const tblName = (() => {
      const segments = file.name.split(".");
      if (segments.length !== 1) {
        segments.pop();
      }
      return segments.join(".");
    })();

    await createTableAndData({
      tableName: tblName,
      header: head,
      data: rest,
    });

    setTableName(tblName);
    setQuery((p) => {
      if (p) return p;
      return `SELECT *\nFROM ${escapeIdentifier(tblName)}`;
    });
    inputRef.current!.value = "";
  };

  return (
    <Card className="p-4 space-y-4">
      <Input
        ref={inputRef}
        className="w-auto cursor-pointer"
        type="file"
        accept="text/csv"
        multiple={false}
        onChange={onFileSelected}
      />

      <PreviewTables tables={tables} />
    </Card>
  );
};
