const express = require("express");
const userAuth = require("../middlewares/auth.js");
const WorkoutDays = require("../models/workoutDays.js");
const WorkoutLog = require("../models/workoutLogs.js");
const Exercises = require("../models/exercises.js");
const SetLogs = require("../models/setLogs.js");

const workoutExecutionRouter = express.Router();

workoutExecutionRouter.post("/workout/start", userAuth, async (req, res) => {
    try {

        // STEP 1: Get user & input
        const loggedInUser = req.user;
        const { workoutDayId } = req.body;

        // STEP 2: Validate workout day ownership
        const workoutDay = await WorkoutDays.findOne({
            _id: workoutDayId,
            userId: loggedInUser._id,
        });

        if (!workoutDay) {
            throw new Error("Workout day not found");
        }

        // STEP 3: Prepare date & time
        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize to start of day

        const now = new Date(); // current timestamp

        // STEP 4: Check for existing active workout
        const activeWorkout = await WorkoutLog.findOne({
            userId: loggedInUser._id,
            status: "in_progress"
        }).sort({ createdAt: -1 });


        // STEP 5: Handle existing active workout
        if (activeWorkout) {

            const activeDate = new Date(activeWorkout.date);
            activeDate.setHours(0, 0, 0, 0);

            // CASE A: Same day → Resume
            if (activeDate.getTime() === today.getTime()) {

                // OPTIONAL SAFETY CHECK:
                // Prevent starting different workout on same day
                if (activeWorkout.workoutDayId.toString() !== workoutDayId) {
                    return res.status(400).json({
                        message: "Finish current workout before starting another"
                    });
                }

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

            // CASE B: Old day → Auto skip
            activeWorkout.status = "skipped";
            activeWorkout.completedAt = now;

            // Calculate total duration (seconds)
            activeWorkout.totalDuration = Math.floor(
                (now - activeWorkout.startedAt) / 1000
            );

            await activeWorkout.save();

            // STEP 6: Complete unfinished sets
            const incompleteSets = await SetLogs.find({
                workoutLogId: activeWorkout._id,
                userId: loggedInUser._id,
                completedAt: { $exists: false }
            });

            for (const set of incompleteSets) {
                const timeTaken = Math.floor((now - set.startedAt) / 1000);

                set.completedAt = now;
                set.timeTaken = timeTaken;

                await set.save();
            }
        }

        // STEP 7: Fetch exercises for new workout
        const allExercises = await Exercises.find({
            workoutDayId: workoutDayId,
            userId: loggedInUser._id,
        });

        if (!allExercises.length) {
            return res.status(400).send("No exercises found for this workout day");
        }

        // STEP 8: Create new workout log
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

        // STEP 9: Return response
        res.status(201).json({
            message: "Workout started",
            workoutLog: savedWorkoutLogInstance,
            exercisesList: allExercises,
            resume: false
        });

    } catch (err) {
        res.status(400).send("ERROR inside /workout/start : " + err.message);
    }
});

workoutExecutionRouter.post("/workout/set/start", userAuth, async (req, res) => {
    
    /*
    User clicks start set
       ↓
    Check workout active
       ↓
    Check exercise valid
       ↓
    Check setNumber valid
       ↓
    Check if already exists
       ↓
       → resume OR block OR create
    */
    try {

        // Step 1: Get user and request data
        const loggedInUser = req.user;
        const { workoutLogId, exerciseId, setNumber } = req.body;

        // Step 2: Validate active workout log
        const activeWorkoutLog = await WorkoutLog.findOne({
            _id: workoutLogId,
            userId: loggedInUser._id,
            status: "in_progress",
        });

        if (!activeWorkoutLog) {
            return res.status(404).json({
                message: "No active workout found"
            });
        }

        // Step 3: Validate exercise belongs to this workout
        const exercise = await Exercises.findOne({
            _id: exerciseId,
            workoutDayId: activeWorkoutLog.workoutDayId,
            userId: loggedInUser._id
        });

        if (!exercise) {
            return res.status(404).json({
                message: "Exercise not found for this workout"
            });
        }

        // Step 4: Validate setNumber range
        if (setNumber < 1 || setNumber > exercise.sets) {
            return res.status(400).json({
                message: "Invalid set number"
            });
        }

        // Step 5: Check if same set already exists
        const existingSet = await SetLogs.findOne({
            userId: loggedInUser._id,
            workoutLogId,
            exerciseId,
            setNumber
        });

        // If set already exists and not completed → resume instead of blocking
        if (existingSet && !existingSet.completedAt) {
            return res.status(200).json({
                message: "Resuming set",
                setLog: existingSet,
                resume: true
            });
        }

        // If already completed → block
        if (existingSet && existingSet.completedAt) {
            return res.status(409).json({
                message: "Set already completed"
            });
        }

        // Step 6: Prevent multiple active sets
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

        // Step 7: Create new set log
        const newSetLog = await SetLogs.create({
            userId: loggedInUser._id,
            workoutLogId,
            exerciseId,
            setNumber,
            startedAt: new Date()
        });

        // Step 8: Return response
        return res.status(201).json({
            message: "Set started successfully",
            setLog: newSetLog,
            resume: false
        });

    } catch (err) {
        res.status(400).send("ERROR : inside /workout/set/start " + err.message);
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


        if(!activeWorkoutLog) {
            return res.status(404).json({
                 message: "!No active workout!!" 
            });
        }

        // 2 Validate exercise belongs to workout
        const exercise = await Exercises.findOne({
            _id: exerciseId,
            workoutDayId: activeWorkoutLog.workoutDayId,
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

        res.status(400).send("ERROR inside /workout/set/complete : "+ err.message);
    }

});

workoutExecutionRouter.post("/workout/complete", userAuth, async (req, res) => {

    try {

        // STEP 1: Get logged-in user and workoutLogId from request
        const loggedInUser = req.user;
        const { workoutLogId } = req.body;


        // STEP 2: Validate that the workout is currently active
        // Only an "in_progress" workout can be completed
        const activeWorkoutLog = await WorkoutLog.findOne({
            _id: workoutLogId,
            userId: loggedInUser._id,
            status: "in_progress"
        });

        // If no active workout found → return error
        if (!activeWorkoutLog) {
            return res.status(404).json({
                message: "No active workout found"
            });
        }


        // STEP 3: Get current time (this will be used for completion and duration)
        const now = new Date();


        // STEP 4: Find any sets that were started but never completed
        // These sets must be automatically finished when workout completes
        const runningSets = await SetLogs.find({
            workoutLogId: workoutLogId,
            userId: loggedInUser._id,
            completedAt: { $exists: false }
        });


        // STEP 5: Complete all unfinished sets
        for (const set of runningSets) {

            // Calculate time taken for the set
            const timeTaken = Math.floor((now - set.startedAt) / 1000);

            // Update set fields
            set.completedAt = now;
            set.timeTaken = timeTaken;

            // Save updated set
            await set.save();
        }


        // STEP 6: Calculate total workout duration
        // Duration = current time - workout start time in sec
        const totalDuration = Math.floor(
            (now - activeWorkoutLog.startedAt) / 1000
        );


        // STEP 7: Update workout log to mark workout as completed
        activeWorkoutLog.completedAt = now;
        activeWorkoutLog.totalDuration = totalDuration;
        activeWorkoutLog.status = "completed";

        await activeWorkoutLog.save();


        // STEP 8: Return success response with workout summary
        return res.status(200).json({
            message: "Workout completed successfully",
            workoutLog: activeWorkoutLog
        });

    } catch (err) {

        res.status(400).json({
            error: "ERROR inside /workout/complete",
            message: err.message
        });

    }

});

module.exports = workoutExecutionRouter;