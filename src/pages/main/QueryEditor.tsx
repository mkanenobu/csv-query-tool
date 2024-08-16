import CodeMirror, { type ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";

export const QueryEditor = (props: ReactCodeMirrorProps) => {
  return (
    <CodeMirror
      // TODO: pass schema for completion
      extensions={[sql({})]}
      {...props}
    />
  );
};
