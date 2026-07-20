import { afterEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { getGithubStars } from "../src/lib/github-stars.ts";
import { getRemoteSkill, RemoteSkillError } from "../src/lib/remote-skill.ts";

const originalFetch = globalThis.fetch;
const originalCaches = (globalThis as typeof globalThis & { caches?: unknown })
  .caches;

const setCache = (cache: unknown) => {
  Object.defineProperty(globalThis, "caches", {
    configurable: true,
    value: cache === undefined ? undefined : { default: cache },
  });
};

afterEach(() => {
  globalThis.fetch = originalFetch;
  setCache(originalCaches);
  delete process.env.GITHUB_TOKEN;
});

describe("remote skill content", () => {
  test("uses cached content when the upstream request fails", async () => {
    let fetchCalls = 0;
    const cache = {
      match: async () => new Response("cached skill"),
      put: async () => undefined,
    };
    setCache(cache);
    globalThis.fetch = async () => {
      fetchCalls += 1;
      return new Response("unavailable", { status: 503 });
    };

    const result = await getRemoteSkill("https://example.com/skill.md");

    assert.deepEqual(result, { content: "cached skill", stale: true });
    assert.equal(fetchCalls, 1);
  });

  test("preserves upstream 404 semantics even when cached content exists", async () => {
    setCache({
      match: async () => new Response("deleted skill"),
      put: async () => undefined,
    });
    globalThis.fetch = async () => new Response("missing", { status: 404 });

    await assert.rejects(
      getRemoteSkill("https://example.com/deleted.md"),
      (error: unknown) =>
        error instanceof RemoteSkillError && error.status === 404,
    );
  });

  test("rejects content larger than the configured bound", async () => {
    setCache({ match: async () => undefined, put: async () => undefined });
    globalThis.fetch = async () =>
      new Response("x".repeat(1024 * 1024 + 1), { status: 200 });

    await assert.rejects(
      getRemoteSkill("https://example.com/large.md"),
      (error: unknown) =>
        error instanceof RemoteSkillError && error.status === 502,
    );
  });
});

describe("GitHub stars", () => {
  test("returns formatted stars from GitHub", async () => {
    globalThis.fetch = async (_input, init) => {
      assert.ok(init?.signal);
      return new Response(JSON.stringify({ stargazers_count: 1234 }), {
        status: 200,
      });
    };

    const result = await getGithubStars();

    assert.deepEqual(result, { stars: 1234, label: "1.2k+" });
  });

  test("degrades to null for malformed or failed GitHub responses", async () => {
    globalThis.fetch = async () => new Response("not json", { status: 200 });
    assert.equal(await getGithubStars(), null);

    globalThis.fetch = async () => {
      throw new Error("network unavailable");
    };
    assert.equal(await getGithubStars(), null);
  });
});
