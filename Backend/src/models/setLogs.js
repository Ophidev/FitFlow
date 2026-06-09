const mongoose = require('mongoose');

const setLogsSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workoutLogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkoutLog",
        required: true
    },
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercises',
        required: true
    },
    setNumber: {
        type: Number,
        required: true
    },
    startedAt: {
        type: Date,
    },

    // Stores the current pause start time for the active set.
    // If null, set is not currently paused.
    pausedAt: {
        type: Date,
        default: null
    },

    // Total paused duration in seconds across all pauses for this set.
    // Used to calculate accurate set time excluding workout pauses.
    totalPausedDuration: {
        type: Number,
        default: 0
    },

    completedAt: {
        type: Date,
    },
    timeTaken: {
        type: Number, // seconds
    },
    
},{timestamps: true});

setLogsSchema.index(
  { workoutLogId: 1, exerciseId: 1, setNumber: 1 },
  { unique: true }
);

const SetLogs = mongoose.model('SetLogs', setLogsSchema);

module.exports = SetLogs;