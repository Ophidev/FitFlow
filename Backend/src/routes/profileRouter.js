const express = require("express");
const userAuth = require("../middlewares/auth.js");
const { validateEditProfileData } = require("../utils/validation.js");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req,res) => {
    
    try{

        const user = req.user; // getting the user attached by userAuth

        res.send(user);

    } catch(err) {
        res.status(400).send("ERROR inside /profile/view: "+ err.message);
    }

});

profileRouter.patch("/profile/edit", userAuth, async (req,res) => {

    try {

        if(!validateEditProfileData(req)) {
            throw new Error ("!Invalid Edit Reqest!!!");
        };

        const loggedInUser = req.user; // this is the old user getting from userAuth

        Object.keys(req.body).forEach(
            (key) => (loggedInUser[key] = req.body[key])
        );

        await loggedInUser.save();

        res.status(201).json({
            message: `${loggedInUser.firstName}, your profile updated successfully ✅`,
            data: loggedInUser
        });

    } catch(err){
        res.status(400).send("ERROR : inside /profile/edit"+ err.message);
    }; 

});


module.exports = profileRouter;