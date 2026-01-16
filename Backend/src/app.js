require('dotenv').config()
const connectDB = require('./config/database');
const express = require('express');
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("../src/routes/authRouter.js");
const profileRouter = require("../src/routes/profileRouter.js");


app.use("/", authRouter);
app.use("/", profileRouter);

connectDB()
    .then(() => {
        console.log('✅ Database connected');

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log("❌ Not connected to DB! ERROR:", error.message)
    });

