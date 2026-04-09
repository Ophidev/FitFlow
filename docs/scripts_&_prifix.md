# 📦 FitFlow Notes: npm, package.json, Scripts & Prefix

---

## 🧠 1. Core Concepts

### 🔹 Node.js vs npm

| Tool    | Role                                              |
| ------- | ------------------------------------------------- |
| Node.js | Runtime (runs JavaScript)                         |
| npm     | Package manager (installs & manages dependencies) |

👉 **Important:**
Node.js does NOT create project files — **npm does**.

---

## 📦 2. package.json

### ✅ Definition

`package.json` is the **main configuration file of a project**.

### 📌 It contains:

* Project info (name, version)
* Dependencies (what your app needs)
* Scripts (custom commands)
* Configurations

### 🧠 Simple Meaning:

> “What my project needs + how to run it”

---

### 🧪 Created using:

```bash
npm init -y
```

---

## 🔒 3. package-lock.json

### ✅ Definition

`package-lock.json` stores the **exact version of all installed dependencies**.

### 📌 Includes:

* Direct dependencies
* Transitive dependencies (dependencies of dependencies)

---

### 🧠 Why important?

| Without lock file ❌                | With lock file ✅        |
| ---------------------------------- | ----------------------- |
| Different versions on each install | Same version everywhere |
| Bugs possible                      | Stable installs         |

---

### 🧪 Created using:

```bash
npm install
```

---

## 📁 4. node_modules

### ✅ Definition

Folder where all installed packages are stored.

### 🧪 Created using:

```bash
npm install
```

---

## ⚡ Flow Summary

```bash
npm init       → package.json
npm install    → node_modules + package-lock.json
```

---

# 🧠 5. Scripts in package.json

```json
"scripts": {
  "frontend": "npm run dev --prefix Frontend",
  "backend": "npm run dev --prefix Backend",
  "dev": "concurrently \"npm run frontend\" \"npm run backend\""
}
```

---

## 🔹 What is "scripts"?

👉 Custom commands you can run using:

```bash
npm run <script-name>
```

---

## 🟢 frontend Script

```bash
npm run dev --prefix Frontend
```

### 👉 Meaning:

* Go to `Frontend` folder
* Run `npm run dev`

### Equivalent to:

```bash
cd Frontend
npm run dev
```

---

## 🟢 backend Script

```bash
npm run dev --prefix Backend
```

### 👉 Meaning:

* Go to `Backend` folder
* Run dev server (nodemon)

---

## 🟢 dev Script (Main Controller)

```bash
concurrently "npm run frontend" "npm run backend"
```

---

## 🔥 What is concurrently?

👉 Runs multiple commands at the same time

---

### Without concurrently ❌

```bash
# Terminal 1
npm run frontend

# Terminal 2
npm run backend
```

---

### With concurrently ✅

```bash
npm run dev
```

👉 Runs both:

* Frontend 🚀
* Backend 🚀

---

## ⚠️ Why " is used?

### Problem:

JSON uses double quotes `" "` for strings

### ❌ Invalid:

```json
"dev": "concurrently "npm run frontend""
```

---

### ✅ Correct:

```json
"dev": "concurrently \"npm run frontend\""
```

---

## 🧠 What is `\`?

👉 `\` = Escape character

### Purpose:

> Treat special characters as normal text

---

### 🧪 Example

| You want | Write in JSON |
| -------- | ------------- |
| "hello"  | "hello"       |

---

### 🧠 Simple Meaning:

> `\` helps JSON understand that quotes are part of string, not syntax

---

# 🧭 6. --prefix Concept

### ✅ Definition:

`--prefix` tells npm:

> “Run this command inside a specific folder”

---

### 🧪 Example

```bash
npm run dev --prefix Frontend
```

👉 Equivalent to:

```bash
cd Frontend
npm run dev
```

---

## 🧠 Mental Model

* Root = 🧠 Controller
* Frontend = 🎨 UI app
* Backend = ⚙️ API app

👉 Root controls everything using `--prefix`

---

# 📦 7. Dependency Installation Rules

| Type                     | Where to install |
| ------------------------ | ---------------- |
| Frontend (React, axios)  | Frontend folder  |
| Backend (Express, DB)    | Backend folder   |
| Dev tools (concurrently) | Root             |

---

## 🧪 Commands

### Install in Frontend:

```bash
npm install axios --prefix Frontend
```

### Install in Backend:

```bash
npm install express --prefix Backend
```

### Install in Root:

```bash
npm install concurrently --save-dev
```

---

# 🔥 Final Summary

* npm manages project files (not Node.js)
* package.json = instructions
* package-lock.json = exact version snapshot
* node_modules = installed packages
* scripts = shortcuts for commands
* --prefix = run inside folder
* concurrently = run multiple commands together
* \ = escape character for JSON

---

