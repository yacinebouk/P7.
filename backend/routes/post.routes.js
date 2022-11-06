// routeur
import { Router } from "express";
const router = Router();
//import du controller post
import { readPost, createPost, updatePost, deletePost, likePost, unlikePost } from "../controllers/post.ctrlers.js";
import multer from "multer";
const upload = multer();
import { checkTokenUser } from "../middlewares/auth.js";

//CRUD
router.get("/", checkTokenUser, readPost);
router.post("/", checkTokenUser, upload.single("file"), createPost);
router.put("/:id", checkTokenUser, upload.single("file"), updatePost);
router.delete("/:id", checkTokenUser, deletePost);

//likes
router.patch("/like-post/:id", checkTokenUser, likePost);
router.patch("/unlike-post/:id", checkTokenUser, unlikePost);

export default router;
