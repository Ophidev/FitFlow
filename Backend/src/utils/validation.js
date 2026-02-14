const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not validl!");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("!Not Strong Password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "profilePicture",
    "age",
    "height",
    "weight",
    "goal",
  ];

  const isEditAllowed = 
    Object.keys(req.body)
    .every((field) => allowedEditFields.includes(field));

  return isEditAllowed;
};

const validateEditExerciseData = (req) => {

  const allowedEditFields = [
    "exerciseName",
    "imageUrl",
    "sets",
    "reps",
    "restTime",
    "notes",
  ];

  // const requestFields = Object.keys(req.body);

  // if (requestFields.length === 0) {
  //   throw new Error("Please edit at least one field to update.");
  // }

  const isEditAllowed = 
    Object.keys(req.body)
    .every((field) => allowedEditFields.includes(field));

  return isEditAllowed;
};

module.exports = { validateSignupData, validateEditProfileData, validateEditExerciseData };
