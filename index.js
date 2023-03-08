import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";

import UserModel from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";


//connect to DB
mongoose
    .connect("mongodb+srv://kristaliska:anahuj13@foxcluster.feubtbv.mongodb.net/sublet?retryWrites=true&w=majority")   
    .then(() => console.log("DB Ok"))
    .catch(() => console.log("DB Error"))

const app = express();

app.use(express.json());//let our app read json format

app.get("/", (req, res) => {
    res.send("ssHello World");
});

app.post("/auth/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if(!user) {
            return res.status(404).json({
                message: "User was not found",
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if(!isValidPass) {
            return res.status(404).json({
                message: "Login or password is not correct",
            })
        }

        const token = jwt.sign({
            _id: user._id,
            }, 
                'secret123',
            {
                expiresIn: "30d",
            },
        );

        const {passwordHash, ... userData} = user._doc;
    
        res.json({... userData, token,});
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: "Failed to login",
        })
    }
});

app.post("/auth/register", registerValidation, async(req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
    
        //password encryption
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
        });
    
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
            }, 
                'secret123',
            {
                expiresIn: "30d",
            },
        );

        const {passwordHash, ... userData} = user._doc;
    
        res.json({... userData, token,});
    }
    catch (err){
        console.log(err)
        res.status(500).json({
            message: "Failed to register",
        })
    }
});

app.get("/auth/me", checkAuth, async (req, res) => {
    try{
        const user = await UserModel.findById(req.userId);

        if(!user) {
            return res.status(404).json({
                message: "No user with the such name",
            })
        }

        const {passwordHash, ... userData} = user._doc;
    
        res.json({userData});
    }
    catch(err) {
        console.log(err)
        res.status(500).json({
            message: "No access",
        })
    }
});

app.listen(3000, (err) => {
    if(err) {
        return console.log(err);
    }

    console.log("Ok");
})