# 🏋️ FitFlow

<p align="center">
  <img src="Frontend/src/assets/logo.png" style="border-radius:20px" width="120" alt="FitFlow Logo" />
</p>

> **Elevate your fitness journey, one rep at a time!**  
> FitFlow is a modern **MERN Stack** web application designed to help you plan workouts, track your progress, and stay motivated on your path to a healthier lifestyle 🚀💪.

<p align="center">
  <b>🔗 <a href="https://fitflow-flame.vercel.app/">Live Demo: fitflow-flame.vercel.app</a></b>
</p>

---

## 🚧 Status: Ongoing Project
> **Note:** FitFlow is currently under **active development**. Exciting new features are being built and added regularly! ✨

### ✅ What's Built So Far
- 📊 **Interactive Dashboard:** A comprehensive view of your fitness stats, current progress, and upcoming routines.
- 🗓️ **Workout Planner:** Plan your exercise routines, target specific muscle groups, and schedule them seamlessly.
- 🏃 **Live Workout Sessions:** Execute, track, and log your active workouts in real-time.
- ⚙️ **Backend Integration:** Robust REST APIs supporting workout execution routing, data management, and user sessions.
- 🎨 **Modern UI:** Clean, responsive, and aesthetically pleasing interface built with React and modern styling libraries.

---

## 🖼️ Sneak Peek Preview

### 🏠 Home Page
<p align="center">
  <!-- TODO: Replace src with actual Home Page Image path -->
  <img src="screenshots/home_page_image.png" alt="FitFlow Home Preview" width="800" style="border-radius:15px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); border: 1px solid #e5e7eb;"/>
</p>

### 📈 Dashboard
<p align="center">
  <!-- TODO: Replace src with actual Dashboard Image path -->
  <img src="screenshots/dashboard_image.png" alt="FitFlow Dashboard Preview" width="800" style="border-radius:15px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); border: 1px solid #e5e7eb;"/>
</p>

### 🗓️ Workout Planner
<p align="center">
  <!-- TODO: Replace src with actual Planner Image path -->
  <img src="screenshots/planner_image.png" alt="FitFlow Planner Preview" width="800" style="border-radius:15px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); border: 1px solid #e5e7eb;"/>
</p>

---

## 🚀 Tech Stack

### 🖥️ Frontend
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)
![React Router](https://img.shields.io/badge/React%20Router-CA4245?logo=react-router&logoColor=white&style=for-the-badge)

### ⚙️ Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge)

---

## 🧠 Architecture

```mermaid
graph TD
A[User Interface 💻] -->|REST APIs| B[React + Vite Frontend]
B -->|API Calls| C[Express Server ⚙️]
C -->|Database Queries| D[(MongoDB 🧩)]
```

---

## ⚡ Folder Structure (Current)

```
FitFlow/
│
├── 📁 Backend/           # Node + Express + MongoDB
│   ├── src/
│   │   ├── routes/
│   │   │   └── workoutExecutionRouter.js
│   │   └── ...
│   └── ...
│
├── 📁 Frontend/          # React + Vite + Modern UI Libraries
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── WorkoutSession.jsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
│
└── README.md
```

---

## 🧰 Installation & Setup

### 🔹 1. Clone the repository

```bash
git clone https://github.com/Ophidev/FitFlow.git
cd FitFlow
```

### 🔹 2. Setup the Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:

```env
MONGODB_CONNECTION_STRING= your mongodb connection string
JWT_SECRET= your jwt secret key
PORT = your port number
PROD_FRONTEND_URL= your production frontend url
```

### 🔹 3. Setup the Frontend

```bash
cd Frontend
npm install
```

Create a `.env` file in the Frontend directory to connect to your backend:

```env
VITE_BASE_URL=http://localhost:5000
```

### 🔹 4. Run the Full Application (Concurrently)

FitFlow is configured to run both the frontend and backend simultaneously from the root directory to save time!

First, make sure you are in the root directory (`FitFlow`) and install the root dependencies:
```bash
npm install
```

Then, start both servers with a single command:
```bash
npm run dev
```

> **💡 How it works:** This command uses the `concurrently` package (configured in the root `package.json`) to execute `"npm run backend"` and `"npm run frontend"` at the exact same time in one terminal window.

* Frontend → `http://localhost:5173`
* Backend → `http://localhost:5000`

---

## 🌐 Live Demo & Deployment

* **Live Demo:** [https://fitflow-flame.vercel.app/](https://fitflow-flame.vercel.app/)
* **Frontend Hosting:** Vercel

---

## 🧑💻 Author

**👤 Ophidev**  
💼 MERN Developer | 🚀 DevOps Learner  
🔗 [GitHub](https://github.com/Ophidev)

---

## ⭐ Support

If you like how **FitFlow** is shaping up, please consider giving this repository a **⭐ star**. Your support fuels the motivation to keep building awesome features! 🙌
