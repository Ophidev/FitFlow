import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  History,
  LayoutList,
  Play,
  RefreshCcw,
  Timer,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { motion, AnimatePresence } from "framer-motion";

const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const container = "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

const getTodayKey = () =>
  new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase();

const titleCase = (value) =>
  String(value || "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatWeekday = (value) => titleCase(value || "today");

const formatDuration = (seconds) => {
  const totalSeconds = Number(seconds || 0);
  if (!totalSeconds) return "0 min";
  const minutes = Math.round(totalSeconds / 60);
  return `${minutes} min`;
};

const formatDate = (date) => {
  if (!date) return "Not recorded";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const getWorkoutTitle = (workoutDay) =>
  workoutDay?.title || workoutDay?.workoutDay || workoutDay?.name || "Workout";

const getWorkoutId = (workoutDay) =>
  workoutDay?._id || workoutDay?.id || workoutDay?.workoutDayId;

const normalizeSchedule = (items = []) =>
  items.reduce((acc, item) => {
    const key = String(item?.weekday || "").toLowerCase();
    if (!key) return acc;

    const workoutDay = item?.workoutDayId || item?.workoutDay || item;

    acc[key] = {
      ...item,
      workoutDayId: getWorkoutId(workoutDay),
      workoutName: getWorkoutTitle(workoutDay),
    };

    return acc;
  }, {});

const DashboardSkeleton = () => (
  <section className="min-h-screen bg-base-100 py-6 sm:py-8 lg:py-10">
    <div className={`${container} space-y-6 lg:space-y-8`}>
      <div className="skeleton h-32 w-full rounded-box" />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="skeleton h-[360px] w-full rounded-box" />
        <div className="skeleton h-[360px] w-full rounded-box" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="skeleton h-32 rounded-box" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="skeleton h-[420px] rounded-box" />
        <div className="skeleton h-[420px] rounded-box" />
      </div>
    </div>
  </section>
);

const EmptyDashboardState = ({
  workoutDaysCount,
  scheduledCount,
  hasExercise,
}) => {
  const checklist = [
    { label: "Create Workout Day", done: workoutDaysCount > 0 },
    { label: "Add Exercises", done: hasExercise },
    { label: "Assign Schedule", done: scheduledCount > 0 },
  ];

  return (
    <section className="min-h-screen bg-base-100 py-8 sm:py-10 lg:py-12">
      <div className={`${container} flex min-h-[72vh] items-center`}>
        <div className="w-full overflow-hidden rounded-box border border-base-300 bg-base-200 shadow-xl">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex min-h-[280px] items-center justify-center bg-primary p-8 text-primary-content sm:min-h-[340px] lg:min-h-full">
              <div className="relative grid aspect-square w-full max-w-xs place-items-center rounded-full border border-primary-content/30">
                <div className="absolute inset-8 rounded-full border border-primary-content/20" />
                <Dumbbell size={86} strokeWidth={1.5} />
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <span className="badge badge-primary badge-outline mb-5">
                Setup required
              </span>

              <h1 className="max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
                Your workout system isn&apos;t ready yet
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-base-content/70">
                Create workout days, add exercises, and assign them to weekdays
                before starting your training journey.
              </p>

              <div className="mt-8 grid gap-3">
                {checklist.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-box border border-base-300 bg-base-100 p-4"
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                        item.done
                          ? "bg-success text-success-content"
                          : "bg-base-300 text-base-content/50"
                      }`}
                    >
                      <CheckCircle2 size={18} />
                    </span>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>

              <Link to="/planner" className="btn btn-primary btn-lg mt-8">
                Go To Planner
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DashboardHero = ({
  suggestion,
  todaySchedule,
  isStarting,
  onStartWorkout,
  activeSession,
}) => {
  const hasActive = Boolean(activeSession);
  const workoutTitle = hasActive
    ? activeSession?.workoutLog?.workoutDayId?.title || activeSession?.workoutLog?.workoutDay?.title || "Active Workout"
    : suggestion?.workoutDay;
  const hasWorkout = hasActive || Boolean(suggestion?.workoutDay);

  return (
    <section className="overflow-hidden rounded-box border border-base-300 bg-base-200 shadow-xl relative">
      {hasActive && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent animate-pulse" />
      )}

      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {hasActive ? (
                <>
                  <span className="badge badge-error gap-1.5 animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-error-content" />
                    In Progress
                  </span>
                  <span className="badge badge-secondary badge-outline">
                    Active Session
                  </span>
                </>
              ) : (
                <>
                  <span className="badge badge-primary badge-outline">
                    Today&apos;s Workout
                  </span>
                  <span className="badge badge-secondary badge-outline">
                    {formatWeekday(suggestion?.weekday || getTodayKey())}
                  </span>
                </>
              )}
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-base-content">
              {hasWorkout ? titleCase(workoutTitle) : "Rest Day"}
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-base-content/70 sm:text-base lg:text-lg">
              {hasActive
                ? `Your session for ${titleCase(workoutTitle)} is active. Resume the workout now to complete your sets and track your progress.`
                : hasWorkout
                ? `${formatWeekday(
                    suggestion?.weekday,
                  )} is ready. Open the session when you are set to train and keep momentum on your side.`
                : "No workout scheduled today. Use the time to recover, stretch, or prepare for your next training session."}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {hasWorkout && (
              <button
                type="button"
                onClick={onStartWorkout}
                disabled={isStarting || (!hasActive && !todaySchedule?.workoutDayId)}
                className={`btn btn-lg ${hasActive ? 'btn-error' : 'btn-primary'}`}
              >
                {isStarting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <Play size={18} />
                )}
                {hasActive ? "Resume Workout" : "Start Workout"}
              </button>
            )}

            <Link to="/planner" className="btn btn-secondary btn-lg">
              Open Planner
              <LayoutList size={18} />
            </Link>
          </div>
        </div>

        <div className="flex min-h-[260px] items-center justify-center bg-base-300/40 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-base-300">
          <div className="grid w-full max-w-md gap-4">
            <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className={`grid h-12 w-12 place-items-center rounded-full text-primary-content ${hasActive ? 'bg-error text-error-content animate-pulse' : 'bg-primary'}`}>
                  <Sparkles size={20} />
                </span>
                <div>
                  <p className="text-sm text-base-content/60">Status</p>
                  <h3 className="text-xl font-black">
                    {hasActive ? "Active Session" : hasWorkout ? "Ready To Train" : "Recovery Mode"}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-base-content/60">Selected</span>
                <span className="font-bold">
                  {hasWorkout ? titleCase(workoutTitle) : "Rest Day"}
                </span>
              </div>

              <div className="divider my-3" />

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-base-content/60">Weekday</span>
                <span className="font-bold">
                  {formatWeekday(suggestion?.weekday || getTodayKey())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ title, value, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="rounded-box border border-base-300 bg-base-200 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
    <div className="flex items-start justify-between gap-4 relative z-10">
      <div className="min-w-0">
        <p className="text-xs text-base-content/60 font-semibold tracking-wide uppercase">{title}</p>
        <p className="mt-3 truncate text-2xl font-black sm:text-3xl text-base-content tracking-tight">
          {value || "Not yet"}
        </p>
      </div>

      <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-content shrink-0 transition duration-300 group-hover:scale-110">
        {icon}
      </span>
    </div>
  </motion.div>
);

const DashboardStats = ({ history, lastWorkout }) => (
  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <StatCard
      title="Total Workouts"
      value={history.length}
      icon={<Activity size={19} />}
      delay={0.1}
    />
    <StatCard
      title="Last Workout"
      value={lastWorkout?.workoutDay && titleCase(lastWorkout.workoutDay)}
      icon={<Dumbbell size={19} />}
      delay={0.15}
    />
    <StatCard
      title="Last Duration"
      value={
        lastWorkout?.duration ? formatDuration(lastWorkout.duration) : null
      }
      icon={<Clock3 size={19} />}
      delay={0.2}
    />
    <StatCard
      title="Sets Completed"
      value={lastWorkout?.totalSetsCompleted ?? null}
      icon={<CheckCircle2 size={19} />}
      delay={0.25}
    />
  </section>
);

const WeeklySchedule = ({ scheduleByDay }) => {
  const today = getTodayKey();

  return (
    <section className="rounded-box border border-base-300 bg-base-200 p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="text-primary" size={22} />
          <div>
            <h2 className="text-2xl font-black">Weekly Schedule</h2>
            <p className="text-sm text-base-content/60">
              Your planned training rhythm for the week.
            </p>
          </div>
        </div>

        <span className="badge badge-primary badge-outline w-fit">
          7 Day View
        </span>
      </div>

      {/* Mobile stacked cards */}
      <div className="grid gap-3 sm:hidden">
        {weekdays.map((day) => {
          const item = scheduleByDay[day];
          const isToday = day === today;

          return (
            <div
              key={day}
              className={`rounded-box border p-4 transition duration-300 ${
                isToday
                  ? "border-primary bg-primary text-primary-content shadow-lg"
                  : "border-base-300 bg-base-100"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm opacity-80">
                    {isToday ? "Today" : "Scheduled"}
                  </p>
                  <h3 className="text-lg font-black">{formatWeekday(day)}</h3>
                </div>

                {isToday && <span className="badge badge-neutral">Today</span>}
              </div>

              <div className="mt-4 rounded-box bg-black/5 p-3">
                <p className="text-xs uppercase tracking-wide opacity-70">
                  Workout
                </p>
                <p className="mt-1 text-base font-bold leading-tight">
                  {item?.workoutName ? titleCase(item.workoutName) : "Rest Day"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tablet/Desktop responsive grid */}
      <div className="hidden gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-7">
        {weekdays.map((day) => {
          const item = scheduleByDay[day];
          const isToday = day === today;

          return (
            <div
              key={day}
              className={`rounded-box border p-4 transition duration-300 hover:-translate-y-1 hover:shadow-md ${
                isToday
                  ? "border-primary bg-primary text-primary-content shadow-lg"
                  : "border-base-300 bg-base-100"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-black">{formatWeekday(day)}</p>
                {isToday && <span className="badge badge-neutral">Today</span>}
              </div>

              <div
                className={`mt-6 rounded-box p-3 ${
                  isToday ? "bg-primary-content/10" : "bg-base-200"
                }`}
              >
                <p
                  className={`text-xs uppercase tracking-wide ${
                    isToday ? "text-primary-content/80" : "text-base-content/50"
                  }`}
                >
                  Workout
                </p>
                <p
                  className={`mt-2 text-lg font-bold leading-tight ${
                    isToday ? "text-primary-content" : "text-base-content"
                  }`}
                >
                  {item?.workoutName ? titleCase(item.workoutName) : "Rest Day"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const RecentActivity = ({ history }) => {
  const recent = history.slice(0, 5);

  return (
    <section className="rounded-box border border-base-300 bg-base-200 p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <History className="text-primary" size={22} />
        <div>
          <h2 className="text-2xl font-black">Recent Activity</h2>
          <p className="text-sm text-base-content/60">
            Latest completed workout logs.
          </p>
        </div>
      </div>

      {recent.length === 0 ? (
        <div className="rounded-box border border-dashed border-base-300 bg-base-100 p-8 text-center">
          <Timer className="mx-auto text-base-content/40" size={34} />
          <p className="mt-3 font-semibold">No completed workouts yet</p>
          <p className="mt-1 text-sm text-base-content/60">
            Finished sessions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map((item, index) => (
            <div
              key={`${item?.workoutDay}-${item?.date}-${index}`}
              className="flex gap-4 rounded-box border border-base-300 bg-base-100 p-4"
            >
              <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success text-success-content">
                <CheckCircle2 size={18} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                  <h3 className="font-bold">{titleCase(item?.workoutDay)}</h3>
                  <span className="text-sm text-base-content/60">
                    {formatDate(item?.date)}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="badge badge-primary badge-outline">
                    {formatDuration(item?.duration)}
                  </span>
                  <span className="badge badge-secondary badge-outline">
                    {item?.totalSetsCompleted ?? 0} sets
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const InsightCard = ({ suggestion, history }) => {
  const totalWorkouts = history.length;
  const latest = history[0];
  const today = formatWeekday(getTodayKey());

  return (
    <section className="rounded-box border border-base-300 bg-base-200 p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <TrendingUp className="text-primary" size={22} />
        <div>
          <h2 className="text-2xl font-black">Quick Insights</h2>
          <p className="text-sm text-base-content/60">
            Small signals that keep you moving.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="rounded-box border border-base-300 bg-base-100 p-4">
          <p className="text-sm text-base-content/60">Today</p>
          <p className="mt-1 font-bold">
            {suggestion?.workoutDay
              ? `${today}: ${titleCase(suggestion.workoutDay)}`
              : `${today}: Rest Day`}
          </p>
        </div>

        <div className="rounded-box border border-base-300 bg-base-100 p-4">
          <p className="text-sm text-base-content/60">Consistency</p>
          <p className="mt-1 font-bold">
            {totalWorkouts > 0
              ? `${totalWorkouts} workouts logged so far`
              : "No workouts logged yet"}
          </p>
        </div>

        <div className="rounded-box border border-base-300 bg-base-100 p-4">
          <p className="text-sm text-base-content/60">Last Session</p>
          <p className="mt-1 font-bold">
            {latest?.workoutDay
              ? `${titleCase(latest.workoutDay)} • ${formatDate(latest.date)}`
              : "No recent session"}
          </p>
        </div>
      </div>
    </section>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [dashboardData, setDashboardData] = useState({
    suggestion: null,
    lastWorkout: null,
    history: [],
    schedule: [],
    workoutDays: [],
    hasExercise: false,
    activeSession: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [suggestion, last, history, schedule, days, active] = await Promise.all([
        axios.get(`${BASE_URL}/workout/suggestion`, {
          withCredentials: true,
        }),
        axios.get(`${BASE_URL}/workout/last`, {
          withCredentials: true,
        }),
        axios.get(`${BASE_URL}/workout/history`, {
          withCredentials: true,
        }),
        axios.get(`${BASE_URL}/schedule/view`, {
          withCredentials: true,
        }),
        axios.get(`${BASE_URL}/workout/days`, {
          withCredentials: true,
        }),
        axios.get(`${BASE_URL}/workout/active`, {
          withCredentials: true,
        }),
      ]);

      const workoutDays = days?.data?.data || [];

      const exerciseChecks = await Promise.allSettled(
        workoutDays.map((day) =>
          axios.get(`${BASE_URL}/exercise/${day?._id}`, {
            withCredentials: true,
          }),
        ),
      );

      const hasExercise = exerciseChecks.some(
        (result) =>
          result.status === "fulfilled" &&
          (result.value?.data?.data || []).length > 0,
      );

      const activeSession = active?.data?.workoutLog ? active.data : null;

      setDashboardData({
        suggestion: suggestion?.data?.data || null,
        lastWorkout: Array.isArray(last?.data?.data)
          ? null
          : last?.data?.data || null,
        history: history?.data?.data || [],
        schedule: schedule?.data?.data || [],
        workoutDays,
        hasExercise,
        activeSession,
      });
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError("We couldn't load your dashboard right now.");
      toast.error("Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const scheduleByDay = useMemo(
    () => normalizeSchedule(dashboardData.schedule),
    [dashboardData.schedule],
  );

  const todaySchedule = scheduleByDay[getTodayKey()];
  const hasExercise = dashboardData.hasExercise;

  const isSetupComplete =
    dashboardData.workoutDays.length > 0 &&
    dashboardData.schedule.length > 0 &&
    hasExercise;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const handleStartWorkout = async () => {
    if (dashboardData.activeSession) {
      navigate("/workout/live", {
        state: dashboardData.activeSession,
      });
      return;
    }

    if (!todaySchedule?.workoutDayId) {
      toast.error("Workout day ID is missing for today's schedule.");
      return;
    }

    try {
      setIsStarting(true);

      const response = await axios.post(
        `${BASE_URL}/workout/start`,
        { workoutDayId: todaySchedule.workoutDayId },
        { withCredentials: true },
      );

      const sessionPayload = response?.data;

      if (!sessionPayload?.workoutLog) {
        toast.error("Workout session data was not received. Please try again.");
        return;
      }

      toast.success(
        sessionPayload?.resume
          ? "Workout resumed successfully"
          : "Workout started successfully",
      );
      navigate("/workout/live", {
        state: sessionPayload,
      });
    } catch (err) {
      console.error("Failed to start workout:", err);

      const errorMessage =
        err?.response?.data?.message || "Failed to start workout";

      if (errorMessage === "Finish current workout before starting another") {
        toast.info("Opening your current active workout");
        navigate("/workout/live");
        return;
      }

      toast.error(errorMessage);
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <DashboardSkeleton />
      </>
    );
  }

  if (!isSetupComplete) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <EmptyDashboardState
          workoutDaysCount={dashboardData.workoutDays.length}
          scheduledCount={dashboardData.schedule.length}
          hasExercise={hasExercise}
        />
      </>
    );
  }

  return (
    <section className="min-h-screen bg-base-100 py-6 text-base-content sm:py-8 lg:py-10">
      <Toaster position="top-right" richColors />

      <div className={`${container} space-y-6 lg:space-y-8`}>
        <header className="rounded-box border border-base-300 bg-base-200 p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-base font-semibold text-base-content/60">
                {greeting},
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                {titleCase(user?.firstName || "Athlete")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-base-content/65 sm:text-base">
                Stay close to the plan, complete the work, and let consistency do
                the compounding.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/planner" className="btn btn-secondary">
                <LayoutList size={18} />
                Planner
              </Link>

              {error && (
                <button
                  type="button"
                  onClick={fetchDashboard}
                  className="btn btn-outline"
                >
                  <RefreshCcw size={17} />
                  Retry
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="alert alert-warning mt-5">
              <span>{error}</span>
            </div>
          )}
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <DashboardHero
            suggestion={dashboardData.suggestion}
            todaySchedule={todaySchedule}
            isStarting={isStarting}
            onStartWorkout={handleStartWorkout}
            activeSession={dashboardData.activeSession}
          />
          <InsightCard
            suggestion={dashboardData.suggestion}
            history={dashboardData.history}
          />
        </div>

        <DashboardStats
          history={dashboardData.history}
          lastWorkout={dashboardData.lastWorkout}
        />

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <WeeklySchedule scheduleByDay={scheduleByDay} />
          <RecentActivity history={dashboardData.history} />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
