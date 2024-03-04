import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const getCurrentUsersid = asyncHandler( (req,res,next)=>{
    const refreshToken =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

    if(!refreshToken){
        req.userData = null
        next()
        return
    }

    const decodedValue = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if(!decodedValue){
        req.userData = null
        next()
        return
    }
    req.user = decodedValue;
    next()
})

export default getCurrentUsersid