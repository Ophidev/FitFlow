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
        required: true
    },
    completedAt: {
        type: Date,
        required: true
    },
    timeTaken: {
        type: Number, //seconds
        required: true
    },
    
},{timestamps: true});

setLogsSchema.index({ workoutLogId: 1 });


const SetLogs = mongoose.model('SetLogs', setLogsSchema);

module.exports = SetLogs;