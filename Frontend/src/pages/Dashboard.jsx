import React, { useMemo } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  Goal,
  History,
  LineChart,
  Medal,
  Play,
  Plus,
  Sparkles,
  Target,
  TimerReset,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";

const pageShell =
  "w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12";

const defaultViewport = { once: false, amount: 0.2 };

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const chartBar = {
  hidden: { height: 0, opacity: 0.35 },
  visible: (height) => ({
    height: `${height}%`,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

const weeklySchedule = [
  {
    day: "Mon",
    workout: "Push Day",
    type: "Chest • Shoulder • Triceps",
    status: "completed",
  },
  {
    day: "Tue",
    workout: "Pull Day",
    type: "Back • Biceps",
    status: "completed",
  },
  {
    day: "Wed",
    workout: "Leg Day",
    type: "Quads • Hamstrings • Calves",
    status: "today",
  },
  {
    day: "Thu",
    workout: "Recovery",
    type: "Mobility • Stretching",
    status: "upcoming",
  },
  {
    day: "Fri",
    workout: "Upper Strength",
    type: "Heavy compound focus",
    status: "upcoming",
  },
  {
    day: "Sat",
    workout: "Conditioning",
    type: "Core • Cardio",
    status: "upcoming",
  },
  {
    day: "Sun",
    workout: "Rest Day",
    type: "Reset • Recovery",
    status: "rest",
  },
];

const recentActivities = [
  {
    title: "Push Day completed",
    desc: "18 sets logged • 52 min duration",
    time: "Yesterday",
    icon: <CheckCircle2 size={16} />,
    color: "text-success",
  },
  {
    title: "New personal best",
    desc: "Bench Press volume increased by 8%",
    time: "2 days ago",
    icon: <Medal size={16} />,
    color: "text-warning",
  },
  {
    title: "Workout streak updated",
    desc: "You reached a 5 day consistency streak",
    time: "This week",
    icon: <Flame size={16} />,
    color: "text-secondary",
  },
];

const upcomingExercises = [
  {
    name: "Back Squat",
    sets: "4 sets",
    reps: "8 reps",
    rest: "90s rest",
  },
  {
    name: "Romanian Deadlift",
    sets: "3 sets",
    reps: "10 reps",
    rest: "75s rest",
  },
  {
    name: "Walking Lunges",
    sets: "3 sets",
    reps: "12 reps",
    rest: "60s rest",
  },
  {
    name: "Standing Calf Raise",
    sets: "4 sets",
    reps: "15 reps",
    rest: "45s rest",
  },
];

const StatCard = ({ title, value, subtitle, icon, badge, color = "primary" }) => {
  const colorMap = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    success: "btn-success",
    warning: "btn-warning",
    accent: "btn-accent",
  };

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-base-200 border border-base-300 rounded-[1.75rem] p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-base-content/60 mb-2">{title}</p>
          <h3 className="text-3xl sm:text-4xl font-black text-base-content leading-none">
            {value}
          </h3>
          <p className="text-sm text-base-content/70 mt-3">{subtitle}</p>
        </div>

        <div
          className={`btn btn-circle pointer-events-none shrink-0 ${
            colorMap[color] || "btn-primary"
          }`}
        >
          {icon}
        </div>
      </div>

      {badge && (
        <div className="mt-5">
          <span className="badge badge-primary badge-outline gap-2 py-3">
            <TrendingUp size={12} />
            {badge}
          </span>
        </div>
      )}
    </motion.div>
  );
};

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  const firstName = user?.firstName || "Athlete";

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const profileCompletion = useMemo(() => {
    const fields = [
      user?.firstName,
      user?.lastName,
      user?.age,
      user?.height,
      user?.weight,
      user?.goal,
    ];

    const completed = fields.filter(
      (item) => item && String(item).trim() !== "",
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [user]);

  const weeklyBars = [50, 72, 88, 42, 64, 80, 58];

  return (
    <section className="min-h-screen bg-base-100 text-base-content overflow-hidden py-8 sm:py-10 xl:py-12">
      <div className={pageShell}>
        {/* HERO */}
        <div className="grid xl:grid-cols-[1.15fr_0.85fr] gap-8 xl:gap-10 items-stretch mb-8 xl:mb-10">
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden bg-base-200 border border-base-300 rounded-[2rem] p-6 sm:p-8 xl:p-10 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-56 h-56 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="badge badge-primary badge-outline gap-2 px-4 py-4">
                  <Zap size={14} />
                  FitFlow Dashboard
                </span>

                <span className="badge badge-success gap-2 px-4 py-4">
                  <Flame size={14} />
                  5 day streak
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-tight mb-5">
                {greeting},
                <span className="block text-primary">{firstName}</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-base-content/70 max-w-3xl leading-relaxed mb-8">
                Your training system is ready. Review today’s workout, track
                consistency, and keep your progress moving forward.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn btn-primary btn-lg rounded-full">
                  <Play size={18} />
                  Start Today’s Workout
                </button>

                <button className="btn btn-secondary btn-lg rounded-full">
                  <Plus size={18} />
                  Create Workout Day
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                {[
                  {
                    label: "Today",
                    value: "Leg Day",
                  },
                  {
                    label: "Duration Goal",
                    value: "55 min",
                  },
                  {
                    label: "Total Sets",
                    value: "14 sets",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-base-100 border border-base-300 rounded-2xl p-4"
                  >
                    <p className="text-xs text-base-content/60 mb-1">
                      {item.label}
                    </p>
                    <p className="font-bold text-lg">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* PROFILE / READINESS CARD */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            className="bg-base-200 border border-base-300 rounded-[2rem] p-6 sm:p-7 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-base-content/60 mb-1">
                    Training Readiness
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Ready to perform
                  </h2>
                </div>

                <div className="avatar">
                  <div className="w-14 h-14 rounded-2xl ring ring-primary ring-offset-base-200 ring-offset-2">
                    <img
                      src={
                        user?.profilePicture ||
                        "https://cdn.pixabay.com/photo/2016/09/28/02/14/user-1699635_640.png"
                      }
                      alt="profile"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center py-6">
                <motion.div
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45 }}
                  className="radial-progress text-primary bg-base-100 border border-base-300"
                  style={{
                    "--value": 82,
                    "--size": "10rem",
                    "--thickness": "12px",
                  }}
                  role="progressbar"
                >
                  <div className="text-center">
                    <p className="text-3xl font-black">82%</p>
                    <p className="text-xs text-base-content/60">readiness</p>
                  </div>
                </motion.div>
              </div>

              <div className="bg-base-100 border border-base-300 rounded-3xl p-5 mt-auto">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="text-primary" size={18} />
                  <h3 className="font-bold">Smart suggestion</h3>
                </div>

                <p className="text-sm text-base-content/70 leading-relaxed">
                  You are ready for a moderate-heavy lower body session today.
                  Keep rest time controlled and focus on clean form.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* STATS */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8 xl:mb-10"
        >
          <StatCard
            title="Workouts Completed"
            value="18"
            subtitle="Sessions logged this month"
            badge="+24% this month"
            icon={<Dumbbell size={20} />}
            color="primary"
          />

          <StatCard
            title="Consistency Score"
            value="92%"
            subtitle="Your weekly training rhythm"
            badge="Strong momentum"
            icon={<Activity size={20} />}
            color="success"
          />

          <StatCard
            title="Total Training Time"
            value="14h"
            subtitle="Time invested this month"
            badge="+3h vs last month"
            icon={<Clock3 size={20} />}
            color="secondary"
          />

          <StatCard
            title="Current Streak"
            value="5"
            subtitle="Days of disciplined action"
            badge="Keep it alive"
            icon={<Flame size={20} />}
            color="warning"
          />
        </motion.div>

        {/* MAIN DASHBOARD GRID */}
        <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-8 xl:gap-10 items-start">
          {/* LEFT SIDE */}
          <div className="space-y-8">
            {/* TODAY WORKOUT */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="bg-base-200 border border-base-300 rounded-[2rem] p-6 sm:p-7 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="badge badge-primary badge-outline gap-2 px-4 py-4 mb-4">
                    <Target size={14} />
                    Today’s Focus
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Leg Day Strength
                  </h2>

                  <p className="text-base-content/70 mt-2">
                    Build power, volume, and consistency with a structured lower
                    body session.
                  </p>
                </div>

                <button className="btn btn-primary rounded-full">
                  Start Workout
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {upcomingExercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={defaultViewport}
                    transition={{ delay: index * 0.06, duration: 0.35 }}
                    className="bg-base-100 border border-base-300 rounded-3xl p-5 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg">{exercise.name}</h3>
                        <p className="text-sm text-base-content/60">
                          Exercise {index + 1}
                        </p>
                      </div>

                      <div className="btn btn-sm btn-circle btn-primary pointer-events-none">
                        <Dumbbell size={14} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-primary badge-outline">
                        {exercise.sets}
                      </span>
                      <span className="badge badge-secondary badge-outline">
                        {exercise.reps}
                      </span>
                      <span className="badge badge-ghost">
                        {exercise.rest}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* WEEKLY SCHEDULE */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="bg-base-200 border border-base-300 rounded-[2rem] p-6 sm:p-7 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CalendarDays className="text-primary" size={22} />
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      Weekly Schedule
                    </h2>
                  </div>
                  <p className="text-base-content/70">
                    Your planned training flow for this week.
                  </p>
                </div>

                <button className="btn btn-secondary rounded-full">
                  Edit Schedule
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-7 gap-4">
                {weeklySchedule.map((item, index) => {
                  const isToday = item.status === "today";
                  const isCompleted = item.status === "completed";
                  const isRest = item.status === "rest";

                  return (
                    <motion.div
                      key={item.day}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={defaultViewport}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                      className={`border rounded-3xl p-4 min-h-[165px] flex flex-col justify-between transition-all duration-300 ${
                        isToday
                          ? "bg-primary text-primary-content border-primary shadow-lg"
                          : "bg-base-100 border-base-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span
                            className={`font-black text-lg ${
                              isToday ? "text-primary-content" : ""
                            }`}
                          >
                            {item.day}
                          </span>

                          {isCompleted && (
                            <CheckCircle2 className="text-success" size={18} />
                          )}

                          {isToday && <Zap size={18} />}

                          {isRest && <TimerReset size={18} />}
                        </div>

                        <h3 className="font-bold leading-tight">
                          {item.workout}
                        </h3>

                        <p
                          className={`text-xs mt-2 leading-relaxed ${
                            isToday
                              ? "text-primary-content/80"
                              : "text-base-content/60"
                          }`}
                        >
                          {item.type}
                        </p>
                      </div>

                      <div className="mt-4">
                        <span
                          className={`badge ${
                            isToday
                              ? "badge-neutral"
                              : isCompleted
                                ? "badge-success"
                                : isRest
                                  ? "badge-ghost"
                                  : "badge-primary badge-outline"
                          }`}
                        >
                          {isToday
                            ? "Today"
                            : isCompleted
                              ? "Done"
                              : isRest
                                ? "Rest"
                                : "Upcoming"}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8 xl:sticky xl:top-24">
            {/* PROGRESS */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="bg-base-200 border border-base-300 rounded-[2rem] p-6 sm:p-7 shadow-xl"
            >
              <div className="flex items-center justify-between gap-4 mb-7">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="text-primary" size={22} />
                    <h2 className="text-2xl font-bold">Weekly Progress</h2>
                  </div>
                  <p className="text-sm text-base-content/70">
                    Training output across the last 7 days.
                  </p>
                </div>

                <span className="badge badge-success gap-2 py-3">
                  <TrendingUp size={12} />
                  +18%
                </span>
              </div>

              <div className="h-52 flex items-end gap-3">
                {weeklyBars.map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 h-full flex flex-col justify-end items-center gap-3"
                  >
                    <motion.div
                      custom={height}
                      variants={chartBar}
                      initial="hidden"
                      whileInView="visible"
                      viewport={defaultViewport}
                      whileHover={{ y: -4, scale: 1.03 }}
                      transition={{ delay: index * 0.05 }}
                      className={`w-full rounded-t-2xl origin-bottom ${
                        index === 2
                          ? "bg-primary shadow-md"
                          : "bg-base-300"
                      }`}
                    />

                    <span className="text-xs text-base-content/60">
                      {["M", "T", "W", "T", "F", "S", "S"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* PROFILE COMPLETION */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="bg-base-200 border border-base-300 rounded-[2rem] p-6 shadow-xl"
            >
              <div className="flex items-center justify-between gap-5 mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <User className="text-primary" size={20} />
                    <h2 className="text-xl font-bold">Profile Strength</h2>
                  </div>

                  <p className="text-sm text-base-content/70">
                    Complete profile data helps personalize your training
                    experience.
                  </p>
                </div>

                <div
                  className="radial-progress text-primary bg-base-100 border border-base-300 shrink-0"
                  style={{
                    "--value": profileCompletion,
                    "--size": "5rem",
                    "--thickness": "8px",
                  }}
                  role="progressbar"
                >
                  <span className="text-sm font-bold">
                    {profileCompletion}%
                  </span>
                </div>
              </div>

              <Link to="/profile" className="btn btn-primary rounded-full w-full">
                Improve Profile
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* GOAL CARD */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="bg-base-200 border border-base-300 rounded-[2rem] p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <Goal className="text-secondary" size={22} />
                <h2 className="text-xl font-bold">Current Goal</h2>
              </div>

              <div className="bg-base-100 border border-base-300 rounded-3xl p-5 mb-4">
                <p className="text-sm text-base-content/60 mb-1">
                  Primary focus
                </p>
                <h3 className="text-2xl font-black capitalize">
                  {user?.goal || "Set your goal"}
                </h3>
              </div>

              <p className="text-sm text-base-content/70 leading-relaxed">
                Your dashboard recommendations and workout planning flow can be
                optimized around your goal.
              </p>
            </motion.div>

            {/* RECENT ACTIVITY */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="bg-base-200 border border-base-300 rounded-[2rem] p-6 shadow-xl"
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <History className="text-primary" size={22} />
                  <h2 className="text-xl font-bold">Recent Activity</h2>
                </div>

                <button className="btn btn-ghost btn-sm">
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={defaultViewport}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-base-100 border border-base-300 rounded-3xl p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full bg-base-200 border border-base-300 flex items-center justify-center shrink-0 ${activity.color}`}
                      >
                        {activity.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold leading-tight">
                          {activity.title}
                        </h3>

                        <p className="text-sm text-base-content/70 mt-1">
                          {activity.desc}
                        </p>

                        <p className="text-xs text-base-content/50 mt-2">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* MINI INSIGHT */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="bg-success text-success-content rounded-[2rem] p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <LineChart size={22} />
                <h2 className="text-xl font-bold">Progress Insight</h2>
              </div>

              <p className="text-sm sm:text-base opacity-90 leading-relaxed">
                You are building strong consistency. Complete today’s workout to
                keep your weekly training rhythm above 90%.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;