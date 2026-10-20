import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { createApiProxyServer } from "./api-proxy.mjs";

const UPSTREAM_BASE_URL = "https://vortex.test/api/encyclopedia/en/";
const upstreamRequests = [];
let upstreamFetch;
let server;
let baseUrl;

before(async () => {
  upstreamFetch = async (url, options) => {
    upstreamRequests.push({ url: url.href, options });
    return Response.json({ status: "ok", data: url.pathname.split("/").at(-2) });
  };

  const fetchImpl = (...args) => upstreamFetch(...args);
  server = createApiProxyServer({ fetchImpl, upstreamBaseUrl: UPSTREAM_BASE_URL });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe("Vortex API proxy", () => {
  it("reports health without contacting the upstream API", async () => {
    const callsBefore = upstreamRequests.length;
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
    assert.equal(upstreamRequests.length, callsBefore);
  });

  it("forwards each supported endpoint to its fixed upstream path", async (context) => {
    for (const endpoint of ["vehicles", "nations", "vehicle_types_common", "media_path"]) {
      await context.test(endpoint, async () => {
        const response = await fetch(`${baseUrl}/api/${endpoint}/`);
        const request = upstreamRequests.at(-1);

        assert.equal(response.status, 200);
        assert.deepEqual(await response.json(), { status: "ok", data: endpoint });
        assert.equal(request?.url, `${UPSTREAM_BASE_URL}${endpoint}/`);
        assert.equal(request?.options.method, "GET");
        assert.equal(request?.options.redirect, "error");
        assert.equal(request?.options.headers.accept, "application/json");
        assert.ok(request?.options.signal instanceof AbortSignal);
      });
    }
  });

  it("rejects unknown routes and path traversal without contacting upstream", async () => {
    const callsBefore = upstreamRequests.length;

    for (const path of ["/api/unknown/", "/api/vehicles/extra/", "/api/../nations/"]) {
      const response = await fetch(`${baseUrl}${path}`);
      assert.equal(response.status, 404);
      assert.deepEqual(await response.json(), { error: "API endpoint not found" });
    }

    assert.equal(upstreamRequests.length, callsBefore);
  });

  it("allows only GET for API routes", async () => {
    const callsBefore = upstreamRequests.length;
    const response = await fetch(`${baseUrl}/api/vehicles/`, { method: "POST" });

    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "GET");
    assert.deepEqual(await response.json(), { error: "Method not allowed" });
    assert.equal(upstreamRequests.length, callsBefore);
  });

  it("rejects query parameters because the proxy exposes fixed read-only requests", async () => {
    const callsBefore = upstreamRequests.length;
    const response = await fetch(`${baseUrl}/api/vehicles/?url=https://example.com`);

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "Query parameters are not supported" });
    assert.equal(upstreamRequests.length, callsBefore);
  });

  it("passes through upstream error statuses and safe response headers", async () => {
    upstreamFetch = async () =>
      new Response("temporarily unavailable", {
        status: 503,
        headers: {
          "content-type": "text/plain",
          "set-cookie": "session=private",
          "cache-control": "no-store",
        },
      });
    const response = await fetch(`${baseUrl}/api/vehicles/`);

    assert.equal(response.status, 503);
    assert.equal(await response.text(), "temporarily unavailable");
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("set-cookie"), null);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  });

  it("returns 502 when the upstream request fails", async () => {
    upstreamFetch = async () => {
      throw new TypeError("network failure");
    };
    const response = await fetch(`${baseUrl}/api/vehicles/`);

    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { error: "Upstream API is unavailable" });
  });

  it("returns 504 when the upstream request times out", async () => {
    upstreamFetch = async () => {
      const error = new Error("timed out");
      error.name = "TimeoutError";
      throw error;
    };
    const response = await fetch(`${baseUrl}/api/vehicles/`);

    assert.equal(response.status, 504);
    assert.deepEqual(await response.json(), { error: "Upstream API timed out" });
  });
});
