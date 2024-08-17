import { type PgType } from "@/lib/db/pg-types.ts";

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
  const pattern = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/; // open end
  return pattern.test(v);
};

const isUUID = (v: string): boolean => {
  const pattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
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
  {
    detector: isUUID,
    pgType: "UUID",
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
