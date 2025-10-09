# CLAUDE.md - PAISS Project Instructions

Static company website deployed via multi-tenant platform.

---

## 🎯 CORE PROJECT PRINCIPLES

### Development Workflow
1. **Edit HTML/CSS** → Test locally with `make dev`
2. **Commit changes** → `git add . && git commit -m "message"`
3. **Deploy** → `make deploy-staging` (auto) or `make deploy-production` (manual approval)

### Quick Reference
```bash
# Development
make dev                   # Start local server (http://localhost:8002)
make build                 # Build Docker image locally
make run                   # Run Docker container locally

# Deployment
make deploy-staging        # Deploy to staging (auto-deploy on push to main)
make deploy-production     # Deploy to production (requires manual approval)
make status                # Check deployment status

# URLs
# Local:      http://localhost:8002 (dev server)
# Staging:    https://staging.paiss.me
# Production: https://paiss.me
```

---

## 🏗️ PROJECT STRUCTURE

```
paiss/
├── index.html              # Main landing page
├── styles.css              # Styling
├── Dockerfile              # Container configuration
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
- **Server:** Python's http.server on `localhost:8002`
- **Files:** Static HTML/CSS (no build step needed)

### Production Stack
- **Container:** Nginx (Alpine Linux)
- **Port:** 80 (internal), mapped via platform nginx
- **Domain:** https://paiss.me
- **Staging:** https://staging.paiss.me
- **Platform:** Multi-tenant platform on EC2

### Multi-Tenant Platform Architecture
**CRITICAL:** paiss is deployed via the [multi-tenant-platform](../multi-tenant-platform) system.

**Repository Structure:**
```
~/Documents/Projects/
├── paiss/                        # This repository (application code)
│   ├── index.html                # Website content
│   ├── styles.css                # Styling
│   ├── Dockerfile                # Container image
│   ├── docker-compose.yml        # Local deployment config
│   └── CLAUDE.md                 # This file
└── multi-tenant-platform/        # Platform repository (deployment configs)
    └── configs/paiss/            # paiss deployment configuration
        ├── docker-compose.yml    # Container orchestration
        ├── .env.staging          # Staging environment variables
        └── .env.production       # Production environment variables
```

**How Deployment Works:**
1. **Code Changes** → Pushed to `paiss` GitHub repo
2. **GitHub Actions** → Builds Docker images and pushes to ghcr.io
3. **Deployment Script** → Pulls configs from `multi-tenant-platform` repo
4. **Docker Compose** → Orchestrates container deployment on EC2

**Container Networking:**
- Joins the `platform` Docker network
- Platform nginx proxies traffic to `paiss-web:80` container
- Health check endpoint: `/health`

**Environment Variables:**
- Configured via `.env.{environment}` files in platform repo
- Includes `IMAGE` and `CONTAINER_NAME`

**Key Files to Update:**
- Website content: `paiss` repository (`index.html`, `styles.css`)
- Deployment config: `multi-tenant-platform/configs/paiss/`
- Never commit environment secrets to `paiss` repo

---

## 🎨 BRANDING

**PAISS** = **P**ragmatic **A**I **S**oftware **S**olutions

- **Primary Color:** Blue (#2563eb)
- **Secondary Color:** Purple (#8b5cf6)
- **Accent Color:** Cyan (#06b6d4)
- **Font:** Inter

---

## 📋 DEVELOPMENT RULES

**✅ ALWAYS:**
- Use Makefile commands (`make dev`, not manual python commands)
- Test locally before deploying
- Keep HTML semantic and accessible
- Ensure mobile-responsive design
- Maintain brand consistency

**❌ NEVER:**
- Commit `.env` files with secrets
- Use inline styles (use `styles.css`)
- Break mobile responsiveness
- Remove accessibility features

---

## 🔧 CRITICAL BEHAVIORS

### User Notification System
**Notify user when Claude finishes or needs input:**
```bash
~/bin/claude-notify "message" "type"
```

**Types:** `success`, `task_complete`, `milestone`, `error`, `question`, `approval_needed`

**When to notify:**
- ✅ All tasks complete - nothing left to do
- ✅ Waiting for input - need decision/approval/clarification
- ✅ Blocked/error - can't proceed without help
- ❌ Don't notify on routine mid-task updates

### Professional Guidance
**Must challenge:** Security issues, accessibility problems, poor UX
**Template:** *"This approach will cause [problems] because [reasons]. Instead, [better solution] which [benefits]."*

---

## 📊 MONITORING

View application metrics at: https://monitoring.paiss.me

**Alerts configured:**
- Production down (1m duration) - Critical
- High error rate (5m, >5% errors) - Warning

---

## 🚀 DEPLOYMENT WORKFLOW

### Staging Deployment (Automatic)
```bash
# 1. Make changes to HTML/CSS
# 2. Test locally
make dev  # Visit http://localhost:8002

# 3. Commit and push to trigger deployment
git add .
git commit -m "Update landing page"
make deploy-staging

# 4. Test staging site
# Visit: https://staging.paiss.me
```

### Production Deployment (Manual Approval)
```bash
# After staging is validated:
cd ../multi-tenant-platform
make approve-production project=paiss

# Or approve via GitHub UI:
# https://github.com/duersjefen/multi-tenant-platform/actions
```

---

**Generated:** 2025-10-09
**Platform:** https://github.com/duersjefen/multi-tenant-platform
