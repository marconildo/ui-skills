import { spawn } from "node:child_process";

const port = 4399;
const server = spawn(
  "npx",
  ["wrangler", "dev", "--local", "--ip", "127.0.0.1", "--port", `${port}`],
  {
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let output = "";
server.stdout.on("data", (chunk) => {
  output += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  output += chunk.toString();
});

const waitForServer = async () => {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not start:\n${output}`);
};

try {
  await waitForServer();

  const homepage = await fetch(`http://127.0.0.1:${port}/`);
  if (homepage.status !== 200) {
    throw new Error(`Homepage returned ${homepage.status}`);
  }
  if (homepage.headers.get("content-security-policy") === null) {
    throw new Error("Homepage is missing Content-Security-Policy");
  }
  const homepageBody = await homepage.text();
  if (!/^<!doctype html>/i.test(homepageBody)) {
    throw new Error(`Homepage did not return HTML: ${homepageBody.slice(0, 200)}`);
  }

  const registry = await fetch(`http://127.0.0.1:${port}/skills/registry.json`);
  if (registry.status !== 200) {
    throw new Error(`Registry returned ${registry.status}`);
  }

  const missing = await fetch(`http://127.0.0.1:${port}/skills/does-not-exist`);
  if (missing.status !== 404) {
    throw new Error(`Missing route returned ${missing.status}`);
  }
} finally {
  server.kill("SIGTERM");
}
