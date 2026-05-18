import express from "express";
import {
    registerController,
    loginController,
    logoutController,
    meController,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/me", authMiddleware, meController);

export default router;
