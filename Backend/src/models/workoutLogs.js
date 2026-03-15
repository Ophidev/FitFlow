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
    completedAt: {
        type: Date,
    },
    totalDuration: {
        type: Number, //seconds
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
        enum: ["in_progress", "completed", "skipped"],
        default: "in_progress"
    }

}, {timestamps: true});

// Only one active workout
workoutLogsSchema.index(
  { userId: 1},
  { unique: true, partialFilterExpression: { status: "in_progress" } }
);

// Add compound index (userId, status) in WorkoutLogs to optimize active workout queries
workoutLogsSchema.index({ userId: 1, status: 1 });

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogsSchema);

module.exports = WorkoutLog;