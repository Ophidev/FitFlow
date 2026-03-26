# 🎨 FitFlow Frontend – Git Branching Strategy

This document defines a **simple and clean branching workflow** for the FitFlow frontend.

The goal is to keep development **easy to understand, organized, and scalable** without unnecessary complexity.

---

## 🎯 Objectives

* Keep `main` branch always stable
* Build features in isolation
* Maintain clean and readable history
* Align frontend with backend modules
* Keep workflow simple and practical

---

## 🔑 Core Branch

### 🟢 `main`

* Contains **stable and working UI**
* Fully connected with backend APIs
* Always runnable and clean

```text
main → stable frontend
```

❌ No direct commits

---

## 🌱 Branch Types

We will use only **4 simple branch types**:

### ✨ `feat/` → New Features

Used when adding new UI or functionality

```text
feat/frontend-auth
feat/frontend-dashboard
feat/frontend-workout
feat/frontend-planner
feat/frontend-schedule
feat/frontend-history
```

---

### 🐛 `fix/` → Bug Fixes

Used to fix issues in UI or functionality

```text
fix/frontend-auth-error
fix/frontend-routing-bug
```

---

### ♻️ `refactor/` → Code Improvements

Used to improve structure without changing behavior

```text
refactor/frontend-layout
refactor/frontend-redux
```

---

### 📄 `docs/` → Documentation

Used for README, notes, or project docs

```text
docs/frontend-readme
docs/frontend-structure
```

---

## 📛 Naming Convention

```text
type/frontend-<feature>
```

### ✅ Examples

```text
feat/frontend-auth
feat/frontend-dashboard
fix/frontend-auth-error
refactor/frontend-layout
docs/frontend-readme
```

---

## 📌 Branch Scope Rules

✔ One branch = one feature/module
✔ Multiple commits allowed inside a branch
✔ UI + API integration in same branch

❌ Don’t create branch per small component
❌ Don’t mix multiple features in one branch
❌ Don’t push incomplete work to `main`

---

## 🔄 Development Workflow

```text
main
  ↓
type/frontend-feature
  ↓
development
  ↓
testing
  ↓
merge into main
  ↓
delete branch
```

---

## 🧪 Example Workflow

```bash
# Step 1: Update main
git checkout main
git pull

# Step 2: Create feature branch
git checkout -b feat/frontend-auth

# Step 3: Work on feature
git commit -m "feat: build login UI"
git commit -m "feat: build signup UI"
git commit -m "feat: integrate auth APIs"

# Step 4: Merge
git checkout main
git merge feat/frontend-auth

# Step 5: Cleanup
git branch -d feat/frontend-auth
```

---

## 🧠 Commit Guidelines

Keep commits simple and meaningful:

```text
feat: add login UI
feat: integrate signup API
fix: handle invalid credentials
refactor: improve layout structure
```

---

## 🔥 Frontend Rule (Important)

Frontend development should follow this flow:

```text
UI → API Integration → State Handling
```

### Example:

```text
feat/frontend-auth
 ├── create login/signup UI
 ├── connect backend APIs
 ├── handle errors and state
```

---

## 🏁 Summary

* `main` = stable frontend
* Use `feat/`, `fix/`, `refactor/`, `docs/` only
* One branch = one feature/module
* Keep naming consistent
* Keep workflow simple and clean

---

**FitFlow Frontend Strategy = Simple, Clean, Scalable 🎯**
