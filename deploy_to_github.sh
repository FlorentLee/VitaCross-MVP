#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "[deploy] Initializing Git repository..."
if [ ! -d .git ]; then
    git init
    # Configure main as the default branch name
    git checkout -b main || git branch -M main
else
    echo "[deploy] Git repository already initialized."
    # Ensure branch name is main
    git branch -M main
fi

echo "[deploy] Staging all files..."
git add .

echo "[deploy] Committing files..."
# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    echo "[deploy] No changes to commit."
else
    git commit -m "feat: Initialize VitaCross MVP for Hugging Face deployment"
fi

echo "[deploy] Setting remote origin..."
# Check if remote origin already exists
if git remote | grep -q 'origin'; then
    echo "[deploy] Adjusting remote origin URL..."
    git remote set-url origin https://github.com/FlorentLee/VitaCross-MVP.git
else
    git remote add origin https://github.com/FlorentLee/VitaCross-MVP.git
fi

echo "[deploy] Pushing to main branch..."
git push -u origin main

echo "[deploy] Codebase successfully pushed to https://github.com/FlorentLee/VitaCross-MVP.git"
