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
    totalExercises: {
        type: Number,
        required: true
    },
    totalSetsCompleted: {
        type: Number,
        required: true
    },
    status : {
        type: String,
        required: true,
        trim: true,
        enum: ['completed', 'incomplete', 'skipped']
    }

}, {timestamps: true});

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogsSchema);

module.exports = WorkoutLog;