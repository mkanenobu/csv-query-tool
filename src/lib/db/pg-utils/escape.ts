export const escapeText = (text: string) => `'${text.replace(/'/g, "''")}'`;

export const escapeIdentifier = (identifier: string) =>
  `"${identifier.replace(/"/g, '""')}"`;
