# 🏋️‍♂️ FitFlow

> **Plan your workouts. Execute with discipline. Track your progress. Stay consistent.**

---

## 🚀 Project Overview
FitFlow is a modern, full-stack workout tracking platform for gym lovers and home workout enthusiasts. It helps you:

- 📅 Plan structured workouts
- 🏋️ Execute workouts in real-time
- 📊 Track progress & history
- ⚡ Manage workout state intelligently

> **⚠️ This project is still in progress!**

---

## 🛠️ Tech Stack

### Backend
<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

### Frontend
<p align="left">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/DaisyUI-FF69B4?style=for-the-badge&logo=daisyui&logoColor=white" />
</p>

---

## 🏗️ Architecture

```mermaid
graph TD
    A[Frontend - React] -->|REST API| B[Backend - Express]
    B --> C[MongoDB Database]
```

---

## ✨ Key Features
- JWT-based authentication
- Workout planning (days, exercises, sets, reps)
- Weekly scheduling
- Real-time workout execution & set tracking
- Workout history & analytics foundation
- Smart suggestions for today's workout

---

## 📂 Folder Structure

### Backend
```
Backend/
├── config/
├── middlewares/
├── models/
├── routes/
├── utils/
├── app.js
├── package.json
```

### Frontend
```
Frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── router/
│   ├── redux/
│   ├── services/
│   ├── utils/
│   ├── hooks/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── docs/
├── package.json
```

---

## 💡 Project Idea
FitFlow empowers users to:
- Plan personalized workout routines
- Schedule workouts for each weekday
- Execute workouts with real-time set tracking
- Analyze progress and maintain consistency

The architecture is designed for scalability, clean separation of concerns, and future enhancements like analytics, streak tracking, and AI-powered suggestions.

---

## 📈 Status
**This project is actively being developed and is not yet production-ready.**

---

## 👨‍💻 Author
Built with discipline by **Ophid**
