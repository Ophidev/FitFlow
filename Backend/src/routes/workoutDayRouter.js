const express = require("express");
const userAuth = require("../middlewares/auth.js");
const WorkoutDays = require("../models/workoutDays.js");

const workoutDayRouter = express.Router();

workoutDayRouter.post("/workout/day", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user; // loggedInUser from userAuth
    const { title } = req.body;

    if (!title) {
      throw new Error("!please Enter workout day!!");
    }

    const workoutDaysInstance = new WorkoutDays({
      userId: loggedInUser,
      title,
    });

    const savedWorkoutDayData = await workoutDaysInstance.save();

    res.status(200).json({
        "message" : "✅ Workout day added successfuly!",
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
        .sort({ createdAt: -1});

        
        res.status(200).json({
            "message" : "✅ workout days fetched successfully!",
            "data" : workoutDays
        });
    }
    catch (err) {
        res.status(400).send("ERROR : inside /workout/days"+ err.message);
    }
    

});

workoutDayRouter.delete("/workout/day/:id", userAuth, async (req, res) => {
    
    try {
        const loggedInUser = req.user;
        const workoutDayId = req.params.id;

        const workoutDay = await WorkoutDays.findById(workoutDayId);

        if (!workoutDay) {
            throw new Error ("❌ no workout day found!!");
        }

        const deleteResult = await WorkoutDays.deleteOne({
            $and: [
                {_id: workoutDayId},
                {userId: loggedInUser._id}
            ],
        });

        if (deleteResult?.deletedCount === 0) {
            throw new Error (" ❌ Deletion failed!! no workout day found!!");
        }
        
        res.status(201).send(`${workoutDay?.title} successfully Deleted!!`);

    } catch(err) {
        res.status(400).send("ERROR : inside /workout/day/:id "+ err.message);
    }
});

module.exports = workoutDayRouter;
