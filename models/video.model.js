import mongoose,{Schema} from "mongoose";

const videoSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: { 
        type: String,
        required: [true, "Description is required"],
    },
    videoFileName:{
        type: String,
        required: [true, "Video file name is required"],
    },
    videoUrl: {
        type: String,
        required: [true, "Video link is required"],
    },
    thumbnailFileName:{
        type: String,
        required: [true, "Thumbnail file name is required"],
    },
    thumbnailUrl: {
        type: String,
        required: [true, "Thumbnail link is required"],
    },
    isPublished: {
        type: Boolean,
        required: true,
    },
    views: {
        type: Number,
        required: true,
        default: 0
    },
    duration: {
        type: Number,
        required: true,
        default: 0
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
},
{
    timestamps: true,
})

export const Video = mongoose.model("Video", videoSchema);