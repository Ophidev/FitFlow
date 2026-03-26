# 📁 FitFlow Frontend Folder Structure

## 🚀 Overview

This document defines the **scalable and maintainable folder structure** for the FitFlow frontend (React + Vite).

---

## 📂 Root Structure

```
FitFlow-Frontend/
│
├── public/               # Static assets (favicon, etc.)
│
├── src/
│   │
│   ├── assets/                 # Images, icons, SVGs
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx
│   │   └── UserCard.jsx
│   │
│   ├── pages/                  # Route-based pages (screens)
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Feed.jsx
│   │   ├── Connections.jsx
│   │   ├── PendingRequests.jsx
│   │   ├── Chat.jsx
│   │   └── About.jsx
│   │
│   ├── layouts/                # Layout wrappers
│   │   └── MainLayout.jsx
│   │
│   ├── router/                 # Routing configuration
│   │   ├── AppRouter.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── redux/                  # Redux Toolkit setup
│   │   ├── store.js
│   │   └── slices/
│   │       ├── userSlice.js
│   │       ├── feedSlice.js
│   │       ├── connectionSlice.js
│   │       └── requestSlice.js
│   │
│   ├── services/               # API handling (Axios / Fetch)
│   │   └── apiClient.js
│   │
│   ├── utils/                  # Helper functions & constants
│   │   ├── constants.js
│   │   └── helpers.js
│   │
│   ├── hooks/                  # Custom React hooks
│   │   └── useAuth.js
│   │
│   ├── styles/                 # Global styles
│   │   └── index.css
│   │
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point (Vite)
│
├── docs/                       # 📄 Project documentation
│   ├── FRONTEND_STRUCTURE.md 
│   ├── API_DOCS.md 
│   ├── REDUX_FLOW.md 
│   └── ROUTING.md
├── .env                        # Environment variables
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🧠 Folder Responsibilities

### 🔹 components/

Reusable UI building blocks (used across multiple pages)

Examples:

* Navbar
* Footer
* Cards
* Buttons

---

### 🔹 pages/

Full screens mapped to routes

Examples:

* Home
* Login
* Profile
* Feed

---

### 🔹 layouts/

Defines page structure

Example:

* `MainLayout.jsx` → wraps pages with Navbar, Footer, etc.

---

### 🔹 router/

Handles all routing logic

* `AppRouter.jsx` → defines routes
* `ProtectedRoute.jsx` → handles authentication-based access

---

### 🔹 redux/

Global state management using Redux Toolkit

* `store.js` → main store
* `slices/` → feature-based state logic

---

### 🔹 services/

Handles API calls

Example:

* Axios setup
* Backend communication

---

### 🔹 utils/

Helper functions and constants

Examples:

* API URLs
* Validation functions
* Utility helpers

---

### 🔹 hooks/

Custom reusable React hooks

Example:

* Authentication logic
* Data fetching hooks

---

### 🔹 assets/

Stores static resources

Examples:

* Images
* Icons
* SVGs

---

### 🔹 styles/

Global styling

* CSS or Tailwind setup

---

## ⚡ Key Rules to Follow

* Do NOT put pages inside `components`
* Keep layouts separate from components
* Centralize routing inside `router/`
* Keep API logic inside `services/`
* Keep business logic out of UI components

---