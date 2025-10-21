# PAISS - Pragmatic AI Software Solutions

> Company website and landing page

## 🌐 Live Site

- **Production**: https://paiss.me

## 🏗️ Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla)
- **Server**: Nginx (Alpine Linux)
- **Deployment**: Docker + Multi-tenant Platform
- **CI/CD**: GitHub Actions
- **Hosting**: AWS EC2

## 🚀 Development

```bash
# Start Vite dev server (recommended)
make dev

# Or build locally
make build-local
```

Visit: http://localhost:8002

## 📦 Docker

```bash
# Build image
docker build -t paiss .

# Run locally
docker run -p 8080:80 paiss
```

## 🔄 Deployment

Automatic deployment via GitHub Actions:

1. **Push to main** → GitHub Actions builds Docker image
2. **On EC2**: `./lib/deploy.sh paiss production`
3. **Zero-downtime deployment** with blue-green strategy

## 📊 Monitoring

View application metrics at: https://monitoring.paiss.me

## 🎨 Branding

**PAISS** = **P**ragmatic **A**I **S**oftware **S**olutions

- **Primary Color**: Blue (#2563eb)
- **Secondary Color**: Purple (#8b5cf6)
- **Accent Color**: Cyan (#06b6d4)
- **Font**: Inter

## 📝 License

© 2025 PAISS. All rights reserved.
