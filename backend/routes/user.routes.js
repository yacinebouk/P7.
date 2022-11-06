import { Router } from "express";
const router = Router();
// import du controller utilisateur
import { getAllUsers, userId, getUser, deleteUser } from "../controllers/user.ctrlers.js";
import { signup, login, logout } from "../controllers/auth.ctrlers.js";
import { uploadPic } from "../controllers/uploadPic.ctrlers.js";
// import des middlewares
import email from "../middlewares/email.js";
import password from "../middlewares/password.js";
import connection from "../middlewares/connection.js";
import { checkTokenUser } from "../middlewares/auth.js";
import multer from "multer";
const upload = multer();

/////////// création des routes

// authentification
router.post("/signup", email, password, signup);
router.post("/login", connection, login);
router.get("/logout", logout);

// utilisateur
router.get("/", checkTokenUser, getAllUsers);
router.get("/:id", checkTokenUser, userId);
router.get("/:id", checkTokenUser, getUser);

// profil
router.delete("/:id", checkTokenUser, deleteUser);
router.post("/upload", upload.single('file'), checkTokenUser, uploadPic);
// export du routeur
export default router;
