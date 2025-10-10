#!/bin/bash
# =============================================================================
# PAISS - SSM Deployment Script
# =============================================================================
# Deploys paiss to EC2 via AWS Systems Manager (SSM)
# Usage: ./deploy.sh [staging|production]
# =============================================================================

set -e

ENVIRONMENT="${1:-staging}"
REGION="eu-north-1"

# Load EC2 instance ID from .env file
if [ -f ".env.ec2" ]; then
    source .env.ec2
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

echo "🚀 Deploying PAISS to $ENVIRONMENT"
echo "===================================="
echo "Instance: $INSTANCE_ID"
echo "Region: $REGION"
echo ""

# Determine container name based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    CONTAINER_NAME="paiss-web"
else
    CONTAINER_NAME="paiss-web-staging"
fi

# Determine image tag based on environment
IMAGE="ghcr.io/duersjefen/paiss:latest"

echo "📤 Sending deployment command via SSM..."
echo ""

# Deploy via SSM
aws ssm send-command \
    --region "$REGION" \
    --instance-ids "$INSTANCE_ID" \
    --document-name "AWS-RunShellScript" \
    --comment "Deploy paiss $ENVIRONMENT" \
    --parameters "commands=[
        'set -e',
        'echo \"🚀 Deploying paiss ($ENVIRONMENT)...\"',
        'cd /opt/apps/paiss',
        'if [ ! -d .git ]; then',
        '  echo \"📥 Cloning repository...\"',
        '  git clone https://github.com/duersjefen/paiss.git .',
        'fi',
        'echo \"📥 Pulling latest code...\"',
        'git pull origin main',
        'echo \"🔐 Authenticating with GitHub Container Registry...\"',
        'echo \$GITHUB_PAT | docker login ghcr.io -u duersjefen --password-stdin',
        'echo \"🐳 Pulling Docker image: $IMAGE\"',
        'docker pull $IMAGE',
        'echo \"🛑 Stopping old container (if exists)...\"',
        'docker stop $CONTAINER_NAME 2>/dev/null || true',
        'docker rm $CONTAINER_NAME 2>/dev/null || true',
        'echo \"🚀 Starting new container...\"',
        'docker run -d \\',
        '  --name $CONTAINER_NAME \\',
        '  --restart unless-stopped \\',
        '  --network platform \\',
        '  --label project=paiss \\',
        '  --label environment=$ENVIRONMENT \\',
        '  $IMAGE',
        'echo \"⏳ Waiting for container to start...\"',
        'sleep 5',
        'echo \"🔍 Checking container status...\"',
        'docker ps | grep $CONTAINER_NAME',
        'echo \"✅ Deployment complete!\"',
        'echo \"\"',
        'echo \"📋 Container Info:\"',
        'docker inspect $CONTAINER_NAME --format=\"{{.State.Status}}: {{.Name}} ({{.Config.Image}})\"'
    ]" \
    --output text

COMMAND_ID=$?

echo ""
echo "✅ Deployment command sent successfully!"
echo ""
echo "📋 Monitor deployment:"
echo "  aws ssm list-command-invocations --region $REGION --instance-id $INSTANCE_ID --details | head -50"
echo ""
echo "Or connect interactively:"
echo "  aws ssm start-session --target $INSTANCE_ID --region $REGION"
echo ""
echo "🔍 Test deployment:"
if [ "$ENVIRONMENT" = "production" ]; then
    echo "  curl https://paiss.me"
else
    echo "  curl https://staging.paiss.me"
fi
echo ""
