import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();

app.use(cors())
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static('public'))

app.get("/",(req,res)=>res.json({message: "ok"}))
//routers import
import userRouter from "./routers/user.router.js";
import videoRouter from "./routers/video.router.js";
import subscriptionRouter from "./routers/subscription.router.js"
import likeRouter from "./routers/like.router.js"

//routes declaration
app.use("/api/v1/user",userRouter)
app.use("/api/v1/subscription",subscriptionRouter)
app.use("/api/v1/video",videoRouter)
app.use("/api/v1/like",likeRouter)

export { app };
