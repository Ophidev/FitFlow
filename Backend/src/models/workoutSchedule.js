const mongoose = require("mongoose");

const workoutScheduleSchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },

    workoutDayId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'WorkoutDay',
        required : true,
    },
    
    weekday : {
        type : String,
        required: true,
        trim : true,
        lowercase: true,
        enum : 
        [
            'monday', 
            'tuesday', 
            'wednesday', 
            'thursday', 
            'friday', 
            'saturday', 
            'sunday'
        ],
    },

}, {timestamps:true});

// Ensures that each user can assign only ONE workout per weekday.
// Same weekday is allowed for different users.
workoutScheduleSchema.index(
    {userId : 1, weekday : 1},
    {unique : true}
);

const WorkoutSchedule = mongoose.model('WorkoutSchedule', workoutScheduleSchema);

module.exports = WorkoutSchedule;