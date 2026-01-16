const mongoose = require('mongoose');

const setLogsSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    setNumber: {
        type: Number,
        required: true
    },
    completedAt: {
        type: Date,
        required: true
    },
    timeTaken: {
        type: Number,
        required: true
    },
    

},{timestamps: true});

const SetLogs = mongoose.model('SetLogs', setLogsSchema);

module.exports = SetLogs;