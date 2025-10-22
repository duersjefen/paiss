# =============================================================================
# PAISS - Pragmatic AI Software Solutions - Makefile
# =============================================================================
# Simple static site development and deployment workflow
# =============================================================================

.PHONY: help dev build stop deploy deploy-staging deploy-production status clean

.DEFAULT_GOAL := help

##
## 🚀 Development Commands
##

dev: ## Start local development server
	@echo "🚀 Starting Vite development server..."
	@echo "📍 http://localhost:8002"
	@echo ""
	@echo "💡 Press Ctrl+C to stop"
	@npm run dev

build-local: ## Build project locally with Vite
	@echo "⚡ Building project with Vite..."
	@npm run build
	@echo "✅ Build complete: dist/"

build: ## Build Docker image locally
	@echo "🐳 Building Docker image..."
	@docker build -t paiss:local .
	@echo "✅ Image built: paiss:local"
	@echo ""
	@echo "💡 Run locally with:"
	@echo "   docker run -p 8080:80 paiss:local"

run: ## Run Docker container locally
	@echo "🐳 Running Docker container..."
	@echo "📍 http://localhost:8080"
	@echo ""
	@docker run --rm -p 8080:80 --name paiss-local paiss:local

stop: ## Stop development server
	@echo "🛑 Stopping services..."
	@-lsof -ti:8002 | xargs kill -9 2>/dev/null || true
	@echo "✅ All services stopped"

##
## 🚀 Deployment Commands (SST)
##

deploy-staging: ## Deploy to staging via SST (S3 + CloudFront + Lambda)
	@echo "🚀 Deploying to staging with SST..."
	@echo ""
	@echo "📦 Building frontend..."
	@npm run build
	@echo ""
	@echo "☁️  Deploying to AWS (S3 + CloudFront + Lambda)..."
	@npm run sst:deploy -- --stage staging
	@echo ""
	@echo "✅ Staging deployment complete!"
	@echo "🌐 https://staging.paiss.me"

deploy-production: ## Deploy to production via SST (S3 + CloudFront + Lambda)
	@echo "🚀 Deploying to production with SST..."
	@echo ""
	@echo "🧪 Running pre-deployment checks..."
	@npm run build
	@echo ""
	@echo "📤 Pushing to GitHub..."
	@git push origin main || (echo "⚠️  Push failed, but continuing deployment..." && sleep 2)
	@echo ""
	@echo "☁️  Deploying to AWS (S3 + CloudFront + Lambda)..."
	@npm run sst:deploy -- --stage production
	@echo ""
	@echo "✅ Production deployment complete!"
	@echo "🌐 https://paiss.me"

status: ## Check SST deployment status
	@echo "📊 SST Resources:"
	@echo ""
	@echo "Staging:    https://staging.paiss.me"
	@echo "Production: https://paiss.me"
	@echo ""
	@echo "💡 Check AWS Console for CloudFront/Lambda/S3 details"

##
## 🛠️ Utility Commands
##

clean: ## Clean build artifacts
	@echo "🧹 Cleaning up..."
	@rm -rf dist node_modules .sst
	@echo "✅ Cleanup complete"

##
## 📚 Help
##

help: ## Show this help message
	@echo ""
	@echo "🌐 PAISS - Pragmatic AI Software Solutions"
	@echo "═══════════════════════════════════════════"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "📖 Quick start: make dev"
	@echo "📖 Full docs: cat README.md"
	@echo ""
