const mongoose = required("mongoose");

const workoutScheduleSchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },

    workoutDayId : {
        type : mongoose.Schema.Types.ObjedId,
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
            'thrusday', 
            'friday', 
            'saturday', 
            'sunday'
        ],
    },

}, {timestamp:true});

const WorkoutSchedule = mongoose.model('WorkoutSchedule', workoutScheduleSchema);

module.exports = WorkoutSchedule;