# CLAUDE.md - PAISS Project Instructions

Static company website deployed via multi-tenant platform.

---

## 🎯 CORE PROJECT PRINCIPLES

### Development Workflow
1. **Edit HTML/CSS/JS** → Test locally with `make dev` (Vite dev server)
2. **Commit changes** → `git add . && git commit -m "message"`
3. **Push to GitHub** → `git push origin main` (triggers Docker image build)
4. **Deploy** → `make deploy-staging` or `make deploy-production` (SSM deployment)

### Quick Reference
```bash
# Development
make dev                   # Start Vite dev server (http://localhost:8002)
make build-local           # Build project with Vite
make build                 # Build Docker image locally
make run                   # Run Docker container locally

# Deployment
make deploy-staging        # Deploy to staging (auto-deploy on push to main)
make deploy-production     # Deploy to production (requires manual approval)
make status                # Check deployment status

# URLs
# Local:      http://localhost:8002 (Vite dev server)
# Staging:    https://staging.paiss.me
# Production: https://paiss.me
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
1. **Code Changes** → Pushed to `paiss` GitHub repo
2. **GitHub Actions** → Builds Docker image and pushes to ghcr.io (automatic)
3. **Deploy Command** → `make deploy-staging` or `make deploy-production` (manual)
4. **SSM Execution** → Connects to EC2, pulls image, restarts container

**Container Networking:**
- Joins the `platform` Docker network (external)
- Platform nginx proxies traffic to `paiss-web:80` (production) or `paiss-web-staging:80` (staging)
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

## 📋 DEVELOPMENT RULES

**✅ ALWAYS:**
- Use Makefile commands (`make dev`, not manual npm/vite commands)
- Test locally before deploying (Vite dev server with HMR)
- Keep HTML semantic and accessible
- Ensure mobile-responsive design
- Maintain brand consistency
- Use ES modules for JavaScript

**❌ NEVER:**
- Commit `node_modules/` or `dist/` directories
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

### Prerequisites
1. **EC2 Instance**: Amazon Linux 2023 in eu-north-1
2. **AWS CLI**: Configured with SSM permissions
3. **Instance ID**: Set in `.env.ec2` (copy from `.env.ec2.example`)

### Deployment Process
```bash
# 1. Make changes to HTML/CSS/JS
# 2. Test locally with Vite dev server
make dev  # Visit http://localhost:8002 (HMR enabled)

# 3. Commit and push to trigger Docker image build
git add .
git commit -m "Update landing page"
git push origin main  # GitHub Actions builds Docker image

# 4. Deploy to staging via SSM
make deploy-staging  # Deploys to https://staging.paiss.me

# 5. Test staging
curl https://staging.paiss.me

# 6. Deploy to production via SSM
make deploy-production  # Deploys to https://paiss.me
```

### How It Works
1. **Push to GitHub** → Triggers `build-and-push.yml` workflow
2. **GitHub Actions** → Builds Docker image and pushes to ghcr.io
3. **Deploy Command** → Uses AWS SSM to deploy to EC2
4. **SSM Executes** → Pulls image, stops old container, starts new container

---

**Generated:** 2025-10-09
**Platform:** https://github.com/duersjefen/multi-tenant-platform
