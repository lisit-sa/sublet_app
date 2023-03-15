import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { loginValidation, registerValidation, postCreateValidation } from "./validations/validations.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";


//connect to DB
mongoose
    .connect("mongodb+srv://kristaliska:anahuj13@foxcluster.feubtbv.mongodb.net/sublet?retryWrites=true&w=majority")   
    .then(() => console.log("DB Ok"))
    .catch(() => console.log("DB Error"))

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads")
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage });

app.use(express.json());//let our app read json format
app.use("/uploads", express.static("uploads"));//let ejs to GET our pictures from client

app.get("/", (req, res) => {
    res.send("ssHello World");
});

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/uploads", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});


app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, PostController.update);


app.listen(3000, (err) => {
    if(err) {
        return console.log(err);
    }

    console.log("Ok");
})