const sanitizeUser = (user) => {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profilePicture: user.profilePicture,
    gender: user.gender,
    age: user.age,
    height: user.height,
    weight: user.weight,
    goal: user.goal,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

module.exports = sanitizeUser;