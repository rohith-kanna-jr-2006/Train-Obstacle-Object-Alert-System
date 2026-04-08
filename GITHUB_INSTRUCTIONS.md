<<<<<<< HEAD
First-time setup (linking a folder to GitHub).
Daily workflow (how to push new changes).
Collaborator tips (how to pull updates from others).
Comparison of your progress:
✅ Connected your local folder to GitHub.
✅ Synchronized your files using rebase.
✅ Uploaded your code to the main branch.
Is there anything else you need help with regarding your GitHub workflow?

markdown
# Git & GitHub Workflow Guide
Follow these steps to manage your project on GitHub.
## 1. Daily Workflow (Pushing Changes)
Run these commands whenever you have finished a task and want to upload it.
```powershell
# 1. Stage all changes
git add .
# 2. Check if everything is staged
git status
# 3. Create a commit (describe what you did)
git commit -m "Briefly explain what you changed"
# 4. Pull changes from others first (to prevent conflicts)
git pull origin main --rebase
# 5. Upload your work
git push origin main
2. Setting Up a New Local Folder
If you ever download the project again or help a teammate set up:

powershell
# Initialize git
git init
# Link to the repository
git remote add origin https://github.com/rohith-kanna-jr-2006/Train-Obstacle-Object-Alert-System.git
# Set branch name to main
git branch -M main
# Download the code
git pull origin main
3. Important Tips
Always pull before you push: This prevents "merge conflicts" by making sure you have your team's latest work before you add yours.
Meaningful Commits: Instead of just "updating files", use messages like "Added AI detection script" or "Fixed UI layout".
Collaborators: Since you are already a collaborator, you have full "Push" access!
---
**Summary of actions:**
*   Confirmed successful push of code to `https://github.com/rohith-kanna-jr-2006/Train-Obstacle-Object-Alert-System`.
*   Created a detailed `GITHUB_INSTRUCTIONS.md` file for the user's future reference.
=======
gendral instruction of the add the files to github:

add the all files: git add .
commit the changes: git commit -m "M1 added new update "  they give message with in "" customaizable. but i give these role i given format like "m1/m2/m3 added new update or fixed bug or added new feature or deleted old feature"
push the changes to github: git push origin main

To see others' changes locally, simply click the Sync icon or run:
{git pull} in your terminal.
>>>>>>> f98d2c015ef52234978fc3620740221314deaf4c
