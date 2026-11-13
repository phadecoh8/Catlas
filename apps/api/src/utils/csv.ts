import { parse } from "csv-parse";

const MAX_FILE_BYTES = 2 * 1024 * 1024;

export type CsvRow = Record<string, string>;

export function isFileTooLarge(size: number): boolean {
  return size > MAX_FILE_BYTES;
}

export async function parseCsv(
  text: string,
): Promise<CsvRow[]> {
  const parser = parse(text, {
    bom: true,
    columns: true,
    skipEmptyLines: true,
    trim: true,
  });

  const rows: CsvRow[] = [];

  for await (const row of parser) {
    rows.push(neutraliseRow(row as CsvRow));
  }

  return rows;
}

export function neutraliseCell(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) {
    return `'${value}`;
  }

  return value;
}

function neutraliseRow(row: CsvRow): CsvRow {
  const safe: CsvRow = {};

  for (const [key, value] of Object.entries(row)) {
    safe[key] = neutraliseCell(String(value));
  }

  return safe;
}
