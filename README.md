# PAISS - Pragmatic AI Software Solutions

> Company website and landing page

## 🌐 Live Sites

- **Production**: https://paiss.me
- **Staging**: https://staging.paiss.me
- **Dev**: CloudFront URL (temporary, created via `make dev-sst`)

## 🏗️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite
- **Infrastructure**: SST v3 (AWS CDK)
- **Hosting**: S3 + CloudFront (CDN)
- **Backend**: API Gateway + Lambda
- **Email**: AWS SES
- **DNS**: Route53
- **Region**: eu-north-1

## 🚀 Development

### Quick Start

```bash
# Local development (Vite only, no AWS)
make dev

# SST dev mode (with AWS resources)
make dev-sst

# Build locally
make build

# Preview production build
make preview
```

### Environment Stages

**Dev** (Local Development)
- Uses `--stage dev` for isolated AWS resources
- No custom domain (uses CloudFront URL)
- Multiple instances can run on different ports (auto-detected)
- Run `make dev-sst` to start with AWS integration
- Clean up: `make remove-dev`

**Staging**
- Custom domain: https://staging.paiss.me
- Deploy: `make deploy-staging`
- Used for testing before production

**Production**
- Custom domain: https://paiss.me
- Deploy: `make deploy-production`
- Retention policy: AWS resources retained on `sst remove`

### Port Handling

Vite automatically detects port conflicts and prompts for the next available port:
- Default: 8002
- Fallback: 5173, 5174, etc.
- Multiple dev instances can run simultaneously

## 🔄 Deployment

SST-based serverless deployment:

```bash
# Deploy to staging
make deploy-staging

# Deploy to production
make deploy-production

# Check status
make status
```

### How It Works

1. **Build** → Vite compiles to `dist/`
2. **Deploy** → SST updates AWS infrastructure:
   - S3 bucket for static files
   - CloudFront distribution (CDN)
   - Lambda function (contact form)
   - API Gateway endpoint
   - Route53 DNS (staging/production only)
3. **Propagation** → 2-5 minutes for CloudFront/DNS

## 🎨 Branding

**PAISS** = **P**ragmatic **A**I **S**oftware **S**olutions

- **Primary Color**: Blue (#2563eb)
- **Secondary Color**: Purple (#8b5cf6)
- **Accent Color**: Cyan (#06b6d4)
- **Font**: Inter

## 📝 License

© 2025 PAISS. All rights reserved.
