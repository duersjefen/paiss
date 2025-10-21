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
## 🚀 Deployment Commands (SSM-Based)
##

deploy-staging: ## Deploy to staging via SSM (builds on server)
	@$(MAKE) deploy ENV=staging

deploy-production: ## Deploy to production via SSM (builds on server)
	@$(MAKE) deploy ENV=production

deploy: ## Internal: Test, push, then deploy (use SKIP_TESTS=1 or SKIP_PUSH=1 to skip)
ifndef SKIP_TESTS
	@echo "🧪 Running pre-deployment checks..."
	@echo ""
	@echo "1️⃣  Testing frontend build (catches build errors)..."
	@$(MAKE) build-local
	@echo ""
	@echo "✅ All pre-deployment checks passed!"
	@echo ""
endif
ifndef SKIP_PUSH
	@echo "📤 Pushing to GitHub..."
	@git push origin main || (echo "❌ Push failed. Use SKIP_PUSH=1 to deploy without pushing." && exit 1)
	@echo ""
endif
	@./deploy.sh $(ENV)

status: ## Check deployment status
	@echo "📊 Recent deployments:"
	@gh run list --limit 5 2>/dev/null || \
		echo "💡 Check manually: https://github.com/duersjefen/paiss/actions"

##
## 🛠️ Utility Commands
##

clean: ## Clean build artifacts
	@echo "🧹 Cleaning up..."
	@rm -rf dist node_modules
	@docker rmi paiss:local 2>/dev/null || true
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
