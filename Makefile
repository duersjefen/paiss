# =============================================================================
# PAISS - Pragmatic AI Software Solutions - Makefile
# =============================================================================
# Simple static site development and deployment workflow
# =============================================================================

.PHONY: help dev build deploy-staging deploy-production status clean

.DEFAULT_GOAL := help

##
## 🚀 Development Commands
##

dev: ## Start local development server
	@echo "🚀 Starting local development server..."
	@echo "📍 http://localhost:8002"
	@echo ""
	@echo "💡 Press Ctrl+C to stop"
	@python3 -m http.server 8002

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

##
## 🚀 Deployment Commands (Platform-Driven)
##

deploy-staging: ## Deploy to staging (triggers continuous deployment pipeline)
	@echo "🎭 Continuous Deployment Pipeline Starting..."
	@echo ""
	@echo "📋 Checking git status..."
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo "⚠️  You have uncommitted changes. Commit first:"; \
		echo "   git add . && git commit -m 'Your message'"; \
		exit 1; \
	fi
	@echo "📤 Pushing to main (triggers continuous deployment)..."
	@git push origin main
	@echo ""
	@echo "🔄 Continuous Deployment Pipeline:"
	@echo "  1. Build Docker image (paiss repo) ⏳"
	@echo "  2. Notify platform repo ⏳"
	@echo "  3. Deploy to staging ⏳"
	@echo "  4. Auto-queue production ⏸️  (requires approval)"
	@echo ""
	@echo "👀 Monitor build:  https://github.com/duersjefen/paiss/actions"
	@echo "👀 Monitor deploy: https://github.com/duersjefen/multi-tenant-platform/actions"
	@echo ""
	@echo "🔍 Test staging: https://staging.paiss.me"
	@echo ""
	@echo "✅ When staging looks good, approve production:"
	@echo "   cd ../multi-tenant-platform"
	@echo "   make approve-production project=paiss"

deploy-production: ## Approve pending production deployment
	@echo "🚀 Production Deployment Approval"
	@echo ""
	@echo "ℹ️  Production auto-queues after staging succeeds"
	@echo ""
	@echo "📖 To approve production deployment:"
	@echo "  1. Test staging: https://staging.paiss.me"
	@echo "  2. Approve deployment:"
	@echo "     cd ../multi-tenant-platform"
	@echo "     make approve-production project=paiss"
	@echo ""
	@echo "Or approve via GitHub UI:"
	@echo "  https://github.com/duersjefen/multi-tenant-platform/actions"
	@echo "  → Click 'Review deployments' → Approve 'production'"
	@echo ""
	@exit 1

status: ## Check deployment status
	@echo "📊 Recent deployments:"
	@gh run list --limit 5 2>/dev/null || \
		echo "💡 Check manually: https://github.com/duersjefen/paiss/actions"

##
## 🛠️ Utility Commands
##

clean: ## Clean build artifacts
	@echo "🧹 Cleaning up..."
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
