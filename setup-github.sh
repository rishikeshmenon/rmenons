#!/bin/bash

# Smart Home Platform - GitHub Setup Script
echo "🚀 Setting up GitHub repository for Smart Home Platform..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Get repository name from user
echo ""
echo "📝 GitHub Repository Setup"
echo "=========================="
echo ""
echo "Please create a new repository on GitHub first:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: smart-home-platform (or your preferred name)"
echo "3. Description: AI-powered smart home consultancy platform"
echo "4. Make it Public (or Private if you prefer)"
echo "5. Don't initialize with README (we already have one)"
echo "6. Click 'Create repository'"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

# Get repository name
read -p "Enter your repository name (default: smart-home-platform): " REPO_NAME
REPO_NAME=${REPO_NAME:-smart-home-platform}

echo ""
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

echo "📤 Pushing code to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Success! Your code has been pushed to GitHub."
echo ""
echo "🌐 Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "🚀 Next steps for Vercel deployment:"
echo "1. Go to https://vercel.com"
echo "2. Click 'New Project'"
echo "3. Import from GitHub: $REPO_NAME"
echo "4. Follow the deployment guide in DEPLOYMENT_GUIDE.md"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
