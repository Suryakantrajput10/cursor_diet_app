# GitHub Setup Instructions

Your code has been committed locally. Follow these steps to push to GitHub:

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `diet-todo-tracker` (or any name you prefer)
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/diet-todo-tracker.git

# Rename branch to main (if needed)
git branch -M main

# Push your code
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/diet-todo-tracker.git
git branch -M main
git push -u origin main
```

## Quick Command (Copy and Replace YOUR_USERNAME)

```bash
git remote add origin https://github.com/YOUR_USERNAME/diet-todo-tracker.git && git branch -M main && git push -u origin main
```

## Troubleshooting

- **Authentication required**: You may need to use a Personal Access Token instead of password
- **Branch name**: If GitHub uses `main` instead of `master`, the commands above handle this
- **Already have a remote**: If you get "remote origin already exists", use: `git remote set-url origin https://github.com/YOUR_USERNAME/diet-todo-tracker.git`
