import { createServer } from "node:http";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { pathToFileURL } from "node:url";

const UPSTREAM_BASE_URL = "https://vortex.worldofwarships.eu/api/encyclopedia/en/";
const API_ENDPOINTS = new Set(["vehicles", "nations", "vehicle_types_common", "media_path"]);
const DEFAULT_TIMEOUT_MS = 15_000;
const RESPONSE_HEADERS = ["cache-control", "content-type", "etag", "last-modified"];

function sendJson(response, statusCode, body, extraHeaders = {}) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "x-content-type-options": "nosniff",
    ...extraHeaders,
  });
  response.end(JSON.stringify(body));
}

function getEndpoint(pathname) {
  const match = /^\/api\/([a-z_]+)\/?$/.exec(pathname);
  const endpoint = match?.[1];

  return endpoint && API_ENDPOINTS.has(endpoint) ? endpoint : undefined;
}

export function createApiProxyServer({
  fetchImpl = fetch,
  upstreamBaseUrl = UPSTREAM_BASE_URL,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  return createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://localhost");

    if (requestUrl.pathname === "/health") {
      if (request.method !== "GET") {
        sendJson(response, 405, { error: "Method not allowed" }, { allow: "GET" });
        return;
      }

      sendJson(response, 200, { status: "ok" });
      return;
    }

    const endpoint = getEndpoint(requestUrl.pathname);

    if (!endpoint) {
      sendJson(response, 404, { error: "API endpoint not found" });
      return;
    }

    if (request.method !== "GET") {
      sendJson(response, 405, { error: "Method not allowed" }, { allow: "GET" });
      return;
    }

    if (requestUrl.search) {
      sendJson(response, 400, { error: "Query parameters are not supported" });
      return;
    }

    let upstreamUrl;

    try {
      upstreamUrl = new URL(`${endpoint}/`, upstreamBaseUrl);
    } catch {
      sendJson(response, 500, { error: "API proxy is misconfigured" });
      return;
    }

    let upstreamResponse;

    try {
      upstreamResponse = await fetchImpl(upstreamUrl, {
        method: "GET",
        headers: { accept: "application/json" },
        redirect: "error",
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      const timedOut = error instanceof Error && error.name === "TimeoutError";
      sendJson(response, timedOut ? 504 : 502, {
        error: timedOut ? "Upstream API timed out" : "Upstream API is unavailable",
      });
      return;
    }

    const headers = Object.fromEntries(
      RESPONSE_HEADERS.flatMap((header) => {
        const value = upstreamResponse.headers.get(header);
        return value ? [[header, value]] : [];
      }),
    );
    headers["x-content-type-options"] = "nosniff";
    response.writeHead(upstreamResponse.status, headers);

    if (!upstreamResponse.body) {
      response.end();
      return;
    }

    try {
      await pipeline(Readable.fromWeb(upstreamResponse.body), response);
    } catch {
      if (!response.headersSent) {
        sendJson(response, 502, { error: "Upstream API response could not be read" });
      } else {
        response.destroy();
      }
    }
  });
}

function getPort(value) {
  const port = Number(value ?? 8787);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return port;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = getPort(process.env.PORT);
  const host = process.env.HOST ?? "127.0.0.1";

  createApiProxyServer().listen(port, host, () => {
    process.stdout.write(`Vortex API proxy listening on http://${host}:${port}\n`);
  });
}
