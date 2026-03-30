# 🎨 FitFlow Theme Guide (DaisyUI)

---

## 🧭 Theme Approach

FitFlow uses **DaisyUI default color system**

👉 No custom CSS variables
👉 No mixing systems
👉 Only DaisyUI classes

---

## 🧱 Core Color Mapping (VERY IMPORTANT)

### 🏠 Backgrounds

| Usage               | DaisyUI Class |
| ------------------- | ------------- |
| Main App Background | `bg-base-100` |
| Card / Container    | `bg-base-200` |
| Elevated Surface    | `bg-base-300` |

---

### ✍️ Text

| Usage      | Class                          |
| ---------- | ------------------------------ |
| Main Text  | `text-base-content`            |
| Muted Text | `text-base-content opacity-70` |

---

### 🔘 Buttons

| Usage            | Class               |
| ---------------- | ------------------- |
| Primary Action   | `btn btn-primary`   |
| Secondary Action | `btn btn-secondary` |
| Accent Action    | `btn btn-accent`    |
| Ghost Button     | `btn btn-ghost`     |

---

### 📢 Status Colors

| Type    | Class                             |
| ------- | --------------------------------- |
| Success | `bg-success text-success-content` |
| Warning | `bg-warning text-warning-content` |
| Error   | `bg-error text-error-content`     |
| Info    | `bg-info text-info-content`       |

---

### 🔗 Other UI Elements

| Element | Class                 |
| ------- | --------------------- |
| Border  | `border-base-300`     |
| Divider | `divider`             |
| Link    | `link link-primary`   |
| Badge   | `badge badge-primary` |

---

## 🧠 Mental Model (REMEMBER THIS)

```
Background → base
Text → base-content
Action → primary / secondary
Feedback → success / warning / error
```

---

## 🧩 Component Examples

---

### 🏠 Page Layout

```jsx
<div className="bg-base-100 text-base-content min-h-screen">
  App Content
</div>
```

---

### 🧩 Card

```jsx
<div className="bg-base-200 p-5 rounded-xl shadow-md">
  Dashboard Card
</div>
```

---

### 🔘 Primary Button

```jsx
<button className="btn btn-primary">
  Start Workout
</button>
```

---

### 🔘 Secondary Button

```jsx
<button className="btn btn-secondary">
  View Plan
</button>
```

---

### 📊 Success Message

```jsx
<div className="bg-success text-success-content px-4 py-2 rounded-lg">
  Workout Completed ✅
</div>
```

---

### ⚠️ Warning

```jsx
<div className="bg-warning text-warning-content px-4 py-2 rounded-lg">
  Low Energy ⚠️
</div>
```

---

### ❌ Error

```jsx
<div className="bg-error text-error-content px-4 py-2 rounded-lg">
  Something went wrong
</div>
```

---

### 🔗 Link

```jsx
<a className="link link-primary">
  View Details
</a>
```

---

## 🧱 Header Example (Your Case)

```jsx
<div className="navbar bg-base-100 shadow-sm justify-between">

  <img src={Logo} className="w-15" />

  <div className="dropdown dropdown-end">
    <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full">
        <img src="user.jpg" />
      </div>
    </div>

    <ul className="menu menu-sm dropdown-content bg-base-200 mt-3 w-52 p-2 shadow rounded-box">
      <li><a>Profile</a></li>
      <li><a>Settings</a></li>
      <li><a>Logout</a></li>
    </ul>
  </div>

</div>
```

---

## ❌ What NOT To Do

* ❌ Do NOT use `var(--color-*)`
* ❌ Do NOT mix Tailwind custom colors + DaisyUI
* ❌ Do NOT override colors manually

---

## ✅ Best Practice

* Always use DaisyUI classes
* Keep UI consistent
* Use only 1–2 accent colors per screen

---

## 🚀 Final Rule

> Don’t think about colors
> Think about **component type**

DaisyUI already handles colors for you.

---

## 🔥 Summary

* Use `bg-base-*` → backgrounds
* Use `text-base-content` → text
* Use `btn-*` → buttons
* Use `bg-*` → status

---

**FitFlow UI = Clean + Consistent + Fast to build 🚀**
