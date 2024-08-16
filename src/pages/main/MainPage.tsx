import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { type ChangeEvent, useState } from "react";
import { parseCsv } from "@/lib/parse-csv.ts";
import { DataPreviewTable } from "@/pages/main/DataPreviewTable.tsx";
import { Card } from "@/components/ui/card.tsx";
import { usePGlite } from "@electric-sql/pglite-react";
import {
  generateBulkInsertQueryByCsv,
  generateCreateTableQueryByCsv,
} from "@/lib/db.ts";
import { QueryResultTable } from "@/pages/main/QueryResultTable.tsx";
import { useToast } from "@/components/ui/use-toast.ts";
import { Button } from "@/components/ui/button.tsx";

export const MainPage = () => {
  const db = usePGlite();
  const { toast } = useToast();

  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState<any>(null);

  const [header, setHeader] = useState<string[]>(["example1", "example2"]);
  const [data, setData] = useState<any[][]>([
    ["data1-1", "data1-2"],
    ["data2-1", "data2-2"],
  ]);
  const [tableName, setTableName] = useState<string>("");

  const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    const parsed = await parseCsv(file);
    const [head, ...rest] = parsed;
    setHeader(head);
    setData(rest);

    const table = file.name.split(".").at(0)!;
    const creatTableQuery = generateCreateTableQueryByCsv(table, head, rest);
    console.log("creatTableQuery", creatTableQuery);
    await db.query(creatTableQuery).then((res) => {
      console.log("table created", res);
    });

    const { query } = generateBulkInsertQueryByCsv(table, head, rest);
    await db.query(query).then((res) => {
      console.log("data inserted", res);
    });
    setTableName(table);
    setQuery(`SELECT *\nFROM ${table}`);
  };

  const onQuerySubmit = async () => {
    return db
      .query(query)
      .then((res) => {
        console.log("query result", res);
        setQueryResult(res);
      })
      .catch((error) => {
        toast({
          title: "Query Error",
          description: error.message as string,
        });
      });
  };

  return (
    <div className="flex flex-col gap-8 p-4">
      <div>
        <Input
          className="w-120"
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

            onQuerySubmit();
          }}
        >
          <Textarea
            className="font-mono mt-4"
            placeholder="SELECT 1"
            rows={10}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                onQuerySubmit();
              }
            }}
          />
          <Button className="mt-4" type="submit">
            Exec
          </Button>
        </form>
      </Card>

      <Card className="p-4">
        <h2>Query Result</h2>
        {queryResult && <QueryResultTable queryResult={queryResult} />}
      </Card>
    </div>
  );
};
