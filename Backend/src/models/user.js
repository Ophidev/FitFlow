const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 100,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error('Invalid password');
            }
        }
    },
    profilePicture : {
        type : String,
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL! : "+value);
            }
        }
    },
    gender: {
        type: String,
        trim: true,
        enum: ['male', 'female', 'other']
    },
    age: {
        type: Number,
        trim: true,
        min: 18,
        max: 100
    },
    height: {
        type: Number,
        trim: true,
        min: 100,
        max: 250
    },
    weight: {
        type: Number,
        trim: true,
        min: 40,
        max: 250
    },
    goal: {
        type: String,
        trim: true,
        enum: ['lose weight', 'gain weight', 'gain strength', 'maintain health']
    },  

}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
