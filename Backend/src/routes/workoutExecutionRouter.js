const express = require("express");
const userAuth = require("../middlewares/auth.js");
const WorkoutDays = require("../models/workoutDays.js");
const WorkoutLog = require("../models/workoutLogs.js");
const Exercises = require("../models/exercises.js");
const SetLogs = require("../models/setLogs.js");

const workoutExecutionRouter = express.Router();

const getSecondsDifference = (later, earlier) => {
  return Math.max(
    0,
    Math.floor(
      (new Date(later).getTime() - new Date(earlier).getTime()) / 1000,
    ),
  );
};

const getWorkoutDurationExcludingPause = (workoutLog, now) => {
  let pausedSeconds = Number(workoutLog.totalPausedDuration || 0);

  // If somehow workout is still marked paused when duration is calculated,
  // include the currently open pause window too.
  if (workoutLog.pausedAt) {
    pausedSeconds += getSecondsDifference(now, workoutLog.pausedAt);
  }

  return Math.max(
    0,
    getSecondsDifference(now, workoutLog.startedAt) - pausedSeconds,
  );
};

const getSetDurationExcludingPause = (setLog, now) => {
  let pausedSeconds = Number(setLog.totalPausedDuration || 0);

  if (setLog.pausedAt) {
    pausedSeconds += getSecondsDifference(now, setLog.pausedAt);
  }

  return Math.max(
    0,
    getSecondsDifference(now, setLog.startedAt) - pausedSeconds,
  );
};

workoutExecutionRouter.get("/workout/active", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Backend remains source of truth for active resumable session
    const activeWorkout = await WorkoutLog.findOne({
      userId: loggedInUser._id,
      status: { $in: ["in_progress", "paused"] },
    })
      .sort({ createdAt: -1 })
      .populate("workoutDayId", "title");

    if (activeWorkout) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const workoutDate = new Date(activeWorkout.date);
      workoutDate.setHours(0, 0, 0, 0);

      // Workout belongs to a previous day.
      // It should never be resumable.
      if (workoutDate.getTime() !== today.getTime()) {
        const now = new Date();

        activeWorkout.status = "skipped";
        activeWorkout.completedAt = now;
        activeWorkout.totalDuration = getWorkoutDurationExcludingPause(
          activeWorkout,
          now,
        );

        activeWorkout.pausedAt = null;

        await activeWorkout.save();

        const incompleteSets = await SetLogs.find({
          workoutLogId: activeWorkout._id,
          userId: loggedInUser._id,
          completedAt: { $exists: false },
        });

        for (const set of incompleteSets) {
          set.completedAt = now;
          set.timeTaken = getSetDurationExcludingPause(set, now);

          set.pausedAt = null;

          await set.save();
        }

        return res.status(200).json({
          message: "No active workout session",
          workoutLog: null,
          exercisesList: [],
          completedSets: [],
          resume: false,
        });
      }
    }

    if (!activeWorkout) {
      return res.status(200).json({
        message: "No active workout session",
        workoutLog: null,
        exercisesList: [],
        completedSets: [],
        resume: false,
      });
    }

    const exercisesList = await Exercises.find({
      workoutDayId: activeWorkout.workoutDayId,
      userId: loggedInUser._id,
    });

    const completedSets = await SetLogs.find({
      workoutLogId: activeWorkout._id,
      userId: loggedInUser._id,
    });

    return res.status(200).json({
      message: "Active workout session found",
      workoutLog: activeWorkout,
      exercisesList,
      completedSets,
      resume: true,
    });
  } catch (err) {
    res.status(400).send("ERROR inside /workout/active : " + err.message);
  }
});

workoutExecutionRouter.post("/workout/start", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { workoutDayId } = req.body;

    const workoutDay = await WorkoutDays.findOne({
      _id: workoutDayId,
      userId: loggedInUser._id,
    });

    if (!workoutDay) {
      throw new Error("Workout day not found");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const now = new Date();

    // Prevent same workout day from being completed multiple times on same day
    const alreadyCompletedToday = await WorkoutLog.findOne({
      userId: loggedInUser._id,
      workoutDayId,
      date: today,
      status: "completed",
    });

    if (alreadyCompletedToday) {
      return res.status(409).json({
        message: "This workout was already completed today",
        code: "ALREADY_COMPLETED_TODAY",
        workoutLog: alreadyCompletedToday,
      });
    }

    // Any in_progress or paused workout is considered resumable active session
    const activeWorkout = await WorkoutLog.findOne({
      userId: loggedInUser._id,
      status: { $in: ["in_progress", "paused"] },
    }).sort({ createdAt: -1 });

    if (activeWorkout) {
      const activeDate = new Date(activeWorkout.date);
      activeDate.setHours(0, 0, 0, 0);

      // Same-day active session should be resumed, not duplicated
      if (activeDate.getTime() === today.getTime()) {
        if (activeWorkout.workoutDayId.toString() !== workoutDayId) {
          return res.status(400).json({
            message: "Finish current workout before starting another",
          });
        }

        const exercisesList = await Exercises.find({
          workoutDayId: activeWorkout.workoutDayId,
          userId: loggedInUser._id,
        });

        const completedSets = await SetLogs.find({
          workoutLogId: activeWorkout._id,
          userId: loggedInUser._id,
        });

        return res.status(200).json({
          message: "Resuming workout",
          workoutLog: activeWorkout,
          exercisesList,
          completedSets,
          resume: true,
        });
      }

      // Old unfinished workout gets auto-skipped
      activeWorkout.status = "skipped";
      activeWorkout.completedAt = now;
      activeWorkout.totalDuration = getWorkoutDurationExcludingPause(
        activeWorkout,
        now,
      );
      activeWorkout.pausedAt = null;

      await activeWorkout.save();

      const incompleteSets = await SetLogs.find({
        workoutLogId: activeWorkout._id,
        userId: loggedInUser._id,
        completedAt: { $exists: false },
      });

      for (const set of incompleteSets) {
        set.completedAt = now;
        set.timeTaken = getSetDurationExcludingPause(set, now);
        set.pausedAt = null;
        await set.save();
      }
    }

    const allExercises = await Exercises.find({
      workoutDayId,
      userId: loggedInUser._id,
    });

    if (!allExercises.length) {
      return res.status(400).send("No exercises found for this workout day");
    }

    const workoutLogInstance = new WorkoutLog({
      userId: loggedInUser._id,
      workoutDayId,
      date: today,
      startedAt: now,
      totalExercises: allExercises.length,
      totalSetsCompleted: 0,
      status: "in_progress",
      pausedAt: null,
      totalPausedDuration: 0,
    });

    try {
      const savedWorkoutLogInstance = await workoutLogInstance.save();

      // success code
      return res.status(201).json({
        message: "Workout started",
        workoutLog: savedWorkoutLogInstance,
        exercisesList: allExercises,
        resume: false,
      });
    } catch (error) {
      // MongoDB unique index violation
      if (error.code === 11000) {
        return res.status(409).json({
          message:
            "An active workout session already exists. Please resume or complete it first.",
        });
      }

      throw error;
    }
  } catch (err) {
    res.status(400).send("ERROR inside /workout/start : " + err.message);
  }
});

workoutExecutionRouter.post(
  "/workout/set/start",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { workoutLogId, exerciseId, setNumber } = req.body;

      // Only in_progress workout can start/continue set actions
      const activeWorkoutLog = await WorkoutLog.findOne({
        _id: workoutLogId,
        userId: loggedInUser._id,
        status: "in_progress",
      });

      if (!activeWorkoutLog) {
        return res.status(404).json({
          message: "No active workout found or workout is paused",
        });
      }

      const exercise = await Exercises.findOne({
        _id: exerciseId,
        workoutDayId: activeWorkoutLog.workoutDayId,
        userId: loggedInUser._id,
      });

      if (!exercise) {
        return res.status(404).json({
          message: "Exercise not found for this workout",
        });
      }

      if (setNumber < 1 || setNumber > exercise.sets) {
        return res.status(400).json({
          message: "Invalid set number",
        });
      }

      const existingSet = await SetLogs.findOne({
        userId: loggedInUser._id,
        workoutLogId,
        exerciseId,
        setNumber,
      });

      if (existingSet && !existingSet.completedAt) {
        return res.status(200).json({
          message: "Resuming set",
          setLog: existingSet,
          resume: true,
        });
      }

      if (existingSet && existingSet.completedAt) {
        return res.status(409).json({
          message: "Set already completed",
        });
      }

      const activeSet = await SetLogs.findOne({
        workoutLogId,
        userId: loggedInUser._id,
        completedAt: { $exists: false },
      });

      if (activeSet) {
        return res.status(409).json({
          message: "Another set is already in progress",
        });
      }

      try {
        const newSetLog = await SetLogs.create({
          userId: loggedInUser._id,
          workoutLogId,
          exerciseId,
          setNumber,
          startedAt: new Date(),
          pausedAt: null,
          totalPausedDuration: 0,
        });

        return res.status(201).json({
          message: "Set started successfully",
          setLog: newSetLog,
          resume: false,
        });
      } catch (error) {
        // MongoDB blocked another active set
        if (error.code === 11000) {
          return res.status(409).json({
            message: "Another set is already active in this workout",
          });
        }

        throw error;
      }
    } catch (err) {
      res.status(400).send("ERROR : inside /workout/set/start " + err.message);
    }
  },
);

workoutExecutionRouter.post(
  "/workout/set/complete",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { workoutLogId, exerciseId, setNumber } = req.body;

      const activeWorkoutLog = await WorkoutLog.findOne({
        _id: workoutLogId,
        userId: loggedInUser._id,
        status: "in_progress",
      });

      if (!activeWorkoutLog) {
        return res.status(404).json({
          message: "No active workout or workout is paused",
        });
      }

      const exercise = await Exercises.findOne({
        _id: exerciseId,
        workoutDayId: activeWorkoutLog.workoutDayId,
        userId: loggedInUser._id,
      });

      if (!exercise) {
        return res.status(404).json({
          message: "Exercise not found for active workout",
        });
      }

      if (setNumber < 1 || setNumber > exercise.sets) {
        return res.status(400).json({
          message: "Invalid set number",
        });
      }

      const existingSet = await SetLogs.findOne({
        userId: loggedInUser._id,
        workoutLogId: activeWorkoutLog._id,
        exerciseId: exercise._id,
        setNumber,
      });

      if (!existingSet) {
        return res.status(404).json({
          message: "Set not started yet",
        });
      }

      const now = new Date();

      const timeTaken = getSetDurationExcludingPause(existingSet, now);

      // Atomic update.
      // Will only succeed if set is still incomplete.
      const updatedSetLog = await SetLogs.findOneAndUpdate(
        {
          _id: existingSet._id,
          completedAt: { $exists: false },
        },
        {
          $set: {
            completedAt: now,
            timeTaken,
            pausedAt: null,
          },
        },
        {
          new: true,
        },
      );

      if (!updatedSetLog) {
        return res.status(409).json({
          message: "Set already completed",
        });
      }

      await WorkoutLog.findByIdAndUpdate(workoutLogId, {
        $inc: {
          totalSetsCompleted: 1,
        },
      });

      return res.status(200).json({
        message: "Set completed successfully",
        setLog: updatedSetLog,
      });
    } catch (err) {
      res
        .status(400)
        .send("ERROR inside /workout/set/complete : " + err.message);
    }
  },
);

workoutExecutionRouter.post("/workout/complete", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { workoutLogId } = req.body;

    // Business rule: workout can only be completed if all planned sets are done.
    const activeWorkoutLog = await WorkoutLog.findOne({
      _id: workoutLogId,
      userId: loggedInUser._id,
      status: { $in: ["in_progress", "paused"] },
    });

    if (!activeWorkoutLog) {
      return res.status(404).json({
        message: "No active workout found",
      });
    }

    const allExercises = await Exercises.find({
      workoutDayId: activeWorkoutLog.workoutDayId,
      userId: loggedInUser._id,
    });

    const totalPlannedSets = allExercises.reduce((sum, exercise) => {
      return sum + (Number(exercise.sets) || 0);
    }, 0);

    const completedSetsCount = await SetLogs.countDocuments({
      workoutLogId: activeWorkoutLog._id,
      userId: loggedInUser._id,
      completedAt: { $exists: true },
    });

    if (completedSetsCount < totalPlannedSets) {
      return res.status(400).json({
        message: "Cannot complete workout - not all sets are finished",
        code: "INCOMPLETE_SETS",
        totalPlannedSets,
        completedSetsCount,
        remainingSets: totalPlannedSets - completedSetsCount,
      });
    }

    const now = new Date();

    const runningSets = await SetLogs.find({
      workoutLogId,
      userId: loggedInUser._id,
      completedAt: { $exists: false },
    });

    for (const set of runningSets) {
      set.completedAt = now;
      set.timeTaken = getSetDurationExcludingPause(set, now);
      set.pausedAt = null;
      await set.save();
    }

    activeWorkoutLog.completedAt = now;
    activeWorkoutLog.totalDuration = getWorkoutDurationExcludingPause(
      activeWorkoutLog,
      now,
    );
    activeWorkoutLog.status = "completed";
    activeWorkoutLog.pausedAt = null;

    // Ensure aggregate reflects truth from actual completed set count
    activeWorkoutLog.totalSetsCompleted = completedSetsCount;

    await activeWorkoutLog.save();

    return res.status(200).json({
      message: "Workout completed successfully",
      workoutLog: activeWorkoutLog,
    });
  } catch (err) {
    res.status(400).json({
      error: "ERROR inside /workout/complete",
      message: err.message,
    });
  }
});

// Pause whole workout and freeze both workout and active set timers.
workoutExecutionRouter.post("/workout/pause", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { workoutLogId } = req.body;
    const now = new Date();

    const activeWorkout = await WorkoutLog.findOne({
      _id: workoutLogId,
      userId: loggedInUser._id,
      status: "in_progress",
    });

    if (!activeWorkout) {
      return res.status(404).json({
        message: "No active workout found to pause",
      });
    }

    // Prevent duplicate pause calls from reopening pause windows incorrectly
    if (!activeWorkout.pausedAt) {
      activeWorkout.pausedAt = now;
    }

    activeWorkout.status = "paused";
    await activeWorkout.save();

    const activeSet = await SetLogs.findOne({
      workoutLogId: activeWorkout._id,
      userId: loggedInUser._id,
      completedAt: { $exists: false },
    });

    if (activeSet && !activeSet.pausedAt) {
      activeSet.pausedAt = now;
      await activeSet.save();
    }

    return res.status(200).json({
      message: "Workout paused successfully",
      workoutLog: activeWorkout,
      activeSet: activeSet || null,
    });
  } catch (err) {
    res.status(400).json({
      error: "ERROR inside /workout/pause",
      message: err.message,
    });
  }
});

// Resume workout and add paused time into persisted totals for both workout and active set.
workoutExecutionRouter.post("/workout/resume", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { workoutLogId } = req.body;
    const now = new Date();

    const pausedWorkout = await WorkoutLog.findOne({
      _id: workoutLogId,
      userId: loggedInUser._id,
      status: "paused",
    }).populate("workoutDayId", "title");

    if (!pausedWorkout) {
      return res.status(404).json({
        message: "No paused workout found to resume",
      });
    }

    if (pausedWorkout.pausedAt) {
      const pausedSeconds = getSecondsDifference(now, pausedWorkout.pausedAt);
      pausedWorkout.totalPausedDuration =
        Number(pausedWorkout.totalPausedDuration || 0) + pausedSeconds;
    }

    pausedWorkout.pausedAt = null;
    pausedWorkout.status = "in_progress";
    await pausedWorkout.save();

    const activeSet = await SetLogs.findOne({
      workoutLogId: pausedWorkout._id,
      userId: loggedInUser._id,
      completedAt: { $exists: false },
    });

    if (activeSet && activeSet.pausedAt) {
      const pausedSeconds = getSecondsDifference(now, activeSet.pausedAt);
      activeSet.totalPausedDuration =
        Number(activeSet.totalPausedDuration || 0) + pausedSeconds;
      activeSet.pausedAt = null;
      await activeSet.save();
    }

    const exercisesList = await Exercises.find({
      workoutDayId: pausedWorkout.workoutDayId,
      userId: loggedInUser._id,
    });

    const completedSets = await SetLogs.find({
      workoutLogId: pausedWorkout._id,
      userId: loggedInUser._id,
    });

    return res.status(200).json({
      message: "Workout resumed successfully",
      workoutLog: pausedWorkout,
      exercisesList,
      completedSets,
      resume: true,
    });
  } catch (err) {
    res.status(400).json({
      error: "ERROR inside /workout/resume",
      message: err.message,
    });
  }
});

module.exports = workoutExecutionRouter;
