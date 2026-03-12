#!/bin/bash

# QUICK PUSH TO GITHUB SCRIPT
# Update the USERNAME and REPO_NAME variables below, then run: chmod +x push_to_github.sh && ./push_to_github.sh

USERNAME="your-github-username"
REPO_NAME="autonomous-vehicle-rl-training"
BRANCH="main"

echo "🚀 Pushing to GitHub..."
echo ""

# Rename master to main if needed
if [ "$(git branch | grep \* | cut -d ' ' -f2)" = "master" ]; then
    echo "📌 Renaming branch from master to main..."
    git branch -M main
fi

# Add remote
echo "🔗 Adding remote origin..."
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git 2>/dev/null || \
git remote set-url origin https://github.com/$USERNAME/$REPO_NAME.git

# Verify remote
echo "✅ Remote configuration:"
git remote -v

echo ""
echo "📤 Pushing to GitHub..."
git push -u origin $BRANCH

echo ""
echo "✅ SUCCESS! Your repository is now on GitHub!"
echo ""
echo "View your repository at:"
echo "  https://github.com/$USERNAME/$REPO_NAME"
