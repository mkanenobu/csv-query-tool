import { Card } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useToast } from "@/components/ui/use-toast.ts";
import { parseCsv } from "@/lib/csv.ts";
import { escapeIdentifier } from "@/lib/db/pg-utils/escape.ts";
import { getTableSchemaFromCreateQuery } from "@/lib/db/pg-utils/parse-sql.ts";
import {
  generateBulkInsertQuery,
  generateCreateTableQuery,
  generateDataSchemaFromCsvData,
  type TableSchema,
} from "@/lib/db/queries.ts";
import { ImportDialog } from "@/pages/main/ImportDialog.tsx";
import { PreviewTables, Table } from "@/pages/main/PreviewTables.tsx";
import { usePGlite } from "@electric-sql/pglite-react";
import {
  type ChangeEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useState,
} from "react";

const useCreateTableAndData = () => {
  const db = usePGlite();
  const { toast } = useToast();

  return async ({
    tableName,
    createTableQuery,
    dataSchema,
    data,
  }: {
    tableName: string;
    createTableQuery: string;
    dataSchema: TableSchema;
    data: string[][];
  }) => {
    console.log("createTableQuery", createTableQuery);
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
        throw error;
      });

    const bulkInsertQuery = generateBulkInsertQuery({
      tableName,
      schema: getTableSchemaFromCreateQuery(createTableQuery),
      data,
    });
    console.log("bulkInsertQuery", bulkInsertQuery.query);

    await db
      .query(bulkInsertQuery.query, bulkInsertQuery.params)
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
        throw error;
      });
  };
};

export const ImportForm = ({
  inputRef,
  setQuery,
  tables,
  appendTableToList,
  removeTableFromList,
}: {
  inputRef: RefObject<HTMLInputElement>;
  setQuery: Dispatch<SetStateAction<string>>;
  tables: Array<Table>;
  appendTableToList: (table: Table) => void;
  removeTableFromList: (tableName: string) => void;
}) => {
  const { toast } = useToast();
  const createTableAndData = useCreateTableAndData();

  const [importInfo, setImportInfo] = useState<{
    tableName: string;
    createTableQuery: string;
    dataSchema: TableSchema;
    sourceFilename: string;
    data: string[][];
  } | null>(null);

  const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    const parsed = await parseCsv(file);
    const [head, ...rest] = parsed;

    if (tables.find((t) => t.sourceFilename === file.name)) {
      toast({
        title: "Table already exists",
        description: "Table with the same source file name already exists",
        variant: "destructive",
      });
      return;
    }

    const tblName = (() => {
      const segments = file.name.split(".");
      if (segments.length !== 1) {
        segments.pop();
      }
      return segments.join(".");
    })();

    const dataSchema = generateDataSchemaFromCsvData({
      header: head,
      data: rest,
    });

    const createTableQuery_ = generateCreateTableQuery({
      tableName: tblName,
      schema: dataSchema,
    });

    // Give params to ImportDialog via local state
    setImportInfo({
      createTableQuery: createTableQuery_,
      dataSchema,
      data: rest,
      tableName: tblName,
      sourceFilename: file.name,
    });
  };

  const onImport = async ({
    tableName,
    createTableQuery,
    dataSchema,
    data,
    sourceFilename,
  }: NonNullable<typeof importInfo>) => {
    const success = await createTableAndData({
      tableName,
      createTableQuery,
      dataSchema,
      data,
    })
      .then(() => {
        return true;
      })
      .catch((_err) => {
        return false;
      });

    inputRef.current!.value = "";

    if (!success) {
      setImportInfo(null);
      return;
    }

    setQuery((p) => {
      if (p) return p;
      return `SELECT *\nFROM ${escapeIdentifier(tableName)}`;
    });

    appendTableToList({
      name: tableName,
      sourceFilename,
      createTableQuery,
    });

    setImportInfo(null);

    toast({
      title: "Table created and data inserted",
    });
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
      {importInfo && (
        <ImportDialog
          open={!!importInfo}
          onOpenChange={(o) => {
            if (!o) {
              setImportInfo(null);
            }
          }}
          initialTableName={importInfo.tableName}
          initialCreateTableQuery={importInfo.createTableQuery}
          onImport={async ({ createTableQuery, tableName }) => {
            return onImport({ ...importInfo, createTableQuery, tableName });
          }}
        />
      )}

      <PreviewTables
        tables={tables}
        removeTableFromList={removeTableFromList}
      />
    </Card>
  );
};
