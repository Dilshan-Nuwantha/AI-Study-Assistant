import express from "express";
import {
    globalStatsController,
    recentActivityController,
} from "../controllers/home.controller.js";

const router = express.Router();

router.get("/stats/global", globalStatsController);
router.get("/activity/recent", recentActivityController);

export default router;
