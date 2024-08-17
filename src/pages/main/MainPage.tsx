import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { useToast } from "@/components/ui/use-toast.ts";
import type { QueryResult } from "@/lib/db/queries.ts";
import { noParse } from "@/lib/db/query-options.ts";
import { ImportForm } from "@/pages/main/ImportForm.tsx";
import { Table } from "@/pages/main/PreviewTables.tsx";
import { QueryEditor } from "@/pages/main/QueryEditor.tsx";
import { QueryResultTable } from "@/pages/main/QueryResultTable.tsx";
import { usePGlite } from "@electric-sql/pglite-react";
import { useRef, useState } from "react";

export const useExecuteUserQuery = () => {
  const db = usePGlite();
  const { toast } = useToast();

  const [executing, setExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<{
    queryResult: QueryResult;
    timestamp: Date;
  } | null>(null);

  const executeQuery = async (query: string) => {
    if (!query) return;

    setExecuting(true);
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
      })
      .finally(() => {
        setExecuting(false);
      });
  };

  return {
    queryResult,
    executeQuery,
    executing,
  };
};

export const MainPage = () => {
  const [query, setQuery] = useState("");
  const [tables, setTables] = useState<Array<Table>>([]);

  const appendTable = (t: Table) => {
    setTables((prev) => {
      return [...prev, t];
    });
  };

  const { queryResult, executeQuery, executing } = useExecuteUserQuery();

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <ImportForm
          inputRef={fileInputRef}
          setQuery={setQuery}
          tables={tables}
          appendTableToList={appendTable}
        />

        <Card className="p-4 grow">
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
              basicSetup={{
                autocompletion: true,
              }}
              onChange={(value, _viewUpdate) => {
                setQuery(value);
              }}
              placeholder={"SELECT 1"}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  executeQuery(query);
                }
              }}
            />
            <Button className="mt-4" type="submit" disabled={executing}>
              Exec
            </Button>
          </form>
        </Card>
      </div>

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
