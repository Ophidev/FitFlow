const mongoose = require('mongoose');

const workoutLogsSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workoutDayId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkoutDays',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startedAt: {
        type: Date,
        required: true
    },

    // Stores the current pause start time for the workout.
    // If null, workout is not currently paused.
    pausedAt: {
        type: Date,
        default: null
    },

    // Total paused duration in seconds across all pauses.
    // This is used to calculate true workout duration excluding breaks.
    totalPausedDuration: {
        type: Number,
        default: 0
    },

    completedAt: {
        type: Date,
    },
    totalDuration: {
        type: Number, // seconds
        default: 0
    },
    totalExercises: {
        type: Number,
        required: true
    },
    totalSetsCompleted: {
        type: Number,
        default: 0
    },
    status : {
        type: String,
        required: true,
        trim: true,
        enum: ["in_progress", "completed", "skipped", "paused"],
        default: "in_progress"
    }

}, {timestamps: true});

// Query optimization for active / paused / completed workout lookups
workoutLogsSchema.index({ userId: 1, status: 1 });

// Helpful for checking whether same workout day was completed on a given day
workoutLogsSchema.index({ userId: 1, workoutDayId: 1, date: 1, status: 1 });

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogsSchema);

module.exports = WorkoutLog;