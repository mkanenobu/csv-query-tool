import { debug, error, info, trace, warn } from "@tauri-apps/plugin-log";

const tee = (
  level: "log" | "trace" | "debug" | "info" | "warn" | "error",
  logger: (msg: string) => Promise<void>,
) => {
  return (msg: string, ...data: any[]) => {
    logger(msg);
    console[level](msg, ...data);
  };
};

export const logger = {
  log: tee("log", trace),
  trace: tee("trace", trace),
  debug: tee("debug", debug),
  info: tee("info", info),
  warn: tee("warn", warn),
  error: tee("error", error),
} as const;
