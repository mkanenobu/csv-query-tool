import { cn } from "@/lib/utils.ts";
import { PostgreSQL, sql } from "@codemirror/lang-sql";
import CodeMirror, {
  type BasicSetupOptions,
  type ReactCodeMirrorProps,
} from "@uiw/react-codemirror";

export const QueryEditor = ({
  completionWords,
  ...props
}: Omit<ReactCodeMirrorProps, "basicSetup"> & {
  basicSetup?: BasicSetupOptions;
  completionWords?: string[];
}) => {
  return (
    <CodeMirror
      extensions={[
        sql({
          dialect: PostgreSQL,
          // HACK: {[schema]:{[table]:column[]}} data schema is not working, so pass flat string array
          schema: completionWords,
        }),
      ]}
      height="100%"
      {...props}
      className={cn(
        "resize-y !overflow-auto font-mono border",
        props.className,
      )}
      basicSetup={{
        tabSize: 2,
        foldGutter: false,
        ...props.basicSetup,
      }}
    />
  );
};
