import { cn } from "@/lib/utils.ts";
import { PostgreSQL, sql } from "@codemirror/lang-sql";
import CodeMirror, {
  type BasicSetupOptions,
  type ReactCodeMirrorProps,
} from "@uiw/react-codemirror";

export const QueryEditor = ({
  ...props
}: Omit<ReactCodeMirrorProps, "basicSetup"> & {
  basicSetup?: BasicSetupOptions;
}) => {
  return (
    <CodeMirror
      // TODO: pass schema for completion
      extensions={[
        sql({
          dialect: PostgreSQL,
          upperCaseKeywords: true,
        }),
      ]}
      height="100%"
      {...props}
      className={cn("resize-y !overflow-auto font-mono", props.className)}
      basicSetup={{
        tabSize: 2,
        foldGutter: false,
        ...props.basicSetup,
      }}
    />
  );
};
