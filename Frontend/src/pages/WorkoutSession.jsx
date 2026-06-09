import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Toaster, toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Dumbbell,
  Lock,
  Pause,
  Play,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { BASE_URL } from "../utils/constants";

const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  if (hours > 0) return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  return `${paddedMinutes}:${paddedSeconds}`;
};

const getElapsedSeconds = (
  startedAt,
  totalPausedDuration = 0,
  pausedAt = null,
) => {
  if (!startedAt) return 0;

  const startMs = new Date(startedAt).getTime();
  const pausedSeconds = Number(totalPausedDuration || 0);
  const endMs = pausedAt ? new Date(pausedAt).getTime() : Date.now();

  return Math.max(0, Math.floor((endMs - startMs) / 1000) - pausedSeconds);
};

const getWorkoutName = (workoutLog, exercisesList, workoutDay) =>
  workoutDay?.title ||
  workoutLog?.workoutDayId?.title ||
  workoutLog?.workoutDay?.title ||
  exercisesList?.[0]?.workoutDayTitle ||
  "Workout Session";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data ||
  error?.message ||
  fallback;

const WorkoutSession = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [workoutLog, setWorkoutLog] = useState(null);
  const [exercisesList, setExercisesList] = useState([]);
  const [isResume, setIsResume] = useState(false);
  const [sessionDay, setSessionDay] = useState(null);

  const [completedSets, setCompletedSets] = useState({});
  const [activeSet, setActiveSet] = useState(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [activeSetTimer, setActiveSetTimer] = useState(0);
  const [restTimer, setRestTimer] = useState({
    secondsLeft: 0,
    totalSeconds: 0,
    nextExerciseIndex: null,
    nextSetNumber: null,
    isComplete: false,
  });

  const [summary, setSummary] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const [isStartingSet, setIsStartingSet] = useState(false);
  const [isCompletingSet, setIsCompletingSet] = useState(false);
  const [isCompletingWorkout, setIsCompletingWorkout] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isPausingWorkout, setIsPausingWorkout] = useState(false);
  const [isResumingWorkout, setIsResumingWorkout] = useState(false);

  const initializeSessionStates = (data) => {
    const log = data.workoutLog;
    const list = data.exercisesList || [];
    const sets = data.completedSets || [];

    setWorkoutLog(log);
    setExercisesList(list);
    setIsResume(Boolean(data.resume));
    setSessionDay(data.workoutDay || log?.workoutDayId || null);

    const completed = {};
    sets.forEach((setLog) => {
      if (!setLog?.completedAt) return;

      const exerciseId =
        typeof setLog?.exerciseId === "object"
          ? String(setLog?.exerciseId?._id || "")
          : String(setLog?.exerciseId || "");

      const setNumber = Number(setLog?.setNumber);

      if (!exerciseId || !setNumber) return;

      completed[`${exerciseId}-${setNumber}`] = {
        completedAt: setLog.completedAt,
        setLogId: setLog._id,
      };
    });
    setCompletedSets(completed);

    const active = sets.find((setLog) => !setLog?.completedAt);

    if (active) {
      const activeExerciseId =
        typeof active?.exerciseId === "object"
          ? String(active?.exerciseId?._id || "")
          : String(active?.exerciseId || "");

      setActiveSet({
        setLogId: active?._id,
        exerciseId: activeExerciseId,
        setNumber: Number(active?.setNumber),
        startedAt: active?.startedAt,
        pausedAt: active?.pausedAt || null,
        totalPausedDuration: Number(active?.totalPausedDuration || 0),
      });

      setActiveSetTimer(
        getElapsedSeconds(
          active?.startedAt,
          active?.totalPausedDuration,
          active?.pausedAt,
        ),
      );
    } else {
      setActiveSet(null);
      setActiveSetTimer(0);
    }

    setWorkoutTimer(
      getElapsedSeconds(
        log?.startedAt,
        log?.totalPausedDuration,
        log?.pausedAt,
      ),
    );
  };

  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        setIsLoadingSession(true);

        if (location.state?.workoutLog) {
          initializeSessionStates(location.state);
          setIsLoadingSession(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/workout/active`, {
          withCredentials: true,
        });

        if (response?.data?.workoutLog) {
          initializeSessionStates(response.data);
        } else {
          setWorkoutLog(null);
          setExercisesList([]);
        }
      } catch (err) {
        console.error("Failed to load workout session:", err);
        toast.error("Failed to load active workout session");
      } finally {
        setIsLoadingSession(false);
      }
    };

    fetchActiveSession();
  }, [location.state]);

  const workoutLogId = workoutLog?._id;
  const workoutName = getWorkoutName(workoutLog, exercisesList, sessionDay);
  const isWorkoutPaused = workoutLog?.status === "paused";

  const totalSets = useMemo(
    () =>
      exercisesList.reduce(
        (sum, exercise) => sum + Math.max(0, Number(exercise?.sets) || 0),
        0,
      ),
    [exercisesList],
  );

  const completedSetCount = Object.keys(completedSets).length;

  const progressPercent = totalSets
    ? Math.min(100, Math.round((completedSetCount / totalSets) * 100))
    : 0;

  const remainingSets = Math.max(0, totalSets - completedSetCount);
  const canCompleteWorkout = totalSets > 0 && completedSetCount === totalSets;

  const activeExercise = exercisesList[activeExerciseIndex];

  useEffect(() => {
    if (!workoutLog?.startedAt) return undefined;

    const updateTimers = () => {
      setWorkoutTimer(
        getElapsedSeconds(
          workoutLog?.startedAt,
          workoutLog?.totalPausedDuration,
          workoutLog?.pausedAt,
        ),
      );

      if (activeSet?.startedAt) {
        setActiveSetTimer(
          getElapsedSeconds(
            activeSet?.startedAt,
            activeSet?.totalPausedDuration,
            activeSet?.pausedAt,
          ),
        );
      } else {
        setActiveSetTimer(0);
      }
    };

    updateTimers();
    const intervalId = setInterval(updateTimers, 1000);

    return () => clearInterval(intervalId);
  }, [
    workoutLog?.startedAt,
    workoutLog?.pausedAt,
    workoutLog?.totalPausedDuration,
    activeSet?.startedAt,
    activeSet?.pausedAt,
    activeSet?.totalPausedDuration,
  ]);

  // Rest timer stays informational only. It pauses visually when workout is paused.
  useEffect(() => {
    if (isWorkoutPaused) return undefined;
    if (!restTimer.secondsLeft || restTimer.isComplete) return undefined;

    const intervalId = setInterval(() => {
      setRestTimer((current) => {
        if (current.secondsLeft <= 1) {
          return {
            ...current,
            secondsLeft: 0,
            isComplete: true,
          };
        }

        return {
          ...current,
          secondsLeft: current.secondsLeft - 1,
        };
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [restTimer.secondsLeft, restTimer.isComplete, isWorkoutPaused]);

  useEffect(() => {
    const firstIncompleteIndex = exercisesList.findIndex((exercise) => {
      const sets = Number(exercise?.sets) || 0;

      return Array.from({ length: sets }).some((_, index) => {
        const setNumber = index + 1;
        return !completedSets[`${exercise?._id}-${setNumber}`];
      });
    });

    if (firstIncompleteIndex >= 0 && !activeSet) {
      setActiveExerciseIndex(firstIncompleteIndex);
    }
  }, [activeSet, completedSets, exercisesList]);

  const getSetKey = (exerciseId, setNumber) => `${exerciseId}-${setNumber}`;

  const getExerciseCompletedCount = (exercise) => {
    const sets = Number(exercise?.sets) || 0;

    return Array.from({ length: sets }).filter((_, index) => {
      const setNumber = index + 1;
      return completedSets[getSetKey(exercise?._id, setNumber)];
    }).length;
  };

  const getNextSetForExercise = (exercise) => {
    const sets = Number(exercise?.sets) || 0;

    for (let index = 0; index < sets; index += 1) {
      const setNumber = index + 1;
      if (!completedSets[getSetKey(exercise?._id, setNumber)]) {
        return setNumber;
      }
    }

    return null;
  };

  const getNextTargetAfterSet = (exerciseIndex, setNumber) => {
    const currentExercise = exercisesList[exerciseIndex];
    const currentExerciseSets = Number(currentExercise?.sets) || 0;

    if (setNumber < currentExerciseSets) {
      return {
        exerciseIndex,
        setNumber: setNumber + 1,
      };
    }

    for (
      let index = exerciseIndex + 1;
      index < exercisesList.length;
      index += 1
    ) {
      const nextSet = getNextSetForExercise(exercisesList[index]);

      if (nextSet) {
        return {
          exerciseIndex: index,
          setNumber: nextSet,
        };
      }
    }

    return {
      exerciseIndex: null,
      setNumber: null,
    };
  };

  const isExerciseComplete = (exercise) =>
    getExerciseCompletedCount(exercise) >= (Number(exercise?.sets) || 0);

  const isExerciseLocked = (index) => {
    if (index <= activeExerciseIndex) return false;
    return !isExerciseComplete(exercisesList[index - 1]);
  };

  const handleStartSet = async (exercise, exerciseIndex, setNumber) => {
    if (!workoutLogId) {
      toast.error("Workout session data is missing.");
      return;
    }

    if (isWorkoutPaused) {
      toast.error("Resume workout to continue.");
      return;
    }

    if (activeSet) {
      toast.error("Complete the active set before starting another.");
      return;
    }

    try {
      setIsStartingSet(true);

      const response = await axios.post(
        `${BASE_URL}/workout/set/start`,
        {
          workoutLogId,
          exerciseId: exercise._id,
          setNumber,
        },
        { withCredentials: true },
      );

      const setLog = response?.data?.setLog;

      setActiveExerciseIndex(exerciseIndex);
      setActiveSet({
        setLogId: setLog?._id,
        exerciseId: String(exercise._id),
        setNumber,
        startedAt: setLog?.startedAt || new Date().toISOString(),
        pausedAt: setLog?.pausedAt || null,
        totalPausedDuration: Number(setLog?.totalPausedDuration || 0),
      });

      setRestTimer({
        secondsLeft: 0,
        totalSeconds: 0,
        nextExerciseIndex: null,
        nextSetNumber: null,
        isComplete: false,
      });

      toast.success(response?.data?.resume ? "Set resumed" : "Set started");
    } catch (error) {
      console.error("Failed to start set:", error);
      toast.error(getErrorMessage(error, "Failed to start set"));
    } finally {
      setIsStartingSet(false);
    }
  };

  const handleCompleteSet = async () => {
    if (!activeSet || !workoutLogId) return;

    if (isWorkoutPaused) {
      toast.error("Resume workout to continue.");
      return;
    }

    try {
      setIsCompletingSet(true);

      await axios.post(
        `${BASE_URL}/workout/set/complete`,
        {
          workoutLogId,
          exerciseId: activeSet.exerciseId,
          setNumber: activeSet.setNumber,
        },
        { withCredentials: true },
      );

      const completedKey = getSetKey(activeSet.exerciseId, activeSet.setNumber);
      const completedExerciseIndex = exercisesList.findIndex(
        (exercise) => String(exercise?._id) === String(activeSet.exerciseId),
      );
      const completedExercise = exercisesList[completedExerciseIndex];
      const nextTarget = getNextTargetAfterSet(
        completedExerciseIndex,
        activeSet.setNumber,
      );

      setCompletedSets((current) => ({
        ...current,
        [completedKey]: {
          completedAt: new Date().toISOString(),
          setLogId: activeSet.setLogId,
        },
      }));

      setActiveSet(null);
      setActiveSetTimer(0);

      if (nextTarget.exerciseIndex !== null) {
        setActiveExerciseIndex(nextTarget.exerciseIndex);
      }

      const restSeconds = Number(completedExercise?.restTime) || 0;
      setRestTimer({
        secondsLeft: restSeconds,
        totalSeconds: restSeconds,
        nextExerciseIndex: nextTarget.exerciseIndex,
        nextSetNumber: nextTarget.setNumber,
        isComplete: restSeconds === 0,
      });

      toast.success("Set completed");
    } catch (error) {
      console.error("Failed to complete set:", error);
      toast.error(getErrorMessage(error, "Failed to complete set"));
    } finally {
      setIsCompletingSet(false);
    }
  };

  const handlePauseWorkout = async () => {
    if (!workoutLogId) {
      toast.error("Workout session data is missing.");
      return;
    }

    try {
      setIsPausingWorkout(true);

      const response = await axios.post(
        `${BASE_URL}/workout/pause`,
        { workoutLogId },
        { withCredentials: true },
      );

      if (response?.data?.workoutLog) {
        setWorkoutLog(response.data.workoutLog);
      }

      if (response?.data?.activeSet) {
        setActiveSet((prev) =>
          prev
            ? {
                ...prev,
                pausedAt: response.data.activeSet.pausedAt,
                totalPausedDuration: Number(
                  response.data.activeSet.totalPausedDuration || 0,
                ),
              }
            : prev,
        );
      }

      toast.success("Workout paused");
    } catch (error) {
      console.error("Failed to pause workout:", error);
      toast.error(getErrorMessage(error, "Failed to pause workout"));
    } finally {
      setIsPausingWorkout(false);
    }
  };

  const handleResumeWorkout = async () => {
    if (!workoutLogId) {
      toast.error("Workout session data is missing.");
      return;
    }

    try {
      setIsResumingWorkout(true);

      const response = await axios.post(
        `${BASE_URL}/workout/resume`,
        { workoutLogId },
        { withCredentials: true },
      );

      if (response?.data?.workoutLog) {
        initializeSessionStates(response.data);
      }

      toast.success("Workout resumed");
    } catch (error) {
      console.error("Failed to resume workout:", error);
      toast.error(getErrorMessage(error, "Failed to resume workout"));
    } finally {
      setIsResumingWorkout(false);
    }
  };

  const handleCompleteWorkout = async () => {
    if (!workoutLogId) {
      toast.error("Workout session data is missing.");
      return;
    }

    if (!canCompleteWorkout) {
      toast.error(
        `Complete all planned sets first. ${remainingSets} set${
          remainingSets === 1 ? "" : "s"
        } remaining.`,
      );
      return;
    }

    try {
      setIsCompletingWorkout(true);

      const response = await axios.post(
        `${BASE_URL}/workout/complete`,
        { workoutLogId },
        { withCredentials: true },
      );

      const completedWorkoutLog = response?.data?.workoutLog || {};

      setSummary({
        workoutName,
        duration: completedWorkoutLog?.totalDuration ?? workoutTimer,
        totalSetsCompleted:
          completedWorkoutLog?.totalSetsCompleted ?? completedSetCount,
        totalExercises: exercisesList.length,
      });

      setShowSummaryModal(true);
      toast.success("Workout completed");
    } catch (error) {
      console.error("Failed to complete workout:", error);
      toast.error(getErrorMessage(error, "Failed to complete workout"));
    } finally {
      setIsCompletingWorkout(false);
    }
  };

  const canStartSet = (exercise, exerciseIndex, setNumber) => {
    const previousSetComplete =
      setNumber === 1 ||
      completedSets[getSetKey(exercise?._id, setNumber - 1)];

    return (
      !activeSet &&
      !isWorkoutPaused &&
      !completedSets[getSetKey(exercise?._id, setNumber)] &&
      !isExerciseLocked(exerciseIndex) &&
      previousSetComplete
    );
  };

  if (isLoadingSession) {
    return (
      <section className="min-h-screen bg-base-100 py-6 sm:py-8 lg:py-10">
        <Toaster position="top-right" richColors />
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="skeleton h-28 w-full rounded-box" />
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <div className="skeleton h-32 w-full rounded-box" />
              <div className="skeleton h-[360px] w-full rounded-box" />
            </div>
            <div className="skeleton h-[400px] w-full rounded-box" />
          </div>
        </div>
      </section>
    );
  }

  if (!workoutLog || exercisesList.length === 0) {
    return (
      <section className="min-h-screen bg-base-100 p-4 text-base-content sm:p-6">
        <Toaster position="top-right" richColors />
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-box border border-base-300 bg-base-200 p-6 text-center shadow-xl sm:p-8">
            <Dumbbell className="mx-auto text-primary" size={48} />
            <h1 className="mt-5 text-3xl font-black">No active workout</h1>
            <p className="mx-auto mt-3 max-w-xl text-base-content/70">
              Start a workout from the dashboard so this execution screen can
              receive the session data.
            </p>
            <Link to="/dashboard" className="btn btn-primary mt-6">
              Back To Dashboard
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-base-100 pb-28 text-base-content">
      <Toaster position="top-right" richColors />

      <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="btn btn-ghost btn-circle shrink-0"
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-black sm:text-3xl">
                    {workoutName}
                  </h1>

                  {isResume && (
                    <span className="badge badge-secondary badge-outline">
                      Resumed
                    </span>
                  )}

                  {isWorkoutPaused && (
                    <span className="badge badge-warning">Paused</span>
                  )}
                </div>

                <p className="mt-1 text-sm text-base-content/60">
                  {completedSetCount} / {totalSets} Sets Completed
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[auto_1fr] lg:min-w-[420px]">
              <div className="rounded-box border border-base-300 bg-base-200 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-base-content/50">
                  Workout Timer
                </p>
                <p className="mt-1 text-2xl font-black tabular-nums">
                  {formatTime(workoutTimer)}
                </p>
              </div>

              <div className="rounded-box border border-base-300 bg-base-200 px-4 py-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-wide text-base-content/50">
                    Progress
                  </p>
                  <p className="text-sm font-bold">{progressPercent}%</p>
                </div>
                <progress
                  className="progress progress-primary h-3 w-full"
                  value={progressPercent}
                  max="100"
                />
              </div>
            </div>
          </div>

          {isWorkoutPaused && (
            <div className="alert alert-warning mt-4">
              <Pause size={18} />
              <span>
                Workout is paused. Both workout time and active set time are
                frozen until you resume.
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="space-y-4">
          <section className="rounded-box border border-base-300 bg-base-200 p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-base-content/60">
                  Total Workout Progress
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  {completedSetCount} of {totalSets} sets completed
                </h2>
                {!canCompleteWorkout && totalSets > 0 && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-warning">
                    <AlertCircle size={16} />
                    {remainingSets} set{remainingSets === 1 ? "" : "s"} remaining
                    before workout completion.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-box bg-base-100 px-4 py-3">
                <Trophy className="text-primary" size={22} />
                <span className="font-bold tabular-nums">
                  {formatTime(workoutTimer)}
                </span>
              </div>
            </div>

            <progress
              className="progress progress-primary mt-5 h-4 w-full"
              value={progressPercent}
              max="100"
            />
          </section>

          {exercisesList.map((exercise, exerciseIndex) => {
            const sets = Number(exercise?.sets) || 0;
            const reps = Number(exercise?.reps) || 0;
            const completedForExercise = getExerciseCompletedCount(exercise);
            const exerciseComplete = completedForExercise === sets;
            const currentExercise = exerciseIndex === activeExerciseIndex;
            const locked = isExerciseLocked(exerciseIndex);
            const nextSet = getNextSetForExercise(exercise);

            return (
              <article
                key={exercise?._id || exerciseIndex}
                className={`rounded-box border p-4 shadow-sm transition-all duration-300 sm:p-5 ${
                  exerciseComplete
                    ? "border-success bg-success/10"
                    : currentExercise
                      ? "border-primary bg-base-200 shadow-xl"
                      : "border-base-300 bg-base-200 opacity-90"
                } ${locked ? "opacity-60" : ""}`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black">
                        {exercise?.exerciseName || `Exercise ${exerciseIndex + 1}`}
                      </h2>

                      {exerciseComplete && (
                        <span className="badge badge-success">
                          Exercise Completed
                        </span>
                      )}

                      {currentExercise && !exerciseComplete && (
                        <span className="badge badge-primary">Current</span>
                      )}

                      {locked && (
                        <span className="badge badge-neutral gap-1">
                          <Lock size={12} />
                          Locked
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="badge badge-primary badge-outline">
                        {sets} Sets
                      </span>
                      <span className="badge badge-secondary badge-outline">
                        {reps} Reps
                      </span>
                      <span className="badge badge-ghost">
                        {Number(exercise?.restTime) || 0}s Rest
                      </span>
                    </div>

                    {exercise?.notes && !exerciseComplete && (
                      <p className="mt-4 max-w-2xl rounded-box border border-base-300 bg-base-100 p-3 text-sm text-base-content/70">
                        {exercise.notes}
                      </p>
                    )}
                  </div>

                  <div className="rounded-box border border-base-300 bg-base-100 px-4 py-3 text-sm">
                    <p className="text-base-content/60">Sets</p>
                    <p className="mt-1 text-xl font-black">
                      {completedForExercise} / {sets}
                    </p>
                    {exerciseComplete && (
                      <p className="mt-1 text-success">
                        Total Reps: {sets * reps}
                      </p>
                    )}
                  </div>
                </div>

                {!exerciseComplete && !locked && (
                  <div className="mt-5 grid gap-4">
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: sets }).map((_, index) => {
                        const setNumber = index + 1;
                        const key = getSetKey(exercise?._id, setNumber);
                        const completed = completedSets[key];
                        const active =
                          activeSet?.exerciseId === String(exercise?._id) &&
                          activeSet?.setNumber === setNumber;
                        const pending =
                          !completed && !active && setNumber !== nextSet;

                        return (
                          <span
                            key={key}
                            className={`badge min-h-10 rounded-full px-4 text-sm ${
                              completed
                                ? "badge-success"
                                : active
                                  ? "badge-primary"
                                  : pending
                                    ? "badge-neutral badge-outline"
                                    : "badge-neutral"
                            }`}
                          >
                            Set {setNumber}
                          </span>
                        );
                      })}
                    </div>

                    {currentExercise &&
                    activeSet?.exerciseId === String(exercise?._id) ? (
                      <div className="rounded-box border border-primary bg-base-100 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-base-content/60">
                              Current Set
                            </p>
                            <h3 className="mt-1 text-2xl font-black">
                              Set {activeSet.setNumber}
                            </h3>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="rounded-box bg-base-200 px-4 py-3">
                              <p className="text-xs uppercase tracking-wide text-base-content/50">
                                Live Timer
                              </p>
                              <p className="mt-1 text-2xl font-black tabular-nums">
                                {formatTime(activeSetTimer)}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={handleCompleteSet}
                              disabled={isCompletingSet || isWorkoutPaused}
                              className="btn btn-success"
                            >
                              {isCompletingSet ? (
                                <span className="loading loading-spinner loading-sm" />
                              ) : (
                                <CheckCircle2 size={18} />
                              )}
                              Complete Set
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleStartSet(exercise, exerciseIndex, nextSet)
                        }
                        disabled={
                          isStartingSet ||
                          !canStartSet(exercise, exerciseIndex, nextSet)
                        }
                        className="btn btn-primary w-full sm:w-fit"
                      >
                        {isStartingSet && currentExercise ? (
                          <span className="loading loading-spinner loading-sm" />
                        ) : (
                          <Play size={18} />
                        )}
                        Start Set {nextSet}
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-32 lg:h-fit">
          <section className="rounded-box border border-base-300 bg-base-200 p-5 shadow-xl">
            <div className="flex items-center gap-3">
              <Clock3 className="text-primary" size={22} />
              <div>
                <p className="text-sm text-base-content/60">Active Exercise</p>
                <h2 className="text-xl font-black">
                  {activeExercise?.exerciseName || "Workout Complete"}
                </h2>
              </div>
            </div>

            <div className="divider" />

            {restTimer.totalSeconds > 0 || restTimer.isComplete ? (
              <div className="rounded-box border border-base-300 bg-base-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-base-content/60">
                      {restTimer.isComplete ? "Rest Complete" : "Rest Time"}
                    </p>
                    <h3 className="mt-1 text-3xl font-black tabular-nums">
                      {restTimer.isComplete
                        ? "Ready"
                        : formatTime(restTimer.secondsLeft)}
                    </h3>
                  </div>
                  <RotateCcw className="text-secondary" size={28} />
                </div>

                <progress
                  className="progress progress-secondary mt-4 h-3 w-full"
                  value={
                    restTimer.totalSeconds
                      ? restTimer.totalSeconds - restTimer.secondsLeft
                      : 100
                  }
                  max={restTimer.totalSeconds || 100}
                />

                <p className="mt-3 text-sm text-base-content/70">
                  {restTimer.nextSetNumber
                    ? `Next Set: ${restTimer.nextSetNumber}`
                    : "Ready For Next Set"}
                </p>
              </div>
            ) : (
              <div className="rounded-box border border-dashed border-base-300 bg-base-100 p-4 text-sm text-base-content/70">
                Rest timer starts automatically after each completed set.
              </div>
            )}
          </section>

          <section className="rounded-box border border-base-300 bg-base-200 p-5 shadow-xl">
            <p className="text-sm text-base-content/60">Session Snapshot</p>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <span>Exercises</span>
                <span className="font-bold">{exercisesList.length}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Total Sets</span>
                <span className="font-bold">{totalSets}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Completed</span>
                <span className="font-bold">{completedSetCount}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Remaining</span>
                <span className="font-bold">{remainingSets}</span>
              </div>
            </div>
          </section>

          <section className="rounded-box border border-base-300 bg-base-200 p-5 shadow-xl">
            <p className="text-sm text-base-content/60">Workout Controls</p>
            <div className="mt-4">
              {isWorkoutPaused ? (
                <button
                  type="button"
                  onClick={handleResumeWorkout}
                  disabled={isResumingWorkout}
                  className="btn btn-primary w-full"
                >
                  {isResumingWorkout ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <Play size={18} />
                  )}
                  Resume Workout
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePauseWorkout}
                  disabled={isPausingWorkout || isCompletingWorkout}
                  className="btn btn-outline w-full"
                >
                  {isPausingWorkout ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <Pause size={18} />
                  )}
                  Pause Workout
                </button>
              )}
            </div>
          </section>
        </aside>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-base-300 bg-base-100/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-base-content/50">
              Workout Time
            </p>
            <p className="text-2xl font-black tabular-nums">
              {formatTime(workoutTimer)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {!canCompleteWorkout && totalSets > 0 && (
              <p className="text-sm text-base-content/60">
                Complete {remainingSets} more set
                {remainingSets === 1 ? "" : "s"} to finish this workout.
              </p>
            )}

            <button
              type="button"
              onClick={handleCompleteWorkout}
              disabled={
                isCompletingWorkout || isWorkoutPaused || !canCompleteWorkout
              }
              className="btn btn-success btn-lg"
            >
              {isCompletingWorkout ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <Trophy size={20} />
              )}
              Complete Workout
            </button>
          </div>
        </div>
      </footer>

      {showSummaryModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-xl">
            <div className="grid place-items-center rounded-box bg-success p-8 text-success-content">
              <Trophy size={56} />
              <h2 className="mt-4 text-center text-3xl font-black">
                Workout Completed
              </h2>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-box border border-base-300 bg-base-200 p-4">
                <p className="text-sm text-base-content/60">Workout Name</p>
                <p className="mt-1 text-xl font-black">
                  {summary?.workoutName}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-box border border-base-300 bg-base-200 p-4">
                  <p className="text-sm text-base-content/60">Duration</p>
                  <p className="mt-1 text-lg font-black">
                    {formatTime(summary?.duration)}
                  </p>
                </div>

                <div className="rounded-box border border-base-300 bg-base-200 p-4">
                  <p className="text-sm text-base-content/60">Sets</p>
                  <p className="mt-1 text-lg font-black">
                    {summary?.totalSetsCompleted}
                  </p>
                </div>

                <div className="rounded-box border border-base-300 bg-base-200 p-4">
                  <p className="text-sm text-base-content/60">Exercises</p>
                  <p className="mt-1 text-lg font-black">
                    {summary?.totalExercises}
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="btn btn-ghost"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="btn btn-primary"
              >
                Back To Dashboard
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="modal-backdrop" />
        </div>
      )}
    </section>
  );
};

export default WorkoutSession;