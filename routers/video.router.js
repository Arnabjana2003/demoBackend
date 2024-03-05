import { Router } from "express";
import {
  getAllVideos,
  getChannelVideos,
  getSuggestedVideos,
  playVideo,
  searchsuggestion,
  uploadVideo,
  searchedVideos
} from "../controllers/video.controller.js";
import getCurrentUsersid from "../middleware/getCurrentUser.js";
import { upload } from "../middleware/multer.middleware.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.route("/all").get(getAllVideos);
router.route("/:videoId").get(getCurrentUsersid, playVideo);
router.route("/suggestedvideos/:channelId").get(getSuggestedVideos);
router.route("/getvideos/:channelId").get(getChannelVideos);
router.route("/upload").post(
  auth,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
  ]),
  uploadVideo
);
router.route("/searchsuggestion").post(searchsuggestion);
router.route("/search").post(searchedVideos);

export default router;
