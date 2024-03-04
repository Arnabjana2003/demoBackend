import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import {Like} from "../models/like.model.js"


const likeVideo = asyncHandler(async (req,res)=>{
    const {videoId} = req.body
    if(!videoId) throw new ApiError(400,"Video id is required");

    const alreadyLiked = await Like.findOne({
        $and: [{likedBy:req.userData._id},{likedVideo:videoId}]
    })
    if(alreadyLiked) throw new ApiError(400, "already liked, multiple liked not allowed")

    const newLike = await Like.create({
        likedVideo: videoId,
        likedBy: req.userData?._id
    })

    if(!newLike) throw new ApiError(500,"Liked not added");

    return res
    .status(200)
    .json(
        new ApiResponse(200,"Like added",{})
    )
})

export {likeVideo}