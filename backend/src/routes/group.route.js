import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createGroup, getGroups, getGroupMessages, sendGroupMessage, searchPublicGroups, joinGroup } from "../controllers/group.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createGroup);
router.get("/", protectRoute, getGroups);
router.get("/search", protectRoute, searchPublicGroups);
router.post("/join/:id", protectRoute, joinGroup);
router.get("/messages/:id", protectRoute, getGroupMessages);
router.post("/messages/send/:id", protectRoute, sendGroupMessage);

export default router;
