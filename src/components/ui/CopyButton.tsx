import { Button } from "@/components/ui/button.tsx";
import { useToast } from "@/components/ui/use-toast.ts";
import { CheckIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export const CopyButton = ({ text }: { text: string }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((e) => {
        toast({
          title: "Copy Error",
          description: e.message,
          variant: "destructive",
        });
      });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      data-copied={copied}
      className="group"
      onClick={(e) => {
        e.stopPropagation();
        copy();
      }}
    >
      <ClipboardCopyIcon className="size-4 group-data-[copied=true]:hidden" />
      <CheckIcon className="size-4 hidden group-data-[copied=true]:block" />
    </Button>
  );
};
