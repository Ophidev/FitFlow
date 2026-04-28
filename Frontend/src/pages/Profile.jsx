import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Camera,
  Save,
  Target,
  Ruler,
  Weight,
  Calendar,
  Sparkles,
  CheckCircle2,
  Activity,
  Flame,
  BadgeCheck,
  TrendingUp,
  HeartPulse,
  ChevronDown,
} from "lucide-react";

// Animations
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

const pageShell =
  "w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12";

const goalOptions = [
  "lose weight",
  "gain weight",
  "gain strength",
  "maintain health",
];

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "Ayush",
    lastName: "bhatt",
    profilePicture:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    age: "18",
    height: "179",
    weight: "74",
    goal: "gain strength",
  });

  const [saved, setSaved] = useState(false);

  const fullName = useMemo(() => {
    return `${formData.firstName || ""} ${formData.lastName || ""}`.trim() || "Your Name";
  }, [formData.firstName, formData.lastName]);

  const bmi = useMemo(() => {
    const heightM = Number(formData.height) / 100;
    const weightKg = Number(formData.weight);
    if (!heightM || !weightKg) return "--";
    return (weightKg / (heightM * heightM)).toFixed(1);
  }, [formData.height, formData.weight]);

  const profileCompletion = useMemo(() => {
    const fields = [
      formData.firstName,
      formData.lastName,
      formData.profilePicture,
      formData.age,
      formData.height,
      formData.weight,
      formData.goal,
    ];
    const completed = fields.filter((item) => item && String(item).trim() !== "").length;
    return Math.round((completed / fields.length) * 100);
  }, [formData]);

  const handleChange = (field, value) => {
    setSaved(false);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2200);
  };

  return (
    <section className="py-16 sm:py-20 xl:py-24 bg-base-100 text-base-content min-h-screen overflow-hidden">
      <div className={pageShell}>
        <style>
          {`
            input[type='number']::-webkit-outer-spin-button,
            input[type='number']::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }

            input[type='number'] {
              -moz-appearance: textfield;
              appearance: textfield;
            }

            select {
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
              background-image: none !important;
            }
          `}
        </style>

        {/* Header + top-right filled area */}
        <div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-8 xl:gap-10 items-center mb-10 sm:mb-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <div className="badge badge-primary badge-outline mb-5 gap-2 px-4 py-4">
              <User size={14} />
              Profile Settings
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-tight mb-5">
              Build your
              <span className="block text-primary">fitness identity</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-base-content/70 max-w-2xl leading-relaxed">
              Update your personal details, keep your training identity sharp,
              and preview how your profile looks across the FitFlow experience.
            </p>
          </motion.div>

          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            className="bg-base-200 border border-base-300 rounded-[2rem] p-5 sm:p-6 shadow-xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-primary/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                <div>
                  <p className="text-sm text-base-content/70">Profile Insight</p>
                  <h3 className="text-2xl sm:text-3xl font-bold">Body Snapshot</h3>
                </div>
                <div className="badge badge-secondary gap-2">
                  <HeartPulse size={14} />
                  Live
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-base-100 border border-base-300 rounded-2xl p-4">
                  <p className="text-xs text-base-content/60 mb-1">BMI</p>
                  <p className="text-xl font-bold">{bmi}</p>
                </div>

                <div className="bg-base-100 border border-base-300 rounded-2xl p-4">
                  <p className="text-xs text-base-content/60 mb-1">Goal</p>
                  <p className="text-sm font-bold capitalize leading-tight">
                    {formData.goal}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-primary" size={16} />
                  <p className="font-semibold">Progress Signal</p>
                </div>

                <div
                  className="radial-progress text-primary bg-base-100 border border-base-300"
                  style={{
                    "--value": profileCompletion,
                    "--size": "4.5rem",
                    "--thickness": "7px",
                  }}
                  role="progressbar"
                >
                  <span className="text-xs font-bold">{profileCompletion}%</span>
                </div>
              </div>

              <div className="h-24 sm:h-28 flex items-end gap-2">
                {[32, 45, 54, 66, 74, 86, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    custom={h}
                    variants={chartBar}
                    initial="hidden"
                    whileInView="visible"
                    viewport={defaultViewport}
                    transition={{ delay: i * 0.05 }}
                    className={`flex-1 rounded-t-xl ${
                      i === 6 ? "bg-primary shadow-sm" : "bg-base-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main content */}
        <div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-8 xl:gap-10 items-start">
          {/* Edit Form */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="visible"
            className="bg-base-200 border border-base-300 rounded-[2rem] p-5 sm:p-7 shadow-xl"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Edit Profile</h2>
                <p className="text-sm sm:text-base text-base-content/70 mt-1">
                  Keep your account details updated for a more personalized
                  training experience.
                </p>
              </div>

              <div className="badge badge-secondary gap-2 p-4">
                <Sparkles size={14} />
                Live synced preview
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Profile Picture */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="bg-base-100 border border-base-300 rounded-3xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="btn btn-primary btn-circle pointer-events-none">
                    <Camera size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Profile Picture</h3>
                    <p className="text-sm text-base-content/70">
                      Add an image URL for your profile avatar
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-[120px_1fr] gap-5 items-center">
                  <div className="flex justify-center md:justify-start">
                    <div className="avatar">
                      <div className="w-24 h-24 rounded-3xl ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                          src={
                            formData.profilePicture ||
                            "https://placehold.co/300x300?text=Profile"
                          }
                          alt="Profile Preview"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <label className="form-control w-full">
                    <span className="label">
                      <span className="label-text font-medium">
                        Profile image URL
                      </span>
                    </span>
                    <input
                      type="text"
                      value={formData.profilePicture}
                      onChange={(e) =>
                        handleChange("profilePicture", e.target.value)
                      }
                      placeholder="https://example.com/avatar.jpg"
                      className="input input-bordered w-full rounded-2xl bg-base-100"
                    />
                  </label>
                </div>
              </motion.div>

              {/* Name */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <motion.label
                  variants={fadeUp}
                  className="form-control bg-base-100 border border-base-300 rounded-3xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="btn btn-warning btn-circle pointer-events-none btn-sm">
                      <User size={16} />
                    </div>
                    <span className="font-bold">First Name</span>
                  </div>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="First name"
                    className="input input-bordered w-full rounded-2xl bg-base-100"
                  />
                </motion.label>

                <motion.label
                  variants={fadeUp}
                  className="form-control bg-base-100 border border-base-300 rounded-3xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="btn btn-error btn-circle pointer-events-none btn-sm">
                      <BadgeCheck size={16} />
                    </div>
                    <span className="font-bold">Last Name</span>
                  </div>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="Last name"
                    className="input input-bordered w-full rounded-2xl bg-base-100"
                  />
                </motion.label>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                <motion.label
                  variants={fadeUp}
                  className="form-control bg-base-100 border border-base-300 rounded-3xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="btn btn-primary btn-circle pointer-events-none btn-sm">
                      <Calendar size={16} />
                    </div>
                    <span className="font-bold">Age</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    placeholder="Age"
                    className="input input-bordered w-full rounded-2xl bg-base-100"
                  />
                </motion.label>

                <motion.label
                  variants={fadeUp}
                  className="form-control bg-base-100 border border-base-300 rounded-3xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="btn btn-warning btn-circle pointer-events-none btn-sm">
                      <Ruler size={16} />
                    </div>
                    <span className="font-bold">Height (cm)</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    placeholder="Height"
                    className="input input-bordered w-full rounded-2xl bg-base-100"
                  />
                </motion.label>

                <motion.label
                  variants={fadeUp}
                  className="form-control bg-base-100 border border-base-300 rounded-3xl p-5 sm:col-span-2 xl:col-span-1"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="btn btn-primary btn-circle pointer-events-none btn-sm">
                      <Weight size={16} />
                    </div>
                    <span className="font-bold">Weight (kg)</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={formData.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    placeholder="Weight"
                    className="input input-bordered w-full rounded-2xl bg-base-100"
                  />
                </motion.label>
              </motion.div>

              {/* Goal */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="bg-base-100 border border-base-300 rounded-3xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="btn btn-success btn-circle pointer-events-none">
                    <Target size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Primary Goal</h3>
                    <p className="text-sm text-base-content/70">
                      Choose the outcome you want FitFlow to optimize around
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={formData.goal}
                    onChange={(e) => handleChange("goal", e.target.value)}
                    className="select select-bordered w-full rounded-2xl bg-base-100 pr-12 capitalize focus:outline-none"
                  >
                    {goalOptions.map((goal) => (
                      <option key={goal} value={goal} className="capitalize">
                        {goal}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-base-content/50">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </motion.div>

              {/* Save */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <button type="submit" className="btn btn-primary btn-lg rounded-full">
                  Save Changes
                  <Save size={18} />
                </button>

                <div className="min-h-[24px] flex items-center">
                  {saved ? (
                    <span className="text-success flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 size={16} />
                      Profile updated successfully
                    </span>
                  ) : (
                    <span className="text-base-content/60 text-sm">
                      Changes update the live preview instantly
                    </span>
                  )}
                </div>
              </motion.div>
            </form>
          </motion.div>

          {/* Live Preview */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            className="space-y-6 xl:sticky xl:top-24"
          >
            <div className="bg-base-200 border border-base-300 rounded-[2rem] p-6 sm:p-7 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-secondary/10 blur-3xl rounded-full" />

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-6">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="avatar">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ring ring-primary ring-offset-base-200 ring-offset-2 shadow-lg">
                        <img
                          src={
                            formData.profilePicture ||
                            "https://placehold.co/300x300?text=Profile"
                          }
                          alt={fullName}
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold break-words">
                        {fullName}
                      </h2>
                      <p className="text-base-content/70 text-sm sm:text-base capitalize">
                        {formData.goal || "Set your goal"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="badge badge-primary badge-outline">
                          Live Preview
                        </span>
                        <span className="badge badge-success gap-2">
                          <Activity size={12} />
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="self-start">
                    <div
                      className="radial-progress text-primary bg-base-100 border border-base-300"
                      style={{
                        "--value": profileCompletion,
                        "--size": "4.75rem",
                        "--thickness": "8px",
                      }}
                      role="progressbar"
                    >
                      <span className="text-sm font-bold">{profileCompletion}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Age",
                      value: formData.age || "--",
                      icon: <Calendar size={16} />,
                      color: "btn-primary",
                    },
                    {
                      label: "Height",
                      value: formData.height ? `${formData.height} cm` : "--",
                      icon: <Ruler size={16} />,
                      color: "btn-warning",
                    },
                    {
                      label: "Weight",
                      value: formData.weight ? `${formData.weight} kg` : "--",
                      icon: <Weight size={16} />,
                      color: "btn-primary",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-base-100 border border-base-300 rounded-3xl p-4 min-w-0"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`btn btn-sm btn-circle pointer-events-none ${item.color}`}>
                          {item.icon}
                        </div>
                        <span className="text-sm text-base-content/70">
                          {item.label}
                        </span>
                      </div>
                      <p className="text-lg sm:text-xl font-bold break-words">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-[2rem] p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-primary" size={20} />
                <h3 className="font-bold text-xl">Goal Focus</h3>
              </div>
              <p className="text-lg font-semibold capitalize mb-2">
                {formData.goal || "Not selected"}
              </p>
              <p className="text-sm text-base-content/70 leading-relaxed">
                Your selected goal shapes how future recommendations,
                progression logic, and workout planning can be personalized.
              </p>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-[2rem] p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="text-secondary" size={20} />
                <h3 className="font-bold text-xl">Smart Snapshot</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "BMI", value: bmi },
                  { label: "Completion", value: `${profileCompletion}%` },
                  { label: "Age", value: formData.age || "--" },
                  { label: "Weight", value: formData.weight ? `${formData.weight} kg` : "--" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-base-100 border border-base-300 rounded-2xl p-4"
                  >
                    <p className="text-xs text-base-content/60 mb-1">{item.label}</p>
                    <p className="font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-success text-success-content rounded-[2rem] p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={20} />
                <h3 className="font-bold text-lg">Profile Ready</h3>
              </div>
              <p className="opacity-90 text-sm sm:text-base leading-relaxed">
                A complete profile makes your app experience feel more
                personal, intelligent, and visually polished.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Profile;