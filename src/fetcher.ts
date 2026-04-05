import * as https from "https";
import * as http from "http";

const MAX_REDIRECTS = 10;

export function fetchUrl(url: string, redirectCount = 0): Promise<string> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https://") ? https : http;
    const req = protocol.get(url, (res) => {
      if (
        res.statusCode !== undefined &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        if (redirectCount >= MAX_REDIRECTS) {
          reject(new Error("Too many redirects (max 10)"));
          return;
        }
        fetchUrl(res.headers.location, redirectCount + 1).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== undefined && res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(15_000, () => {
      req.destroy(new Error("Request timed out after 15 seconds"));
    });
  });
}
