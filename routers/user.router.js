import { Router } from "express";
import {
  currentUser,
  getChannelInfo,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updatePassword,
  updateProfileImage,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import auth from "../middleware/auth.middleware.js";
import getCurrentUsersid from "../middleware/getCurrentUser.js";
const router = Router();

router.route("/register").post(
  // upload.fields([
  //   {
  //     name: "profileImage",
  //   },
  //   {
  //     name: "coverImage",
  //   },
  // ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(auth, logoutUser);
router.route("/refresh-tokens").post(refreshAccessToken)
router.route("/currentuser").post(auth,currentUser)
router.route("/updatepassword").patch(auth,updatePassword)
router.route("/updateProfileImage").patch(upload.single("profileImage"),auth,updateProfileImage)
router.route("/channel/:channelId").get(getCurrentUsersid,getChannelInfo)

export default router;
