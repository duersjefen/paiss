# CLAUDE.md - PAISS Project Instructions

Static company website deployed via multi-tenant platform.

---

## 🔗 DOCUMENTATION HIERARCHY

**Global principles (debugging, notifications, professional guidance):**
→ `/Users/martijn/Documents/Projects/CLAUDE.md`

**Platform infrastructure (nginx, SSL, deployment):**
→ `/Users/martijn/Documents/Projects/multi-tenant-platform/CLAUDE.md`

**This file:** PAISS specific configuration and deployment details only.

---

## ⚙️ PAISS CONFIGURATION

### Quick Reference
```bash
# Development
make dev                   # Start Vite dev server (http://localhost:8000)
make build-local           # Build project with Vite
make build                 # Build Docker image locally
make run                   # Run Docker container locally

# Deployment
make deploy-staging        # Deploy to staging (auto-deploy on push to main)
make deploy-production     # Deploy to production (requires manual approval)
make status                # Check deployment status

# URLs
# Local:      http://localhost:8000 (Vite dev server)
# Staging:    https://staging.paiss.me
# Production: https://paiss.me

# NEVER use manual server commands - always use Makefile
# NOTE: Vite has hot-reloading (HMR) - no restart needed for code changes
# IMPORTANT: make dev is usually already running in a separate terminal
#            Do NOT run make dev unless explicitly requested by user
```

---

## 🏗️ PROJECT STRUCTURE

```
paiss/
├── index.html              # Main landing page
├── styles.css              # Styling
├── script.js               # JavaScript animations
├── vite.config.js          # Vite configuration
├── package.json            # Node dependencies
├── Dockerfile              # Container configuration (multi-stage build)
├── nginx.conf              # Nginx server config (in container)
├── docker-compose.yml      # Deployment orchestration
├── .env.production         # Production environment
├── .env.staging            # Staging environment
├── Makefile                # Development commands
├── CLAUDE.md               # This file
└── README.md               # Public documentation
```

---

## 🚢 INFRASTRUCTURE

### Local Development
- **Server:** Vite dev server on `localhost:8002`
- **Build Tool:** Vite (Hot Module Replacement, fast refresh)
- **Files:** HTML/CSS/JS with ES modules

### Production Stack
- **Build:** Multi-stage Docker build (Node + Vite → Nginx)
- **Container:** Nginx (Alpine Linux) serving optimized static assets
- **Port:** 80 (internal), mapped via platform nginx
- **Domain:** https://paiss.me
- **Staging:** https://staging.paiss.me
- **Platform:** Multi-tenant platform on EC2

### Multi-Tenant Platform Architecture
**CRITICAL:** paiss is deployed via the [multi-tenant-platform](../multi-tenant-platform) system.

**Repository Structure:**
```
~/Documents/Projects/
├── paiss/                        # This repository (application code + deployment)
│   ├── index.html                # Website content
│   ├── styles.css                # Styling
│   ├── Dockerfile                # Container image
│   ├── deploy.sh                 # SSM deployment script
│   ├── .env.ec2                  # EC2 instance ID (gitignored)
│   └── CLAUDE.md                 # This file
└── multi-tenant-platform/        # Platform repository (shared infrastructure)
    └── platform/nginx/sites/     # Nginx configuration
        └── paiss.conf            # paiss routing config
```

**How Deployment Works:**
1. **Code Changes** → Pushed to `paiss` GitHub repo (for backup/version control)
2. **Deploy Command** → `make deploy-staging` or `make deploy-production` (from local machine)
3. **SSM Execution** → Connects to EC2, pulls code, builds Docker image, starts container
4. **No Registry** → Builds fresh on server every time (2-5 min)

**Container Networking:**
- Joins the `platform` Docker network (external)
- Platform nginx proxies traffic to `paiss-production:80` or `paiss-staging:80`
- No health check needed for static site

**Environment Variables:**
- EC2 instance ID in `.env.ec2` (local only, gitignored)
- No sensitive data in paiss repository

**Key Files:**
- Website content: `index.html`, `styles.css`, `script.js`
- Deployment: `deploy.sh`, `Makefile`
- Platform nginx: `../multi-tenant-platform/platform/nginx/sites/paiss.conf`

---

## 🎨 BRANDING

**PAISS** = **P**ragmatic **A**I **S**oftware **S**olutions

- **Primary Color:** Blue (#2563eb)
- **Secondary Color:** Purple (#8b5cf6)
- **Accent Color:** Cyan (#06b6d4)
- **Font:** Inter

---

## 📊 MONITORING

View application metrics at: https://monitoring.paiss.me

**Alerts configured:**
- Production down (1m duration) - Critical
- High error rate (5m, >5% errors) - Warning

---

## 🚀 DEPLOYMENT WORKFLOW

### Prerequisites
1. **EC2 Instance**: Amazon Linux 2023 in eu-north-1
2. **AWS CLI**: Configured with SSM permissions
3. **Instance ID**: Set in `.env.ec2` (copy from `.env.ec2.example`)

### Deployment Process
```bash
# 1. Make changes to HTML/CSS/JS
# 2. Test locally with Vite dev server
make dev  # Visit http://localhost:8002 (HMR enabled)

# 3. Commit changes
git add .
git commit -m "Update landing page"
git push origin main  # Optional: backup to GitHub

# 4. Deploy to staging via SSM (builds on server)
make deploy-staging  # Deploys to https://staging.paiss.me

# 5. Test staging
curl https://staging.paiss.me

# 6. Deploy to production via SSM (builds on server)
make deploy-production  # Deploys to https://paiss.me
```

### How It Works
1. **Deploy Command** → `make deploy-staging` or `make deploy-production`
2. **SSM Connection** → Connects to EC2 via AWS Systems Manager (no SSH)
3. **Git Pull** → Pulls latest code from GitHub
4. **Build** → Builds Docker image on server from Dockerfile
5. **Deploy** → Starts container with appropriate name (staging/production)
6. **Done** → Site updated in 2-5 minutes

**No GitHub Actions** - Deployment happens directly from your machine via SSM
**No Registry** - Builds fresh on server every time

---

**Generated:** 2025-10-09
**Platform:** https://github.com/duersjefen/multi-tenant-platform
