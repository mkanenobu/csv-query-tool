import { Input } from "@/components/ui/input.tsx";
import { type ChangeEvent, useState } from "react";
import { parseCsv } from "@/lib/parse-csv.ts";
import { DataPreviewTable } from "@/pages/main/DataPreviewTable.tsx";
import { Card } from "@/components/ui/card.tsx";
import { usePGlite } from "@electric-sql/pglite-react";
import { QueryResultTable } from "@/pages/main/QueryResultTable.tsx";
import { useToast } from "@/components/ui/use-toast.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  generateBulkInsertQuery,
  generateCreateTableQuery,
  generateDataSchemaFromCsvData,
  type QueryResult,
} from "@/lib/db/queries.ts";
import { escapeIdentifier } from "@/lib/db/pg-utils/escape.ts";
import { QueryEditor } from "@/pages/main/QueryEditor.tsx";
import { noParse } from "@/lib/db/query-options.ts";

const useCreateTableAndData = () => {
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

    const creatTableQuery = generateCreateTableQuery({
      tableName,
      schema: dataSchema,
    });
    console.log("creatTableQuery", creatTableQuery);
    await db
      .query(creatTableQuery)
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
  };
};

export const useExecuteUserQuery = () => {
  const db = usePGlite();
  const { toast } = useToast();

  const [queryResult, setQueryResult] = useState<{
    queryResult: QueryResult;
    timestamp: Date;
  } | null>(null);

  const executeQuery = async (query: string) => {
    return db
      .query(query, undefined, { parsers: noParse })
      .then((res) => {
        console.log("query result", res);
        setQueryResult({
          queryResult: res as QueryResult,
          timestamp: new Date(),
        });
      })
      .catch((error) => {
        console.error("query error", error);
        toast({
          title: "Query Error",
          description: error.message as string,
          variant: "destructive",
        });
      });
  };

  return {
    queryResult,
    executeQuery,
  };
};

export const MainPage = () => {
  const [query, setQuery] = useState("");

  const createTableAndData = useCreateTableAndData();

  const [header, setHeader] = useState<string[]>([]);
  const [data, setData] = useState<any[][]>([]);

  const [tableName, setTableName] = useState<string>("");

  const { queryResult, executeQuery } = useExecuteUserQuery();

  const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    const parsed = await parseCsv(file);
    const [head, ...rest] = parsed;
    setHeader(head);
    setData(rest);

    const tblName = file.name.split(".").at(0)!;

    await createTableAndData({
      tableName: tblName,
      header: head,
      data: rest,
    });

    setTableName(tblName);
    setQuery(`SELECT *\nFROM ${escapeIdentifier(tblName)}`);
  };

  return (
    <div className="flex flex-col gap-8 p-4">
      <div>
        <Input
          className="w-auto"
          type="file"
          accept="text/csv"
          multiple={false}
          onChange={onFileSelected}
        />
      </div>

      <p>TableName: {tableName}</p>
      <Card className="p-4">
        <DataPreviewTable
          header={header}
          data={data.slice(0, 5)}
          totalCount={data.length}
        />
      </Card>

      <Card className="p-4">
        <h2>Query</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            executeQuery(query);
          }}
        >
          <QueryEditor
            value={query}
            className="min-h-[10rem]"
            onChange={(value, _viewUpdate) => {
              setQuery(value);
            }}
            placeholder={"SELECT 1"}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                executeQuery(query);
              }
            }}
          />
          <Button className="mt-4" type="submit">
            Exec
          </Button>
        </form>
      </Card>

      <Card className="p-4 space-y-4">
        <h2>Query Result</h2>
        {queryResult && (
          <QueryResultTable
            queryResult={queryResult.queryResult}
            timestamp={queryResult.timestamp}
          />
        )}
      </Card>
    </div>
  );
};
