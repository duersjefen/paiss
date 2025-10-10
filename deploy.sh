#!/bin/bash
set -e

ENVIRONMENT="${1:-staging}"
REGION="eu-north-1"

# Load EC2 instance ID from shared platform config
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/../.env.ec2" ]; then
    source "$SCRIPT_DIR/../.env.ec2"
fi

INSTANCE_ID="${EC2_INSTANCE_ID}"

# Validation
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "❌ Invalid environment. Use: staging or production"
    echo "   Usage: ./deploy.sh [staging|production]"
    exit 1
fi

if [ -z "$INSTANCE_ID" ]; then
    echo "❌ EC2_INSTANCE_ID not set"
    echo "   Create .env.ec2 with: EC2_INSTANCE_ID=i-xxxxxxxxxxxxx"
    exit 1
fi

echo "🚀 Deploying paiss to $ENVIRONMENT"
echo "Instance: $INSTANCE_ID"
echo "Region: $REGION"
echo ""

# Deploy via SSM with compose project isolation
aws ssm send-command \
    --region "$REGION" \
    --instance-ids "$INSTANCE_ID" \
    --document-name "AWS-RunShellScript" \
    --comment "Deploy paiss $ENVIRONMENT" \
    --parameters "commands=[
        'set -e',
        'PROJECT_NAME=paiss-$ENVIRONMENT',
        'echo \"🚀 Deploying paiss to $ENVIRONMENT\"',
        'echo \"Project: \$PROJECT_NAME\"',
        'cd /opt/apps/paiss || exit 1',
        'if [ ! -d .git ]; then',
        '  cd /opt/apps',
        '  git clone https://github.com/duersjefen/paiss.git',
        '  cd paiss',
        'fi',
        'git fetch origin',
        'git reset --hard origin/main',
        'export DOCKER_BUILDKIT=1',
        'docker-compose -p \$PROJECT_NAME up -d --build',
        'echo \"✅ $ENVIRONMENT is live!\"'
    ]" \
    --output text

echo ""
echo "✅ Deployment command sent!"
echo "⏳ Waiting for deployment to complete (60s)..."
sleep 60

# Health check
echo "🔍 Checking health..."
if [ "$ENVIRONMENT" = "production" ]; then
    HEALTH_URL="https://paiss.me"
else
    HEALTH_URL="https://staging.paiss.me"
fi

if curl -f -s "$HEALTH_URL" > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
    echo ""
    if [ "$ENVIRONMENT" = "production" ]; then
        echo "🌐 https://paiss.me"
    else
        echo "🌐 https://staging.paiss.me"
    fi
else
    echo "❌ Health check failed"
    echo "🔍 Debug with: make logs-$ENVIRONMENT"
    exit 1
fi
echo ""
