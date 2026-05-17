import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createStory, getStories, viewStory } from "../controllers/story.controller.js";

const router = express.Router();

router.post("/", protectRoute, createStory);
router.get("/", protectRoute, getStories);
router.post("/view/:id", protectRoute, viewStory);

export default router;
