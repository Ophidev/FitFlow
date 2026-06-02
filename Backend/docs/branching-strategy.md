# 🌿 FitFlow – Git Branching Strategy

This document defines the **branching workflow** for the FitFlow project.
The goal is to keep the codebase **stable, scalable, and easy to maintain** while enabling structured feature development.

---

## 🎯 Objectives

* Keep the `main` branch **always stable and runnable**
* Isolate features to avoid breaking changes
* Enable clean history and easy rollbacks
* Support future team collaboration
* Maintain a professional development workflow

---

## 🔑 Core Branches

### 🟢 `main`

* Represents **production-ready** code
* Always stable and tested
* All completed features are merged here
* **Direct commits to `main` are not allowed**

```text
main  → stable, deployable code
```

---

## 🌱 Feature Branches

All development work happens in **feature branches** created from `main`.

### 📛 Naming Convention

```text
feature/<feature-name>
feat/<feature-name>
```

### ✅ Examples

* `feat/auth`
* `feat/profile`
* `feat/workout-day`
* `feat/exercise`
* `feat/workout-execution`
* `feat/history`
* `feat/analytics` (future)
* `feat/ai-suggestions` (future)

---

## 📌 Branch Scope Rules

✔ One feature branch represents **one business module or router**
✔ A branch may contain **multiple related APIs**
✔ Multiple commits are encouraged inside a branch
✔ Merge only when the feature is complete and tested

❌ Do NOT create a branch for every single API
❌ Do NOT mix unrelated features in one branch
❌ Do NOT leave half-finished code in `main`

---

## 🔄 Development Workflow

### Standard Flow

```text
main
  ↓
feature/<name>
  ↓
development + commits
  ↓
merge into main
  ↓
delete feature branch
```

---

### 🧪 Step-by-Step Example

```bash
# Ensure main is up to date
git checkout main
git pull

# Create feature branch
git checkout -b feature/workout-day

# Work on feature
git commit -m "Add workout day CRUD APIs"
git commit -m "Add workout day validation and error handling"

# Merge back to main
git checkout main
git merge feature/workout-day

# Cleanup
git branch -d feature/workout-day
```

---

## 🧠 Commit Guidelines (Recommended)

Use **clear, meaningful commit messages**:

```text
feat: add workout day CRUD APIs
fix: handle invalid workout day ID
refactor: restructure exercise model
```

This keeps Git history readable and professional.

---

## 🔥 Handling Large Features

For large features (e.g. **Workout Execution**):

✔ Use **one branch**
✔ Break work into **multiple commits**

```text
feature/workout-execution
 ├── start workout session
 ├── mark set complete
 ├── complete workout
```

---

## 🚑 Hotfixes (Optional – Future)

For critical bugs in `main`:

```text
hotfix/<issue-name>
```

Example:

* `hotfix/login-token-expiry`

Flow:

```text
hotfix → main → delete
```

---

## 🚀 Future Team Scaling (Optional)

If FitFlow becomes a team project:

* Introduce a `develop` branch
* Enforce Pull Requests
* Require code reviews before merging
* Protect `main` branch

```text
feature/* → develop → main
```

---

## 🏁 Summary

* `main` is always stable
* All work happens in `feature/*` branches
* One branch = one feature or router
* Merge frequently, delete after merge
* Simple, scalable, professional workflow

---

**FitFlow Git Strategy = Clean code, clean history, clean growth 💪**

---


