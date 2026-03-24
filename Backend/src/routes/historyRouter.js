const express = require("express");
const userAuth = require("../middlewares/auth.js");
const WorkoutLog = require("../models/workoutLogs.js");
const WorkoutSchedule = require("../models/workoutSchedule.js");

const historyRouter = express.Router();

historyRouter.get("/workout/history", userAuth, async (req, res) => {

  try {
    const loggedInUser = req.user;

    //1. Fetch completed workouts
    const workoutLogs = await WorkoutLog.find({
      userId: loggedInUser._id,
      status: "completed",
    })
      .populate("workoutDayId", "title") // populate only title
      .sort({ date: -1 }); // latest first

    //2. Handle empty history
    if (!workoutLogs.length) {
      return res.status(200).json({
        message: "No workout history found",
        data: [],
      });
    }

    //3. Format clean response
    const formattedHistory = workoutLogs.map((log) => ({
      workoutDay: log.workoutDayId?.title || "Unknown",
      date: log.date,
      duration: log.totalDuration,
      totalSetsCompleted: log.totalSetsCompleted,
    }));

    //4. Send response
    res.status(200).json({
      message: "Workout history fetched successfully",
      data: formattedHistory,
    });
  } catch (error) {
    console.error("Error fetching workout history:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }

});

historyRouter.get("/workout/last", userAuth, async (req, res) => {

  try {
    const loggedInUser = req.user;

    //1. Fetch last workout
    const workoutLog = await WorkoutLog.findOne({
      userId: loggedInUser._id,
      status: "completed",
    })
      .sort({ date: -1 })
      .populate("workoutDayId", "title");

    //2.handle empty workout history
    if (!workoutLog) {
      return res.status(200).json({
        message: "No previous workout found",
        data: [],
      });
    }

    // 3. Format clean response
    const formattedWorkout = {
      workoutDay: workoutLog.workoutDayId?.title || "Unknown",
      date: workoutLog.date,
      duration: workoutLog.totalDuration,
      totalSetsCompleted: workoutLog.totalSetsCompleted,
    };

    // 4. Send response
    res.status(200).json({
      message: "Last workout fetched successfully",
      data: formattedWorkout,
    });

  } catch (error) {
    console.error("Error fetching workout last:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

historyRouter.get("/workout/suggestion", userAuth, async (req, res) => {

/*
    Client
       ↓
    GET /workout/suggestion
       ↓
    Auth Middleware
       ↓
    Get today's weekday
       ↓
    WorkoutSchedule (Scheduling Layer)
       ↓
    WorkoutDay (Planning Layer)
       ↓
    Return suggestion
*/

    try {
        const loggedInUser = req.user;

        // 1. Get today's weekday
        const today = new Date()
            .toLocaleString("en-US", { weekday: "long" })
            .toLowerCase();

        // 2. Find schedule (Scheduling Layer)
        const schedule = await WorkoutSchedule.findOne({
            userId: loggedInUser._id,
            weekday: today
        }).populate("workoutDayId", "title");

        // 3. If no schedule
        if (!schedule) {
            return res.status(200).json({
                message: "No workout scheduled for today",
                data: null
            });
        }

        // 4. Format response
        const response = {
            workoutDay: schedule.workoutDayId?.title || "Unknown",
            weekday: today
        };

        // 5. Return response
        res.status(200).json({
            message: "Workout suggestion fetched successfully",
            data: response
        });

    } catch (error) {
        console.error("Error fetching workout suggestion:", error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});

module.exports = historyRouter;
