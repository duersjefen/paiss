# =============================================================================
# PAISS - Pragmatic AI Software Solutions - Makefile
# =============================================================================
# Simple static site development and deployment workflow
# =============================================================================

.PHONY: help dev dev-sst build stop deploy deploy-staging deploy-production remove-dev status clean

.DEFAULT_GOAL := help

##
## 🚀 Development Commands
##

dev: ## Start local development server (Vite only, no AWS)
	@echo "🚀 Starting Vite development server..."
	@echo "📍 Will use next available port (typically 8002 or 5173)"
	@echo ""
	@echo "💡 Multiple instances can run simultaneously on different ports"
	@echo "💡 Press Ctrl+C to stop"
	@npm run dev

dev-sst: ## Start SST dev mode (AWS resources + Vite)
	@echo "🚀 Starting SST dev mode (AWS resources + Vite)..."
	@echo "⚙️  Stage: dev"
	@echo "☁️  AWS resources will be created/updated"
	@echo ""
	@echo "💡 This creates isolated dev infrastructure in AWS"
	@echo "💡 Press Ctrl+C to stop"
	@npm run sst:dev

build: ## Build project locally with Vite
	@echo "⚡ Building project with Vite..."
	@npm run build
	@echo "✅ Build complete: dist/"

preview: ## Preview built site locally
	@echo "👀 Starting preview server..."
	@npm run preview

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

remove-dev: ## Remove dev stage AWS resources
	@echo "🗑️  Removing dev stage resources..."
	@echo "⚠️  This will delete all dev infrastructure in AWS"
	@echo ""
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		npm run sst:remove -- --stage dev; \
		echo "✅ Dev stage resources removed"; \
	else \
		echo "❌ Cancelled"; \
	fi

status: ## Check SST deployment status
	@echo "📊 SST Resources:"
	@echo ""
	@echo "Dev:        CloudFront URL (use 'make dev-sst' to see)"
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
