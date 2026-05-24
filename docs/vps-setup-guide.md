# VPS Setup Guide — Mikrus from Scratch

This guide sets up the ZaaranżujTo production server from a blank Mikrus VPS: installs all required software, clones the repo, configures nginx as a reverse proxy, wires up pm2 process management, and configures GitHub Actions CI/CD.

**Apps and their internal ports (never exposed publicly — nginx proxies them):**

| App          | Internal port |
| ------------ | ------------- |
| platform-api | 8080          |
| platform-web | 3000          |
| landing-page | 8081          |

---

## Mikrus networking — read this first

Mikrus runs **LXC containers**, not full VMs. This has two important consequences:

1. **Ports are managed through the Mikrus panel, not UFW/iptables.** Do not run `ufw` — it has no effect on LXC containers. Public port access is controlled entirely from [panel.mikr.us](https://panel.mikr.us).

2. **Your server has an IPv6 address but no dedicated IPv4.** Cloudflare proxies traffic from the internet to your IPv6 address. nginx must listen on IPv6.

Default ports every Mikrus VPS gets (where `ID` is your machine number, shown in the panel):

| Port         | Purpose                                     |
| ------------ | ------------------------------------------- |
| `10000 + ID` | SSH — reserved, don't use for anything else |
| `20000 + ID` | General purpose (TCP)                       |
| `30000 + ID` | General purpose (TCP)                       |

You can request up to 7 more ports through the panel at no extra cost.

---

## Prerequisites (on your local machine)

- SSH client (built into macOS/Linux/Windows 11)
- Mikrus panel account — [panel.mikr.us](https://panel.mikr.us)
- A domain with Cloudflare DNS (required — see Step 14)
- Your GitHub repo URL

---

## Step 1 — First SSH Connection

Open [panel.mikr.us](https://panel.mikr.us) — your dashboard shows the exact SSH command to copy-paste, including the hostname and port.

The SSH port formula is always `10000 + machine_ID`. Machine 123 → port `10123`.

```sh
ssh root@<srvXX>.mikr.us -p <10000+ID>
```

> **Warning:** Never try to connect on port 22. Five failed attempts on port 22 block your IP for 24 hours.

When prompted about the host fingerprint, type `yes`. You are now logged in as `root`.

---

## Step 2 — System Update & Essential Tools

```sh
apt update && apt upgrade -y
apt install -y git curl wget unzip nginx
```

**Why:** `apt upgrade` applies security patches. `nginx` is the reverse proxy. No `ufw`, no `certbot` — firewall is managed by the panel, and SSL is handled by Cloudflare (see Step 14).

---

## Step 3 — Create a Deploy User

Running everything as root is dangerous — a misconfigured GitHub Actions secret could give full root access to anyone who obtains it.

```sh
adduser deploy
usermod -aG sudo deploy
mkdir -p /projects
chown deploy:deploy /projects
```

Set a strong password when prompted. Switch to the new user for all remaining steps:

```sh
su - deploy
```

---

## Step 4 — Install Node.js via nvm

`nvm` manages Node versions per-user. The deploy script sources it explicitly so it works in non-interactive SSH sessions.

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
node -v   # should print v22.x.x or similar
```

---

## Step 5 — Install Bun

```sh
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
bun -v   # should print 1.x.x
```

---

## Step 6 — Install pm2

pm2 keeps Node apps alive and restarts them on crash.

```sh
npm install -g pm2
pm2 -v
```

---

## Step 7 — Add the Deploy SSH Key

GitHub Actions SSHes into this server to trigger deploys. Generate a dedicated key pair **on your local machine**:

```sh
# Run this locally, not on the VPS
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/zaaranzujto_deploy
```

Two files are created:

- `~/.ssh/zaaranzujto_deploy` — **private key** → goes into GitHub Secrets
- `~/.ssh/zaaranzujto_deploy.pub` — **public key** → goes onto the VPS

Add the public key to the VPS (run on the VPS as the `deploy` user):

```sh
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "ssh-ed25519 AAAA...paste-your-public-key-here..." >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Verify you can connect from your local machine before continuing:

```sh
# Run locally
ssh deploy@<srvXX>.mikr.us -p <10000+ID> -i ~/.ssh/zaaranzujto_deploy
```

---

## Step 8 — Clone the Repository

```sh
cd /projects
git clone https://github.com/<your-org>/ZaaranzujTo.git zaaranzujto
```

For a private repo, use a GitHub Personal Access Token (PAT):

```sh
git clone https://<your-github-username>:<PAT>@github.com/<your-org>/ZaaranzujTo.git zaaranzujto
```

Verify:

```sh
ls /projects/zaaranzujto   # should list monorepo contents
```

---

## Step 9 — Configure Environment Variables

Each app reads its own `.env` from its directory. These are **not** in git — create them once on the VPS. They survive `git reset --hard` during deploys (git only touches tracked files).

### platform-api

```sh
cp /projects/ZaaranzujTo/apps/platform-api/.env.example /projects/ZaaranzujTo/apps/platform-api/.env
nano /projects/ZaaranzujTo/apps/platform-api/.env
```

```env
PORT=8080
NODE_ENV=production

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>

CLERK_SECRET_KEY=sk_live_...
CLERK_PUBLISHABLE_KEY=pk_live_...

OPENROUTER_API_KEY=sk-or-...

CLOUDFLARE_R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET_NAME=...
```

### platform-web

```sh
cp /projects/ZaaranzujTo/apps/platform-web/.env.example /projects/ZaaranzujTo/apps/platform-web/.env
nano /projects/ZaaranzujTo/apps/platform-web/.env
```

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_API_URL=https://api.<your-domain>
```

### landing-page

```sh
cp /projects/ZaaranzujTo/apps/landing-page/.env.example /projects/ZaaranzujTo/apps/landing-page/.env
nano /projects/ZaaranzujTo/apps/landing-page/.env
```

```env
PUBLIC_APP_URL=https://app.<your-domain>
```

---

## Step 10 — Initial Build

```sh
cd /projects/ZaaranzujTo
bun install --frozen-lockfile
bun run build --concurrency=1
```

`--concurrency=1` builds one app at a time to avoid OOM on a small VPS. This takes 3–5 minutes.

---

## Step 11 — Start Apps with pm2

```sh
cd /projects/ZaaranzujTo
pm2 startOrReload deploy/ecosystem.config.cjs --update-env
pm2 save
```

Check all three apps are running:

```sh
pm2 status
```

You should see `api`, `web`, and `landing` all with status `online`. If any is `errored`, check logs:

```sh
pm2 logs api --lines 50
pm2 logs web --lines 50
pm2 logs landing --lines 50
```

Quick internal health check:

```sh
curl -s http://127.0.0.1:8080/api/v1/health
curl -s http://127.0.0.1:3000/api/health
curl -s http://127.0.0.1:8081/
```

Each should return a 200 response.

---

## Step 12 — Configure pm2 to Start on Reboot

```sh
pm2 startup
```

pm2 prints a command — copy and run it exactly. It looks like:

```
sudo env PATH=$PATH:/home/deploy/.nvm/versions/node/v22.x.x/bin pm2 startup systemd -u deploy --hp /home/deploy
```

Then:

```sh
pm2 save
```

---

## Step 13 — Configure nginx

nginx listens on **IPv6** port 80 — that is how Cloudflare reaches your server (see Step 14). The key is `listen [::]:80` instead of just `listen 80`.

Create one config file per domain:

### Landing page (`zaaranzujto.pl`)

```sh
sudo nano /etc/nginx/sites-available/landing
```

```nginx
server {
    listen [::]:80;
    server_name zaaranzujto.pl www.zaaranzujto.pl;

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Web app (`app.zaaranzujto.pl`)

```sh
sudo nano /etc/nginx/sites-available/web
```

```nginx
server {
    listen [::]:80;
    server_name app.zaaranzujto.pl;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### API (`api.zaaranzujto.pl`)

```sh
sudo nano /etc/nginx/sites-available/api
```

```nginx
server {
    listen [::]:80;
    server_name api.zaaranzujto.pl;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable all three and reload:

```sh
sudo ln -s /etc/nginx/sites-available/landing /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/web     /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api     /etc/nginx/sites-enabled/

sudo nginx -t            # check for config errors
sudo systemctl reload nginx
```

---

## Step 14 — DNS via Cloudflare (required)

Mikrus VPS has no dedicated IPv4. All public traffic must go through Cloudflare, which proxies from the internet to your server's IPv6 address. **You need a domain on Cloudflare for this to work.**

### Find your server's IPv6 address

Run on the VPS:

```sh
ip -6 a s
```

You will see two IPv6 addresses. **Use the one that does NOT start with `fe80`** — the `fe80` address is link-local and only works within the local network.

### Add DNS records in Cloudflare

For each domain/subdomain, add an **AAAA** record (not A):

| Name  | Type | Value                 | Proxy status           |
| ----- | ---- | --------------------- | ---------------------- |
| `@`   | AAAA | `<your IPv6 address>` | Proxied (orange cloud) |
| `www` | AAAA | `<your IPv6 address>` | Proxied (orange cloud) |
| `app` | AAAA | `<your IPv6 address>` | Proxied (orange cloud) |
| `api` | AAAA | `<your IPv6 address>` | Proxied (orange cloud) |

> **The proxy must be ON (orange cloud).** Do not set it to "DNS only" — without the proxy, Cloudflare cannot reach your server because Mikrus doesn't expose port 80 on IPv4.

### Configure Cloudflare SSL/TLS

In Cloudflare dashboard → **SSL/TLS** → set mode to **Flexible**.

**Why Flexible:** nginx serves plain HTTP on port 80 (IPv6). Cloudflare terminates HTTPS for visitors, then connects to your server over HTTP. "Full" or "Full (strict)" would require a certificate on your server — not needed here, and certbot won't work on Mikrus.

DNS propagation takes a few minutes. Verify:

```sh
# Run locally
nslookup zaaranzujto.pl
```

Should resolve to a Cloudflare IP (not your VPS IPv6 — that's expected, Cloudflare proxies it).

---

## Step 15 — Configure GitHub Actions Secrets

Go to your GitHub repo → **Settings → Secrets and variables → Actions → Secrets** and add:

| Secret name       | Value                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| `DEPLOY_SSH_KEY`  | Full contents of `~/.ssh/zaaranzujto_deploy` (the **private** key, including `-----BEGIN...` header) |
| `VPS_HOST`        | Your VPS hostname, e.g. `srv06.mikr.us`                                                              |
| `VPS_PORT`        | SSH port (`10000 + machine_ID`)                                                                      |
| `VPS_USER`        | `deploy`                                                                                             |
| `VPS_KNOWN_HOSTS` | Output of `ssh-keyscan -p <SSH_PORT> <VPS_HOST>` (run locally)                                       |

To get `VPS_KNOWN_HOSTS`, run this **on your local machine**:

```sh
ssh-keyscan -p <SSH_PORT> <VPS_HOST>
```

Copy the full output (multiple lines) and paste it as the secret value. This pins the server's fingerprint so deploys fail if the server key ever changes unexpectedly.

---

## Step 16 — Configure GitHub Environment

The workflow uses a GitHub **environment** called `prod`. Create it:

1. Go to GitHub repo → **Settings → Environments → New environment**
2. Name it `prod`
3. Optionally add a required reviewer so deploys need manual approval

---

## Step 17 — Verify the Full Pipeline

Push a small change to `main` and watch the Actions tab:

1. The `ci` job runs first (typecheck + lint) — ~2–3 min
2. The `deploy` job runs after `ci` passes — ~5–8 min
3. The last line of the deploy job should be `Deploy OK`

Then open your domains in a browser and confirm everything loads over HTTPS.

---

## Day-to-day Operations

```sh
# View running processes
pm2 status

# Live logs
pm2 logs api
pm2 logs web
pm2 logs landing

# Restart a single app (e.g. after manually editing .env)
pm2 restart api

# View recent logs for all apps
pm2 logs --lines 100 --nostream
```

---

## Troubleshooting

**"Host key verification failed" in GitHub Actions deploy step**
→ The `VPS_KNOWN_HOSTS` secret doesn't match the server key. Re-run `ssh-keyscan` locally and update the secret.

**Health check times out after deploy**
→ SSH into the VPS and run `pm2 logs --lines 50`. Common causes: missing `.env` variable, MongoDB connection refused, wrong port in config.

**Browser shows "Error 521" on Cloudflare**
→ Cloudflare can't reach nginx. Check `sudo systemctl status nginx` on the VPS. Also verify nginx is listening on IPv6: `ss -tlnp | grep 80` should show `[::]:80`.

**Browser shows Cloudflare redirect loop**
→ Your Cloudflare SSL/TLS mode is not set to Flexible. Go to Cloudflare dashboard → SSL/TLS → change to Flexible.

**nginx returns 502 Bad Gateway**
→ nginx is up but the upstream Node app isn't. Check `pm2 status` and restart the failing app.

**"Permission denied" running pm2 or bun over SSH**
→ The `deploy` user's PATH isn't loading. Verify `~/.bashrc` contains the `NVM_DIR` export and `~/.bun/bin` — `deploy.sh` sources it explicitly for non-interactive shells.

**Apps stop running after VPS restart**
→ Run `pm2 startup` again on the VPS and execute the command it prints. Then `pm2 save`.
