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
                // convert elapsed time ms → seconds (rounded down)

            await activeWorkout.save();

            // Now handling set which is started but never finished because workoutDay auto skip

            // 1 find all set of this workout
            const incompleteSets = await SetLogs.find({
                workoutLogId: activeWorkout._id,
                userId: loggedInUser._id,
                completedAt: { $exists: false }
            });

            // 2 updating incomplete sets
            for (const set of incompleteSets) {
                const timeTaken = Math.floor((now - set.startedAt) / 1000);

                set.completedAt = now;
                set.timeTaken = timeTaken;

                await set.save();
            }
        }

        // fetch exercises for new workout
        const allExercises = await Exercises.find({
            workoutDayId: workoutDayId,
            userId: loggedInUser._id,
        });

        if (!allExercises.length) {
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

        console.log("🎂 workoutLogId : ", workoutLogId);
        console.log("🎂 exerId : ", exerciseId);
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
            userId: loggedInUser._id,
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
       /* Check if there is any set in this workout that has started but not completed
          If found, block starting a new set to prevent multiple active sets */
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

workoutExecutionRouter.post("/workout/set/complete", userAuth, async (req,res) => {

    try {

        const loggedInUser = req.user;
        const {workoutLogId, exerciseId, setNumber} = req.body;

        // flow of /workout/set/complete
        /*
        1: Validate workoutLog is active
        2: Validate exercise belongs to workout
        3: Validate setNumber range
        4: Find the active set
        5: Calculate time taken
        6: complete the set
        7: Update workout progress
        */

        // 1 Validate workout is active 
        const activeWorkoutLog = await WorkoutLog.findOne({
            _id: workoutLogId,
            userId: loggedInUser._id,
            status: "in_progress"
        });

        console.log("✅",activeWorkoutLog);

        if(!activeWorkoutLog) {
            return res.status(404).json({
                 message: "!No active workout!!" 
            });
        }

        // 2 Validate exercise belongs to workout
        const exercise = await Exercises.findOne({
            _id: exerciseId,
            workoutDayId: activeWorkoutLog?.workoutDayId,
            userId: loggedInUser._id
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

        // 4 Find the active set
        const setLog = await SetLogs.findOne({
            userId: loggedInUser._id,
            workoutLogId: activeWorkoutLog._id,
            exerciseId: exercise._id,
            setNumber: setNumber,
        });

        // Case 1 — Set Not Started Yet
        if (!setLog) {
            return res.status(404).json({
                message: "Set not started yet"
            })
        }
        
        // Case 2 — Set Already Completed
        if (setLog.completedAt) {
            return res.status(409).json({
                message: "Set already completed"
            });
        }

        // 5 Calculate time taken
        const now = new Date();

        const timeTaken = Math.floor((now - setLog.startedAt) / 1000);

        setLog.completedAt = now;
        setLog.timeTaken = timeTaken;

        // 6 update setLog
        await setLog.save();

        // 7 update workout progress
        await WorkoutLog.findByIdAndUpdate(
            workoutLogId,
            {$inc: { totalSetsCompleted: 1}}
        );

        return res.status(200).json({
            message: "Set completed successfully",
            setLog
        });

    } catch(err){

        res.status(400).send("ERROR inside /workout/set/complete : ", err.message);
    }

});

module.exports = workoutExecutionRouter;