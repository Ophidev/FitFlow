const express = require("express");
const userAuth = require("../middlewares/auth.js");
const WorkoutDays = require("../models/workoutDays.js");
const WorkoutSchedule = require("../models/workoutSchedule.js");

const workoutDayRouter = express.Router();

workoutDayRouter.post("/workout/day", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user; // loggedInUser from userAuth
    const { title } = req.body;

    if (!title) {
      throw new Error("!please Enter workout day!!");
    }

    const workoutDaysInstance = new WorkoutDays({
      userId: loggedInUser._id,
      title,
    });

    const savedWorkoutDayData = await workoutDaysInstance.save();

    res.status(200).json({
      message: "✅ Workout day added successfuly!",
    });
  } catch (err) {
    res.status(400).send("ERROR : inside /workout/day " + err.message);
  }
});

workoutDayRouter.get("/workout/days", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const workoutDays = await WorkoutDays.find({
      userId: loggedInUser._id,
    })
      .select("_id title createdAt updatedAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "✅ workout days fetched successfully!",
      data: workoutDays,
    });
  } catch (err) {
    res.status(400).send("ERROR : inside /workout/days" + err.message);
  }
});

workoutDayRouter.delete("/workout/day/:id", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const workoutDayId = req.params.id;

    // Step 1: Verify workout day exists
    const workoutDay = await WorkoutDays.findOne({
      _id: workoutDayId,
      userId: loggedInUser._id,
    });

    if (!workoutDay) {
      throw new Error("❌ No workout day found!");
    }

    /*
      PROBLEM:
      ----------
      Workout schedules store references to workoutDayId.

      Example:
      Monday   -> Push Day (id: 123)
      Thursday -> Push Day (id: 123)

      If Push Day is deleted without removing these schedule entries,
      orphaned schedule documents remain in the database.

      On next page load:
      WorkoutSchedule.find(...).populate("workoutDayId")

      will return:
      {
        weekday: "monday",
        workoutDayId: null
      }

      causing inconsistent backend data and frontend state.

      SOLUTION:
      ----------
      Remove all schedule entries pointing to this workout day
      before deleting the workout day itself.
    */

    // Step 2: Delete all schedule mappings associated with this workout day.
    // Prevents orphaned WorkoutSchedule records after the workout day is removed.
    await WorkoutSchedule.deleteMany({
      workoutDayId: workoutDayId,
      userId: loggedInUser._id,
    });

    // Step 3: Delete workout day
    const deleteResult = await WorkoutDays.deleteOne({
      _id: workoutDayId,
      userId: loggedInUser._id,
    });

    if (deleteResult.deletedCount === 0) {
      throw new Error("❌ Deletion failed!");
    }

    res.status(200).json({
      message: `${workoutDay.title} deleted successfully`,
    });
  } catch (err) {
    res.status(400).send("ERROR inside /workout/day/:id : " + err.message);
  }
});

module.exports = workoutDayRouter;
