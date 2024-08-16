import { type PgType } from "@/lib/pg-types.ts";

type Detector = (v: string) => boolean;

const isInteger = (v: string): boolean => {
  const pattern = /^-?[0-9]+$/;
  return pattern.test(v);
};

const isFloat = (v: string): boolean => {
  const pattern = /^-?[0-9]+\.[0-9]+$/;
  return pattern.test(v);
};

const isDate = (v: string): boolean => {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  return pattern.test(v);
};

const isTimestamp = (v: string): boolean => {
  const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
  return pattern.test(v);
};

const detectors = [
  {
    detector: isInteger,
    pgType: "INT8",
  },
  {
    detector: isFloat,
    pgType: "FLOAT8",
  },
  {
    detector: isDate,
    pgType: "DATE",
  },
  {
    detector: isTimestamp,
    pgType: "TIMESTAMP",
  },
] satisfies Array<{ detector: Detector; pgType: PgType }>;

export const detectDataType = (v: string) => {
  for (const { detector, pgType } of detectors) {
    if (detector(v)) {
      return pgType;
    }
  }
  return "TEXT";
};
