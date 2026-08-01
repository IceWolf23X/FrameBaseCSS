import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const port = Number.parseInt(process.env.PORT ?? "4173", 10);
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
]);

/** Resolves a request path inside the repository and rejects traversal attempts. */
function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = resolve(repositoryRoot, relativePath);
  const rootPrefix = repositoryRoot.endsWith(sep) ? repositoryRoot : `${repositoryRoot}${sep}`;

  return filePath.startsWith(rootPrefix) ? filePath : null;
}

/** Serves one project file with an explicit content type for browser tests. */
async function serveRequest(request, response) {
  let filePath;
  try {
    filePath = resolveRequestPath(request.url ?? "/");
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }

  if (!filePath) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
  } catch {
    response.writeHead(404).end("Not found");
    return;
  }

  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": contentTypes.get(extname(filePath)) ?? "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}

/** Starts the local-only static server used by Playwright. */
function main() {
  // Adapts each HTTP request to the asynchronous file-serving contract.
  const server = createServer((request, response) => {
    void serveRequest(request, response);
  });

  // Reports only after the loopback listener is ready for Playwright.
  server.listen(port, "127.0.0.1", () => {
    console.log(`FrameBaseCSS test server: http://127.0.0.1:${port}`);
  });
}

main();
