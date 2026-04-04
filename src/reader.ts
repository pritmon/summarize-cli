import * as fs from "fs";
import * as path from "path";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;

export async function readFile(filePath: string): Promise<string> {
  if (path.extname(filePath).toLowerCase() === ".pdf") {
    const buffer = await fs.promises.readFile(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }
  return fs.promises.readFile(filePath, "utf-8");
}
