import {Router} from 'express'
import { likeVideo } from '../controllers/like.controller.js'
import auth from "../middleware/auth.middleware.js"

const router = Router()
router.route("/likevideo").post(auth,likeVideo)

export default router