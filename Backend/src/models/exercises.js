const mongoose = require('mongoose');
const validator = require('validator');
const exercisesSchema = new mongoose.Schema({
    
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workoutDayId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'WorkoutDays'
    },
    exerciseName : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
        required : true,
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL! : "+value);
            }
        }
    },
    sets : {
        type : Number,
        required : true
    },
    reps : {
        type : Number,
        required : true
    },
    restTime : {
        type : Number,
        required : true
    },
    notes : {
        type : String,
    },
    

}, {timestamps: true});

const Exercises = mongoose.model('Exercises', exercisesSchema);
module.exports = Exercises;
