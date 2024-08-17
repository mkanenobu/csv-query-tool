import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { QueryEditor } from "@/pages/main/QueryEditor.tsx";
import { useState } from "react";

export const ImportDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) => {
  const [query, setQuery] = useState("SELECT 2");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[75vw]">
        <DialogHeader>
          <DialogTitle>Create table with following query</DialogTitle>
          <DialogDescription className="p-4">
            <QueryEditor
              value={query}
              onChange={(q) => {
                setQuery(q);
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

          <Button type="button">Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
