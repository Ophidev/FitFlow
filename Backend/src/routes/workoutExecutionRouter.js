const express = require("express");
const userAuth = require("../middlewares/auth.js");
const WorkoutDays = require("../models/workoutDays.js");
const WorkoutLog = require("../models/workoutLogs.js");
const Exercises = require("../models/exercises.js");
const SetLogs = require("../models/setLogs.js");

const workoutExecutionRouter = express.Router();

workoutExecutionRouter.post("/workout/start", userAuth, async (req,res) => {

    try {

        //data need
        const loggedInUser = req.user; //current loggedInUser
        const { workoutDayId } = req.body; // from frontend

        // validate workout day ownership
        const workoutDay = await WorkoutDays.findOne({
            _id: workoutDayId,
            userId: loggedInUser._id,
        });
        
        if (!workoutDay) {
            throw new Error ("!! Workout day not found !!!");
        }

        // prepare today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const now = new Date(); //current date and time

        // check for active workout
        const activeWorkout = await WorkoutLog.findOne({
            userId: loggedInUser._id,
            status: "in_progress"
        }).sort({ createdAt: -1});

        // Active workout exists
        if (activeWorkout) {

            const activeDate = new Date(activeWorkout.date);
            activeDate.setHours(0, 0, 0, 0);

            // CASE A - same day -> resume
            if (activeDate.getTime() === today.getTime()) {

                const exercisesList = await Exercises.find({
                    workoutDayId: activeWorkout.workoutDayId,
                    userId: loggedInUser._id
                });

                const completedSets = await SetLogs.find({
                    workoutLogId: activeWorkout._id,
                    userId: loggedInUser._id
                });

                return res.status(200).json({
                    message: "Resuming workout",
                    workoutLog: activeWorkout,
                    exercisesList,
                    completedSets,
                    resume: true
                });
            }

            // CASE B - Old day -> auto skip
            activeWorkout.status = "skipped";
            activeWorkout.completedAt = now;
            activeWorkout.totalDuration = 
                Math.floor((now - activeWorkout.startedAt) / 1000);

                await activeWorkout.save();
        }

        // fetch exeercises for new workout
        const allExercises = await Exercises.find({
            workoutDayId: workoutDayId,
            userId: loggedInUser._id,
        });

        if (allExercises.length === 0) {
            return res.status(400).send("!No Exercises found for workout day");
        }

        const workoutLogInstance = new WorkoutLog({
            userId: loggedInUser._id,
            workoutDayId,
            date: today,
            startedAt: now,
            totalExercises: allExercises.length,
            totalSetsCompleted: 0,
            status: "in_progress"
        });

        const savedWorkoutLogInstance = await workoutLogInstance.save();

        res.status(201).json({
            "message": "Workout Started",
            "workoutLog": savedWorkoutLogInstance,
            "exercisesList": allExercises,
            "resume": false
        });

    } catch(err) {
        res.status(400).send("ERROR inside /workout/start : "+ err.message);
    }

});

workoutExecutionRouter.post("/workout/set/start", userAuth, async (req,res) => {

    try {

        const loggedInUser = req.user;
        const {workoutLogId, exerciseId, setNumber} = req.body;

        // 1 validating active workout log
        const activeWorkoutLog = await WorkoutLog.findOne({
            _id: workoutLogId,
            userId: loggedInUser._id,
            status: "in_progress",
        });

        if(!activeWorkoutLog) {
            return res.status(404).json({ 
                message: "!No new Active workout Log found !!" 
            });
        }

        // 2 validate exercise belongs to this workout
        const exercise = await Exercises.findOne({
            _id: exerciseId,
            workoutDayId: activeWorkoutLog?.workoutDayId,
            userId: loggedInUser?._id
        });

        if(!exercise) {
             return res.status(404).json({
                 message: "!Exercise is not found for active workout Log!!" 
            });
        }

        // 3️ Validate setNumber range
        if (setNumber < 1 || setNumber > exercise.sets) {
            return res.status(400).json({
                message: "Invalid set number"
            });
        }

        // 4 prevent duplicate same set
        const existingSet = await SetLogs.findOne({
            workoutLogId,
            exerciseId,
            setNumber
        });

        if (existingSet) {
            return res.status(409).json({
                message: "This set has already been started"
            });
        }

       // 5 Prevent multiple active sets
        const activeSet = await SetLogs.findOne({
            workoutLogId,
            userId: loggedInUser._id,
            completedAt: { $exists: false }
        });

        if (activeSet) {
            return res.status(409).json({
                message: "Another set is already in progress"
            });
        }

        // 6 Create new SetLog
        const newSetLog = await SetLogs.create({
            userId: loggedInUser._id,
            workoutLogId,
            exerciseId,
            setNumber,
            startedAt: new Date()
        });

        return res.status(201).json({
            message: "Set started successfully",
            setLog: newSetLog
        });


    } catch(err) {
        res.status(400).send("ERROR : inside /workout/set/start "+ err.message);
    }

});

module.exports = workoutExecutionRouter;