import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const getAllVideos = asyncHandler(async (req, res) => {
  const allVideos = await Video.aggregate([
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "author",
        as: "author",
        pipeline: [
          {
            $project: {
              _id:1,
              userName: 1,
              profileImage: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        author: {
          $first: "$author",
        },
      },
    },
  ]);
  if (!allVideos) throw new ApiError(500, "Couldn't get all videos");
  return res.status(200).json(allVideos);
});

const playVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;
  if (!videoId) throw new ApiError(400, "videoId is required");
  // res.user && await Video.findByIdAndUpdate(videoId, {$inc: {views:1}})
  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        foreignField: "channel",
        localField: "author",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "likes",
        foreignField: "likedVideo",
        localField: "_id",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "author",
        as: "author",
        pipeline: [
          {
            $project: {
              userName: 1,
              profileImage: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        author: {
          $first: "$author",
        },
        subscribers: {
          $size: "$subscribers",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [new mongoose.Types.ObjectId(req.user?._id), "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
        isLiked: {
          $cond: {
            if: {$in: [new mongoose.Types.ObjectId(req.user?._id), "$likes.likedBy"]},
            then: true,
            else: false
          }
        },
        likes: {
          $size: "$likes",
        },
      },
    },
  ]);
  if (video.length == 0) throw new ApiError(500, "Video not found");
  console.log(video[0]);
  return res
    .status(200)
    .json(new ApiResponse(200, "Video fetched successfully", video[0]));
});

const getSuggestedVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) throw new ApiError(400, "Channel id is required");

  const suggestedVideos = await Video.aggregate([
    {
      $match: {
        author: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup:{
        from:"users",
        foreignField:"_id",
        localField:"author",
        as: "author",
        pipeline: [
          {
            $project:{
              _id:1,
              profileImage:1,
              userName:1
            }
          }
        ]
      }
    },
      {
        $addFields: {
          author: {
            $first: "$author"
          }
        }
    },
    {
        $sort:{
            views: -1
        }
    },
    {
      $limit:5
    }
  ]
  );


  if(suggestedVideos.length == 0) throw new ApiError(400,"suggested videos not found")
  console.log("suggested",suggestedVideos);
  return res
.status(200)
.json(
    new ApiResponse(200,"fetched top 5 suggested videos based on views",suggestedVideos)
)
});

const getChannelVideos = asyncHandler(async(req,res)=>{
  const {channelId} = req.params
  if(!channelId) throw new ApiError(400,"channelId is required")

  const videos = await Video.find({author:channelId},{title:1,videoUrl:1,thumbnailUrl:1,views:1,duration:1})
  
  return res
  .status(200)
  .json(
    new ApiResponse(200,"video fetched successfully",videos)
  )
})

const uploadVideo = asyncHandler(async(req,res)=>{
  const {userName} = req.userData
  const {title,description,isPublished,category} = req.body
  const videoFile = req.files.videoFile[0].path
  const thumbnail = req.files.thumbnail[0].path
  if(!videoFile || !thumbnail) throw new ApiError(400,"Files are required")

  if(!(title && description && isPublished &&  category)){
    throw new ApiError(400,"Provide all the fields properly")
  }

  const videoFileName = `${userName}_${title}_${Date.now()}`
  const thumbnailFileName = `${userName}_${title}_${Date.now()}`

  const videoUrl = await uploadOnCloudinary(videoFile,"videos",videoFileName)
  const thumbnailUrl = await uploadOnCloudinary(thumbnail,"thumbnails",thumbnailFileName)
  if(!videoUrl || !thumbnailUrl) throw new ApiError(500,"Failed to uplaod files")

  const videoData = await Video.create({
    title,description,isPublished,category,videoFileName,thumbnailFileName,
    videoUrl: videoUrl.secure_url,
    duration: videoUrl.duration,
    thumbnailUrl: thumbnailUrl?.secure_url,
    author: req.userData?._id
  })
  if(!videoData) throw new ApiError(500, "Failed to save video in the database")

  return res
  .status(200)
  .json(
    new ApiResponse(200,"Video uploded successfully",videoData)
  )
})

export { getAllVideos, playVideo,getSuggestedVideos ,getChannelVideos,uploadVideo};
