import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description, members, avatar, isPublic } = req.body;
    const adminId = req.user._id;

    if (!name) {
      return res.status(400).json({ error: "Group name is required" });
    }

    let avatarUrl = "";
    if (avatar) {
      const uploadResponse = await cloudinary.uploader.upload(avatar);
      avatarUrl = uploadResponse.secure_url;
    }

    const allMembers = isPublic ? [adminId] : [...new Set([...(members || []), adminId.toString()])];

    const newGroup = new Group({
      name,
      description,
      avatar: avatarUrl,
      members: allMembers,
      admins: [adminId],
      createdBy: adminId,
      isPublic: isPublic || false,
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error in createGroup controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const searchPublicGroups = async (req, res) => {
  try {
    const { query } = req.query;
    const groups = await Group.find({
      isPublic: true,
      name: { $regex: query, $options: "i" },
    }).limit(10);

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in searchPublicGroups controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    if (!group.isPublic) return res.status(403).json({ error: "Cannot join a private group" });

    if (group.members.includes(userId)) {
      return res.status(400).json({ error: "You are already a member" });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.error("Error in joinGroup controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({ members: userId }).populate("members", "-password");

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getGroups controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const messages = await Message.find({ groupId }).populate("senderId", "fullName profilePic").populate("replyTo", "text image audio");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getGroupMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { text, image, audio, replyTo } = req.body;
    const { id: groupId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    let audioUrl;
    if (audio) {
      const uploadResponse = await cloudinary.uploader.upload(audio, {
        resource_type: "video",
      });
      audioUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      groupId,
      text,
      image: imageUrl,
      audio: audioUrl,
      replyTo: replyTo || null,
    });

    await newMessage.save();
    
    const populatedMessage = await Message.findById(newMessage._id).populate("senderId", "fullName profilePic").populate("replyTo", "text image audio");

    io.to(groupId).emit("newGroupMessage", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendGroupMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
