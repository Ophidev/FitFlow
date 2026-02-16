const express = require("express");
const userAuth = require("../middlewares/auth.js");
const WorkoutSchedule = require("../models/workoutSchedule.js");

const scheduleRouter = express.Router();

scheduleRouter.post("/schedule/set", userAuth, async (req, res) => {

    try {

        const loggedInUser = req.user;
        const {workoutDayId, weekday} = req.body;

        if(!workoutDayId || !weekday) {
            throw new Error ("!Invalid request");
        }

        const workoutSchedule = await WorkoutSchedule.findOne({
            userId : loggedInUser._id,
            weekday : weekday,
        });

        if (workoutSchedule) {
            throw new Error ("!workout schedule already exists!!");
        }

        const workoutScheduleInstance = new WorkoutSchedule({
            userId : loggedInUser._id,
            workoutDayId,
            weekday,
        });

        await workoutScheduleInstance.save();

        res.send("!successfully added workout schedule!!");

    } catch(err) {
        res.status(400).send("ERROR inside /schedule/set : "+ err.message);
    }

});


module.exports = scheduleRouter;