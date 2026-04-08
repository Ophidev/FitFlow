import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Zap,
  Calendar,
  Target,
  BrainCircuit,
  Dumbbell,
  Flame,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  TimerReset,
  Sparkles,
  ArrowRight,
  Goal,
  ClipboardList,
} from "lucide-react";

// ---------------- ANIMATIONS ----------------
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
      staggerChildren: 0.1,
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

const statPop = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.35,
      ease: "easeOut",
    },
  }),
};

const pageShell =
  "w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12";

// ---------------- MOCK COMPONENTS ----------------
const MockWorkoutLog = () => (
  <div className="bg-base-200 border border-base-300 rounded-3xl p-4 sm:p-6 shadow-xl w-full">
    <div className="flex items-center justify-between mb-6 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="btn btn-primary btn-sm btn-circle pointer-events-none shrink-0">
          <Dumbbell size={16} />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-base-content text-lg truncate">
            Heavy Squats
          </h4>
          <p className="text-sm text-base-content/70 truncate">
            Lower body • Strength day
          </p>
        </div>
      </div>
      <span className="badge badge-primary badge-outline whitespace-nowrap">
        In Progress
      </span>
    </div>

    <div className="space-y-3">
      {[1, 2, 3, 4].map((set, i) => (
        <motion.div
          key={set}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          className={`rounded-2xl border p-4 flex items-center justify-between gap-3 ${
            i === 2
              ? "bg-base-300 border-base-300"
              : "bg-base-100 border-base-300"
          }`}
        >
          <div className="min-w-0">
            <p className="font-medium text-base-content">Set {set}</p>
            <p className="text-sm text-base-content/70">Back squat</p>
          </div>

          <div className="text-right min-w-0">
            <p className="font-semibold text-base-content whitespace-nowrap">
              315 lbs × 8
            </p>
            <p className="text-xs text-base-content/70">Target achieved</p>
          </div>

          {i !== 2 ? (
            <CheckCircle2 className="text-success shrink-0" size={18} />
          ) : (
            <span className="loading loading-spinner loading-sm text-primary shrink-0" />
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

const MockAnalytics = () => {
  const bars = [35, 50, 45, 70, 62, 88, 100];

  return (
    <div className="bg-base-200 border border-base-300 rounded-3xl p-4 sm:p-6 shadow-xl h-full">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="text-sm text-base-content/70">Volume Load</p>
          <h4 className="text-3xl font-bold text-base-content">+24.5%</h4>
        </div>
        <div className="badge badge-success gap-2 py-3 px-4">
          <TrendingUp size={14} />
          vs last month
        </div>
      </div>

      <div className="h-44 sm:h-48 flex items-end gap-2 sm:gap-3">
        {bars.map((height, i) => (
          <motion.div
            key={i}
            custom={height}
            variants={chartBar}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            whileHover={{ y: -3, scale: 1.02 }}
            animate={i === 6 ? { scale: [1, 1.03, 1] } : {}}
            transition={
              i === 6
                ? {
                    scale: {
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
                : { delay: i * 0.05 }
            }
            className={`flex-1 rounded-t-xl origin-bottom cursor-pointer ${
              i === 6 ? "bg-primary shadow-md" : "bg-base-300"
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { label: "PRs", value: "12" },
          { label: "Sessions", value: "18" },
          { label: "Consistency", value: "92%" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            custom={i}
            variants={statPop}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="bg-base-100 rounded-2xl p-3 border border-base-300"
          >
            <p className="text-xs text-base-content/70">{item.label}</p>
            <p className="font-bold text-base-content">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ProgressEngineDiagram = () => (
  <div className="relative bg-base-200 border border-base-300 rounded-[2rem] p-6 md:p-8 shadow-xl overflow-hidden">
    <div className="grid md:grid-cols-3 gap-6 items-center">
      <motion.div
        variants={fadeRight}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="space-y-4"
      >
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="btn btn-primary btn-sm btn-circle pointer-events-none">
              <ClipboardList size={16} />
            </div>
            <h4 className="font-bold text-base-content">Plan</h4>
          </div>
          <p className="text-sm text-base-content/70">
            Choose a split, define workouts, and create structure.
          </p>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="btn btn-secondary btn-sm btn-circle pointer-events-none">
              <Dumbbell size={16} />
            </div>
            <h4 className="font-bold text-base-content">Train</h4>
          </div>
          <p className="text-sm text-base-content/70">
            Log every set in real time with minimal friction.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="flex justify-center"
      >
        <div className="relative w-full max-w-[260px] sm:max-w-xs aspect-square rounded-full border-4 border-base-300 flex items-center justify-center bg-base-100">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-dashed border-base-300"
          />
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-base-200 border border-base-300 flex flex-col items-center justify-center text-center px-2"
          >
            <BrainCircuit className="mb-2 text-primary" size={28} />
            <p className="font-bold text-base-content text-sm">
              FitFlow Engine
            </p>
            <p className="text-xs text-base-content/70">
              Track → Analyze → Adapt
            </p>
          </motion.div>

          <div className="absolute top-2 left-1/2 -translate-x-1/2 badge badge-primary">
            Data
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 badge badge-secondary">
            Feedback
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeLeft}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="space-y-4"
      >
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="btn btn-accent btn-sm btn-circle pointer-events-none">
              <BarChart3 size={16} />
            </div>
            <h4 className="font-bold text-base-content">Analyze</h4>
          </div>
          <p className="text-sm text-base-content/70">
            See trends in volume, strength, and workout consistency.
          </p>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="btn btn-success btn-sm btn-circle pointer-events-none">
              <Goal size={16} />
            </div>
            <h4 className="font-bold text-base-content">Progress</h4>
          </div>
          <p className="text-sm text-base-content/70">
            Use clear next steps so every session builds on the last one.
          </p>
        </div>
      </motion.div>
    </div>
  </div>
);

const FeatureImagePanel = () => {
  const bars = [70, 40, 85, 60, 95, 75, 50];
  const linePath =
    "M 0 120 C 40 90, 80 95, 120 70 S 200 35, 240 55 S 320 85, 360 30";

  return (
    <div className="grid lg:grid-cols-5 gap-4 xl:gap-5">
      <div className="lg:col-span-3 bg-base-200 border border-base-300 rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h4 className="font-bold text-base-content">Weekly Overview</h4>
          <span className="badge badge-primary">Live</span>
        </div>

        <div className="relative rounded-2xl bg-base-100 border border-base-300 p-4 h-64 sm:h-72 overflow-hidden">
          <motion.svg
            viewBox="0 0 360 140"
            className="absolute inset-x-4 top-6 w-[calc(100%-2rem)] h-32"
            preserveAspectRatio="none"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.path
              d={linePath}
              fill="none"
              stroke="currentColor"
              className="text-secondary"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.35 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={defaultViewport}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </motion.svg>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="grid grid-cols-7 gap-2 sm:gap-3 h-36 items-end">
              {bars.map((v, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-end items-center gap-2 h-full"
                >
                  <motion.div
                    custom={v}
                    variants={chartBar}
                    initial="hidden"
                    whileInView="visible"
                    viewport={defaultViewport}
                    whileHover={{ y: -3, scale: 1.03 }}
                    transition={{ delay: i * 0.05 }}
                    className={`w-full rounded-t-xl origin-bottom ${
                      i % 2 === 0 ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                  <span className="text-xs text-base-content/70">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          className="bg-base-200 border border-base-300 rounded-3xl p-5 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <TimerReset className="text-primary" size={20} />
            <h4 className="font-bold text-base-content">Recovery Signal</h4>
          </div>
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={defaultViewport}
            transition={{ duration: 0.5 }}
            className="mb-3"
          >
            <div
              className="radial-progress text-primary"
              style={{ "--value": 76, "--size": "5rem", "--thickness": "8px" }}
              role="progressbar"
            >
              76%
            </div>
          </motion.div>
          <p className="text-sm text-base-content/70">
            You’re ready for a moderate-heavy session today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ delay: 0.06 }}
          className="bg-base-200 border border-base-300 rounded-3xl p-5 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="text-secondary" size={20} />
            <h4 className="font-bold text-base-content">Next Recommendation</h4>
          </div>
          <p className="text-sm text-base-content/70 mb-3">
            Increase squat volume by 1 set and maintain RPE target.
          </p>
          <div className="badge badge-secondary badge-outline">
            Adaptive suggestion
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StoryMapSection = () => {
  const steps = [
    {
      title: "You started with good intentions",
      desc: "You wanted a better body, more energy, and a system you could trust.",
      icon: <Target size={18} />,
      badge: "Start",
    },
    {
      title: "Then the routine got blurry",
      desc: "You forgot weights, guessed exercises, and every week felt disconnected from the last.",
      icon: <Activity size={18} />,
      badge: "Confusion",
    },
    {
      title: "Progress became invisible",
      desc: "Without data, your brain assumed nothing was changing — even when effort was real.",
      icon: <BarChart3 size={18} />,
      badge: "No feedback",
    },
    {
      title: "Eventually, momentum collapsed",
      desc: "Not because you were lazy — because the system around you was broken.",
      icon: <Flame size={18} />,
      badge: "Burnout",
    },
  ];

  return (
    <section className="py-20 sm:py-24 xl:py-28">
      <div className={pageShell}>
        <div className="grid xl:grid-cols-[minmax(320px,0.85fr)_minmax(520px,1.15fr)] 2xl:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 xl:gap-20 items-start">
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="xl:sticky xl:top-24 self-start max-w-xl"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-5 leading-[1.05]">
              This is not about motivation.
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-base-content/70 leading-relaxed">
              Most people don’t fail because they don’t care. They fail because
              they don’t have a visible path. When training has no memory, no
              progression, and no feedback — consistency breaks.
            </p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="mt-8 lg:mt-10 bg-base-200 border border-base-300 rounded-3xl p-5 sm:p-6 shadow-md"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="btn btn-primary btn-sm btn-circle pointer-events-none shrink-0">
                  <BrainCircuit size={16} />
                </div>
                <h4 className="font-bold text-lg">The real problem</h4>
              </div>
              <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
                You didn’t need more hype. You needed a training map that keeps
                every workout connected to the next one.
              </p>
            </motion.div>

            {/* NEW VISUAL CARD */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              transition={{ delay: 0.08 }}
              className="mt-6 bg-base-200 border border-base-300 rounded-[2rem] p-5 sm:p-6 shadow-md overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5 gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-base-content/50 font-semibold">
                    Broken loop
                  </p>
                  <h4 className="font-bold text-lg sm:text-xl">
                    Why consistency breaks
                  </h4>
                </div>
                <div className="badge badge-outline badge-primary">Cycle</div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  {
                    title: "No memory",
                    desc: "You forget last session",
                    icon: <Activity size={16} />,
                  },
                  {
                    title: "No target",
                    desc: "You guess what to do",
                    icon: <Target size={16} />,
                  },
                  {
                    title: "No proof",
                    desc: "Progress feels invisible",
                    icon: <BarChart3 size={16} />,
                  },
                  {
                    title: "No momentum",
                    desc: "Consistency drops again",
                    icon: <Flame size={16} />,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={defaultViewport}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    className="bg-base-100 border border-base-300 rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-base-200 border border-base-300 flex items-center justify-center text-primary shrink-0">
                        {item.icon}
                      </div>
                      <p className="font-semibold text-sm sm:text-base">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-base-content/65 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 relative h-14 rounded-2xl bg-base-100 border border-base-300 overflow-hidden flex items-center justify-center">
                <motion.div
                  animate={{ x: ["-10%", "110%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary/10 blur-2xl"
                />
                <div className="flex items-center gap-2 text-sm text-base-content/70 z-10">
                  <span className="font-medium">Guess</span>
                  <ArrowRight size={16} className="text-primary" />
                  <span className="font-medium">Inconsistency</span>
                  <ArrowRight size={16} className="text-primary" />
                  <span className="font-medium">Restart</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative w-full max-w-none">
            <div className="absolute left-5 sm:left-6 lg:left-7 top-0 bottom-0 w-px bg-base-300" />

            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  variants={fadeLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex items-start gap-4 sm:gap-5 lg:gap-6"
                >
                  <div className="relative z-10 pt-2 shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border border-base-300 bg-base-100 shadow flex items-center justify-center">
                      <span className="text-primary">{step.icon}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 bg-base-200 border border-base-300 rounded-[1.75rem] p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold leading-snug max-w-[80%]">
                        {step.title}
                      </h3>
                      <span className="badge badge-primary badge-outline whitespace-nowrap">
                        {step.badge}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base lg:text-[17px] text-base-content/70 leading-relaxed">
                      {step.desc}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm text-base-content/60">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block shrink-0" />
                      Step {i + 1} in the broken loop
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="mt-8 sm:mt-10 ml-0 sm:ml-14 lg:ml-16 bg-success text-success-content rounded-[1.75rem] p-5 sm:p-6 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 size={20} />
                <h4 className="font-bold text-lg">The fix is structure</h4>
              </div>
              <p className="opacity-90 text-sm sm:text-base leading-relaxed">
                Once every session is connected, progress stops feeling random.
                That’s where FitFlow changes everything.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SystemFlowSection = () => {
  const steps = [
    {
      step: "01",
      title: "Build Your Plan",
      desc: "Start with proven templates or create your split in minutes.",
      icon: <Calendar size={20} />,
    },
    {
      step: "02",
      title: "Train & Log",
      desc: "See exactly what you did last time and what to beat today.",
      icon: <Dumbbell size={20} />,
    },
    {
      step: "03",
      title: "Review & Progress",
      desc: "Use your numbers to adjust volume, intensity, and consistency.",
      icon: <TrendingUp size={20} />,
    },
  ];

  return (
    <section className="py-20 sm:py-24 xl:py-28">
      <div className={pageShell}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold mb-4">
            The FitFlow system
          </h2>
          <p className="text-base sm:text-lg text-base-content/70">
            Three connected steps to break the “tomorrow” cycle for good.
          </p>
        </motion.div>

        <div className="grid xl:grid-cols-[1.3fr_0.9fr] gap-8 xl:gap-10 items-start">
          <div className="bg-base-200 border border-base-300 rounded-[2rem] p-5 sm:p-7 shadow-xl">
            <div className="space-y-6">
              {steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                  className="grid md:grid-cols-[auto_1fr_auto] gap-4 items-center bg-base-100 border border-base-300 rounded-3xl p-5"
                >
                  <div className="btn btn-primary btn-circle pointer-events-none">
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-base-content/50 mb-1">
                      PHASE {item.step}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-base-content/70 mt-1">
                      {item.desc}
                    </p>
                  </div>

                  <div className="hidden md:flex items-center justify-center">
                    {i < steps.length - 1 ? (
                      <ArrowRight className="text-primary" size={18} />
                    ) : (
                      <CheckCircle2 className="text-success" size={18} />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="bg-base-200 border border-base-300 rounded-[2rem] p-5 sm:p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <h4 className="font-bold text-lg">Execution Preview</h4>
              <span className="badge badge-secondary">Live flow</span>
            </div>

            <div className="space-y-4">
              <div className="bg-base-100 border border-base-300 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
                  <p className="font-semibold">Push Day A</p>
                  <span className="badge badge-outline">Today</span>
                </div>
                <div className="space-y-2">
                  {["Bench Press", "Incline DB Press", "Cable Fly"].map(
                    (ex, i) => (
                      <div
                        key={ex}
                        className="flex items-center justify-between text-sm gap-3"
                      >
                        <span className="text-base-content/70">{ex}</span>
                        <span className="font-medium whitespace-nowrap">
                          {i + 3} sets
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="bg-base-100 border border-base-300 rounded-2xl p-4">
                <p className="text-sm text-base-content/70 mb-2">Consistency</p>
                <div className="h-24 flex items-end gap-2">
                  {[45, 60, 58, 72, 80, 90, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      custom={h}
                      variants={chartBar}
                      initial="hidden"
                      whileInView="visible"
                      viewport={defaultViewport}
                      whileHover={{ y: -2, scale: 1.02 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex-1 rounded-t-lg ${
                        i === 6 ? "bg-primary shadow-sm" : "bg-base-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-info text-info-content rounded-2xl p-4">
                <p className="font-semibold mb-1">Suggested next step</p>
                <p className="text-sm opacity-90">
                  Add +5 lbs to your top bench set next session.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const AIVisionSection = () => {
  return (
    <section className="py-20 sm:py-24 xl:py-28">
      <div className={pageShell}>
        <div className="grid lg:grid-cols-[minmax(340px,1.15fr)_minmax(320px,0.95fr)] 2xl:grid-cols-[1.15fr_0.9fr] gap-8 xl:gap-12 items-center bg-base-200 border border-base-300 rounded-[2rem] p-6 sm:p-8 lg:p-10 2xl:p-12 shadow-xl">
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="max-w-2xl"
          >
            <div className="badge badge-primary mb-5 gap-2 p-4">
              <BrainCircuit size={14} />
              Future AI Layer
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              Powered by intelligence
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-base-content/70 leading-relaxed mb-8">
              FitFlow’s future AI engine can analyze fatigue, recovery, training
              volume, performance trends, and consistency signals to help guide
              your next workout more intelligently.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Recovery-aware workout suggestions",
                "Dynamic volume and intensity guidance",
                "Smarter progression recommendations",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={defaultViewport}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="text-success shrink-0" size={18} />
                  <span className="text-sm sm:text-base">{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn btn-primary rounded-full">
                Read the Vision
              </button>
              <button className="btn btn-ghost rounded-full">
                Explore Roadmap
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="w-full"
          >
            <div className="grid sm:grid-cols-2 gap-4 auto-rows-fr">
              <div className="bg-base-100 border border-base-300 rounded-3xl p-5 shadow-md min-h-[220px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <TimerReset className="text-primary" size={18} />
                    <h4 className="font-bold">Recovery Score</h4>
                  </div>
                  <div
                    className="radial-progress text-primary mb-4"
                    style={{
                      "--value": 82,
                      "--size": "5rem",
                      "--thickness": "8px",
                    }}
                    role="progressbar"
                  >
                    82%
                  </div>
                </div>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  You’re recovered enough to push heavy compounds.
                </p>
              </div>

              <div className="bg-base-100 border border-base-300 rounded-3xl p-5 shadow-md min-h-[220px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="text-secondary" size={18} />
                    <h4 className="font-bold">Trend Signal</h4>
                  </div>
                  <div className="h-24 flex items-end gap-2 mb-4">
                    {[30, 42, 48, 65, 78, 86].map((h, i) => (
                      <motion.div
                        key={i}
                        custom={h}
                        variants={chartBar}
                        initial="hidden"
                        whileInView="visible"
                        viewport={defaultViewport}
                        whileHover={{ y: -2 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex-1 rounded-t-lg ${
                          i > 3 ? "bg-secondary" : "bg-base-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  Strength trend is moving upward for 4 straight sessions.
                </p>
              </div>

              <div className="bg-base-100 border border-base-300 rounded-3xl p-5 shadow-md min-h-[200px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="text-accent" size={18} />
                    <h4 className="font-bold">AI Recommendation</h4>
                  </div>
                  <p className="text-sm text-base-content/70 mb-4 leading-relaxed">
                    Maintain your top set and add one back-off set for
                    hypertrophy.
                  </p>
                </div>
                <span className="badge badge-accent badge-outline w-fit">
                  Adaptive
                </span>
              </div>

              <div className="bg-success text-success-content rounded-3xl p-5 shadow-md min-h-[200px] flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 size={18} />
                  <h4 className="font-bold">Smart Outcome</h4>
                </div>
                <p className="text-sm opacity-90 leading-relaxed">
                  Better decisions, lower guesswork, stronger consistency.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FinalCTASection = () => {
  return (
    <section className="py-20 sm:py-24 xl:py-28">
      <div className={pageShell}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="bg-base-200 border border-base-300 rounded-[2rem] p-8 md:p-12 xl:p-16 shadow-xl text-center max-w-6xl mx-auto"
        >
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="badge badge-success gap-2 p-4">
              <CheckCircle2 size={14} />
              14-day free trial
            </span>
            <span className="badge badge-info gap-2 p-4">
              <BarChart3 size={14} />
              Progress insights
            </span>
            <span className="badge badge-primary gap-2 p-4">
              <Zap size={14} />
              Built for consistency
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight mb-6 leading-tight">
            Your future self is waiting.
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto mb-10">
            Stop depending on motivation. Start using a system that tracks the
            work, proves the progress, and keeps you moving.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
            <Link to="/signup" className="btn btn-primary btn-lg rounded-full">
              Start Your Journey
              <ArrowRight size={18} />
            </Link>
            <span className="text-sm text-base-content/70">
              Free 14-day trial. No card required.
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { label: "Track workouts", value: "Fast logging" },
              { label: "See progress", value: "Visual analytics" },
              { label: "Stay consistent", value: "Smarter training loop" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-base-100 border border-base-300 rounded-2xl p-5"
              >
                <p className="text-sm text-base-content/70">{item.label}</p>
                <p className="font-bold text-lg">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ---------------- MAIN PAGE ----------------
const Home = () => {
  return (
    <div className="bg-base-100 text-base-content min-h-screen overflow-hidden">
      {/* HERO */}
      <section className="min-h-screen flex items-center py-20 xl:py-24">
        <div className={pageShell}>
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 2xl:gap-20 items-center">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="badge badge-primary badge-outline mb-6 gap-2 px-4 py-4"
              >
                <Zap size={14} />
                Welcome to FitFlow
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-tight tracking-tight mb-6"
              >
                Stop saying
                <span className="block text-primary">
                  “I’ll start tomorrow.”
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="text-base sm:text-lg md:text-xl text-base-content/70 max-w-2xl leading-relaxed mb-8"
              >
                FitFlow gives your training structure, memory, and momentum.
                Track every workout, measure real progress, and build a system
                you can actually stick to.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/signup"
                  className="btn btn-primary btn-lg rounded-full"
                >
                  Break The Cycle
                  <ChevronRight size={18} />
                </Link>

                <Link
                  to="/demo"
                  className="btn btn-secondary btn-lg rounded-full"
                >
                  See how it works
                </Link>
              </motion.div>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="badge badge-success gap-2 p-4">
                  <CheckCircle2 size={14} />
                  Science-based routines
                </div>
                <div className="badge badge-info gap-2 p-4">
                  <BarChart3 size={14} />
                  Progress analytics
                </div>
                <div className="badge badge-warning gap-2 p-4">
                  <Calendar size={14} />
                  Consistency tracking
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative w-full"
            >
              <div className="absolute inset-0 blur-3xl opacity-30 bg-base-300 rounded-full" />
              <MockWorkoutLog />
            </motion.div>
          </div>
        </div>
      </section>

      <StoryMapSection />

      {/* SYSTEM DIAGRAM */}
      <section className="py-20 sm:py-24 xl:py-28">
        <div className={pageShell}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="text-center mb-14 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-5">
              Consistency, designed as a system
            </h2>
            <p className="text-base sm:text-lg text-base-content/70">
              FitFlow doesn’t just help you log workouts. It creates a feedback
              loop: plan smarter, train with clarity, analyze results, and
              improve the next session automatically.
            </p>
          </motion.div>

          <ProgressEngineDiagram />
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-20 sm:py-24 xl:py-28">
        <div className={pageShell}>
          <div className="space-y-20 sm:space-y-24">
            <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
              <motion.div
                variants={fadeRight}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
              >
                <div className="badge badge-secondary mb-4 gap-2 p-4">
                  <Dumbbell size={14} />
                  Workout Logging
                </div>

                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
                  Track without breaking your flow
                </h3>
                <p className="text-base sm:text-lg text-base-content/70 leading-relaxed mb-8">
                  Log sets, reps, and weights in seconds. No clunky forms. No
                  mental overhead. Just enough structure to keep you focused
                  while you train.
                </p>

                <ul className="space-y-3">
                  {[
                    "One-tap set logging",
                    "Previous session weight reference",
                    "Rest timers and progression cues",
                    "Support for supersets and dropsets",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="text-success" size={18} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
              >
                <MockWorkoutLog />
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
              <motion.div
                variants={fadeRight}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="order-2 lg:order-1"
              >
                <MockAnalytics />
              </motion.div>

              <motion.div
                variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="order-1 lg:order-2"
              >
                <div className="badge badge-accent mb-4 gap-2 p-4">
                  <TrendingUp size={14} />
                  Progress Analytics
                </div>

                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
                  See proof that the work is working
                </h3>
                <p className="text-base sm:text-lg text-base-content/70 leading-relaxed mb-8">
                  Motivation fades. Evidence doesn’t. FitFlow turns your
                  training into something visible, measurable, and rewarding.
                </p>

                <ul className="space-y-3">
                  {[
                    "Volume and intensity tracking",
                    "Personal record milestones",
                    "Consistency and streak visibility",
                    "Performance trends over time",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="text-success" size={18} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ENHANCED VISUAL */}
      <section className="py-20 sm:py-24 xl:py-28">
        <div className={pageShell}>
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center mb-12">
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              <div className="badge badge-primary mb-4 gap-2 p-4">
                <Sparkles size={14} />
                Adaptive Experience
              </div>

              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
                More than a tracker. A training command center.
              </h3>
              <p className="text-base sm:text-lg text-base-content/70 leading-relaxed">
                Instead of repeating the same card pattern, this section gives a
                richer product feel: dashboard signals, recovery insights,
                recommendations, and a clear sense that the app is thinking with
                you.
              </p>
            </motion.div>

            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="bg-success text-success-content rounded-3xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={22} />
                <h4 className="font-bold text-lg">Workout Completed</h4>
              </div>
              <p className="opacity-90">
                You increased total lower-body volume by 8% this week. Keep the
                momentum going.
              </p>
            </motion.div>
          </div>

          <FeatureImagePanel />
        </div>
      </section>

      <SystemFlowSection />

      <AIVisionSection />

      <FinalCTASection />
    </div>
  );
};

export default Home;
