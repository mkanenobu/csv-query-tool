import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { parseSQL } from "@/lib/db/pg-utils/parse-sql.ts";
import { QueryEditor } from "@/pages/main/QueryEditor.tsx";
import { useState } from "react";

export const ImportDialog = ({
  open,
  onOpenChange,
  initialCreateTableQuery,
  onImport,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initialCreateTableQuery: string;
  onImport: (params: {
    createTableQuery: string;
    tableName: string;
  }) => Promise<void>;
}) => {
  const [createTableQuery, setCreateTableQuery] = useState(
    initialCreateTableQuery,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[75vw]">
        <DialogHeader>
          <DialogTitle>Create table with following query</DialogTitle>
          <DialogDescription className="p-4 space-y-4">
            <QueryEditor
              value={createTableQuery}
              onChange={(q) => {
                setCreateTableQuery(q);
              }}
            />
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="space-x-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={() => {
              const parsed = parseSQL(createTableQuery).at(0);
              if (!parsed || parsed.type !== "create table") return;

              const tableName = parsed.name.name;

              return onImport({
                createTableQuery,
                tableName,
              }).finally(() => {
                onOpenChange(false);
              });
            }}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
