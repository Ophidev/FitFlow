const express = require("express");
const userAuth = require("../middlewares/auth.js");
const WorkoutSchedule = require("../models/workoutSchedule.js");
const { validateWorkoutScheduleData } = require("../utils/validation.js");

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

scheduleRouter.get("/schedule/view", userAuth, async (req, res) => {

    try {

        const loggedInUser = req.user;
        
        const workoutSchedule = await WorkoutSchedule.find({
            userId: loggedInUser._id
        }).populate("workoutDayId");

        res.status(200).json({
            "message": "!successfully fetched workout schedule",
            "data": workoutSchedule
        });

    } catch(err) {
        res.send("ERROR : inside /schedule/view "+ err.message);
    }

});

scheduleRouter.patch("/schedule/:scheduleId", userAuth, async (req, res) => {

    try {

        if(!validateWorkoutScheduleData(req)) {
            throw new Error ("!!Invalid edit request!!!");
        }
        const loggedInUser = req.user;
        const scheduleId = req.params.scheduleId;

        const workoutSchedule = await WorkoutSchedule.findOne({
            _id: scheduleId,
            userId: loggedInUser._id,
        });

        if(!workoutSchedule) {
            throw new Error ("!!Schedule not found!!");
        }

        Object.keys(req.body).forEach(
            (key) => workoutSchedule[key] = req.body[key] 
        );
        
        const updatedSchedule = await workoutSchedule.save();

        res.status(200).json({
            "message" : `!successfully update schedule`,
            "data" : updatedSchedule,
        });

    } catch(err) {
        res.send("ERROR inside schedule/update : "+ err.message);
    }

});

scheduleRouter.delete("/schedule/:scheduleId", userAuth, async (req, res) => {

    try {

        const loggedInUser = req.user;

        const scheduleId = req.params.scheduleId;

        const DeletedWorkoutSchedule = await WorkoutSchedule.findOneAndDelete({
            _id: scheduleId,
            userId: loggedInUser._id
        });

        if(!DeletedWorkoutSchedule) {
            throw new Error ("!Schedule not found!!");
        }
        
        res.status(200).json({
            message: "Schedule deleted successfully",
            data: DeletedWorkoutSchedule,
       });

    } catch(err) {
        res.status(400).send("ERROR inside delete /schedule/:scheduleId : "+ err.message);
    }

}); 

module.exports = scheduleRouter;