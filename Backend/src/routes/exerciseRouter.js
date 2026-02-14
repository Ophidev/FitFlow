const express = require("express");
const userAuth = require("../middlewares/auth.js");
const WorkoutDays = require("../models/workoutDays.js");
const Exercises = require("../models/exercises.js");
const { validateEditExerciseData } = require("../utils/validation.js");

const exerciseRouter = express.Router();


exerciseRouter.post("/exercise", userAuth, async (req,res) => {

    try {

        const loggedInUser = req.user;
        const {workoutDayId, exerciseName, sets, reps, restTime, notes} = req.body;

        const checkWorkoutDayId = await WorkoutDays.findOne({
            _id : workoutDayId,
            userId : loggedInUser._id,
        });

        if (!checkWorkoutDayId) {
            throw new Error ("!workout Day not found!!!");
        }

        const exerciseInstance = new Exercises({
            userId : loggedInUser._id,
            workoutDayId,
            exerciseName,
            sets,
            reps,
            restTime,
            notes
        });

        await exerciseInstance.save();

        res.status(201).send("exersice saved successfully!!");

    } catch(err) {
        res.status(400).send("ERROR inside /exercise: "+ err.message);
    }

});

exerciseRouter.get("/exercise/:dayId", userAuth, async (req,res) => {

    try {
        const loggedInUser = req.user;
        const workoutDayId = req.params.dayId;

        const workoutDay = await WorkoutDays.findOne({
            _id : workoutDayId,
            userId : loggedInUser._id,
        });

        if(!workoutDay){
            throw new Error("! Workout Day not found!!");
        }

        const exercisesOfDay = await Exercises.find({
            userId : loggedInUser._id,
            workoutDayId : workoutDayId,
        });

        res.status(201).json({
            "message" : "!!successfully fetched Exercises of a Day",
            "data" : exercisesOfDay,
        });

    } catch(err) {
        res.status(400).send("ERROR inside /exercise/:dayId: "+ err.message);
    }
    
});

exerciseRouter.patch("/exercise/:id", userAuth, async (req,res) => {
    
    try {

        if(!validateEditExerciseData(req)) {
            throw new Error ("!Invalid Edit Reqest!!!")
        };

        const loggedInUser = req.user;
        const exerciseId = req.params.id;

        const exercise = await Exercises.findOne({
            _id : exerciseId,
            userId : loggedInUser._id,
        });

        if (!exercise) {
            throw new Error ("!! Exercise not found!!");
        }

        Object.keys(req.body).forEach(
            (key) => exercise[key] = req.body[key]
        );

        const updatedExercise = await exercise.save();

        res.status(201).json({
            "message" : `!successfully update exercise`,
            "data" : updatedExercise,
        });

    } catch(err){
        res.status(400).send("ERROR inside /exercise/:id: "+ err.message);
    }

});

exerciseRouter.delete("/exercise/:id", userAuth, async (req,res) => {

    try {

       const loggedInUser = req.user;
       const exerciseId = req.params.id;

       const deletedExercise = await Exercises.findOneAndDelete({
            _id : exerciseId,
            userId : loggedInUser._id,
       });

       if (!deletedExercise) {
            throw new Error ("!Exercise not found!!!");
       };

       res.status(201).json({
        message: "Exercise deleted successfully",
        data: deletedExercise,
       });

    } catch(err){
        res.status(400).send("ERROR inside delete /exercise/:id: "+ err.message);
    }

});

module.exports = exerciseRouter;
