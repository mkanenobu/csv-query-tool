export const formatValueToDisplay = (value: any) => {
  if (value === null) {
    return "NULL";
  } else if (typeof value === "object") {
    return JSON.stringify(value, undefined, 2);
  } else if (typeof value === "string") {
    return value;
  } else {
    return value.toString();
  }
};
