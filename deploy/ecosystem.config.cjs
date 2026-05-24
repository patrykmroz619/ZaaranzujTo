// Apps run directly from the synced repo (built in place on the VPS).
// Paths are stable (no release symlink), so pm2 reload picks up new builds cleanly.
// Each script is run with pm2's own Node — no bun/PATH dependency at runtime.
// Env comes from each app's own apps/<app>/.env (loaded by Next/Astro/Nest directly).
const APP = "/projects/ZaaranzujTo";

module.exports = {
  apps: [
    {
      name: "api",
      cwd: `${APP}/apps/platform-api`,
      script: "dist/src/main.js",
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "350M",
    },
    {
      name: "web",
      cwd: `${APP}/apps/platform-web`,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "400M",
    },
    {
      name: "landing",
      cwd: `${APP}/apps/landing-page`,
      script: "node_modules/.bin/serve",
      args: "dist --listen 8081 --no-clipboard",
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "80M",
    },
  ],
};
