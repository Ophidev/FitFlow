const mongoose = require('mongoose');

const workoutDaysSchema = new mongoose.Schema({
    
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title : {
        type: String,
        required: true
    },
    
}, {timestamps: true});

const WorkoutDays = mongoose.model('WorkoutDays', workoutDaysSchema);

module.exports = WorkoutDays;
