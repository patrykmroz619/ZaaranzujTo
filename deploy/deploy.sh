#!/usr/bin/env bash
# Runs ON the VPS. CI rsyncs the source here, then invokes this over SSH.
# Builds in place (Bun manages its own node_modules locally — nothing is relocated)
# and reloads pm2. Stable paths mean reload reliably runs the fresh build.
set -euo pipefail

# Make bun + node available under a non-interactive SSH shell.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH="$HOME/.bun/bin:$PATH"

APP="/projects/ZaaranzujTo"
cd "$APP"

echo "==> Installing dependencies"
bun install --frozen-lockfile

echo "==> Building"
# Each app loads its own apps/<app>/.env (Next, Astro, and Nest's ConfigModule all read
# it directly), so no env wiring is needed here. --concurrency=1 builds apps one at a
# time (deps still ordered via ^build), so peak RAM is the single heaviest build (Next)
# rather than all apps' builds stacked together.
bun run build --concurrency=1

echo "==> Reloading pm2"
pm2 startOrReload deploy/ecosystem.config.cjs --update-env
pm2 save

echo "==> Health check"
ok=0
for _ in $(seq 1 30); do
  if curl -fsS --max-time 5 http://127.0.0.1:8080/api/v1/health >/dev/null \
   && curl -fsS --max-time 5 http://127.0.0.1:3000/api/health   >/dev/null \
   && curl -fsS --max-time 5 http://127.0.0.1:8081/             >/dev/null; then
    ok=1
    break
  fi
  sleep 2
done

if [ "$ok" -ne 1 ]; then
  echo "Health check FAILED — recent logs:"
  pm2 logs --nostream --lines 40 || true
  exit 1
fi

echo "Deploy OK"
