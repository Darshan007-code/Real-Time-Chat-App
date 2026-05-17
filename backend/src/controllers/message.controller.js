import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).populate("replyTo", "text image audio fileUrl fileName");

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, audio, file, fileName, fileType, location, isLiveLocation, selfDestruct, replyTo } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (cloudinaryErr) {
        console.error("Cloudinary Image Upload Error:", cloudinaryErr);
        return res.status(400).json({ message: "Image upload failed. Check Cloudinary settings." });
      }
    }

    let audioUrl;
    if (audio) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(audio, {
          resource_type: "video",
        });
        audioUrl = uploadResponse.secure_url;
      } catch (cloudinaryErr) {
        console.error("Cloudinary Audio Upload Error:", cloudinaryErr);
        return res.status(400).json({ message: "Voice upload failed." });
      }
    }

    let fileUrl;
    if (file) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
          resource_type: "raw", // Use raw for documents
        });
        fileUrl = uploadResponse.secure_url;
      } catch (cloudinaryErr) {
        console.error("Cloudinary File Upload Error:", cloudinaryErr);
        return res.status(400).json({ message: "File upload failed." });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      audio: audioUrl,
      fileUrl,
      fileName,
      fileType,
      location,
      isLiveLocation: isLiveLocation || false,
      isLiveActive: isLiveLocation || false,
      selfDestruct: selfDestruct || false,
      replyTo: replyTo || null,
    });

    await newMessage.save();
    
    const populatedMessage = await Message.findById(newMessage._id).populate("replyTo", "text image audio fileUrl fileName");

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Failed to send message: " + error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);

    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    message.reactions = message.reactions.filter(r => r.userId.toString() !== userId.toString());
    
    message.reactions.push({ userId, emoji });
    await message.save();

    const targetId = message.groupId || message.receiverId;
    const receiverSocketId = getReceiverSocketId(targetId);
    
    if (message.groupId) {
      io.to(message.groupId.toString()).emit("messageReaction", { messageId, userId, emoji });
    } else if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageReaction", { messageId, userId, emoji });
    }

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in addReaction controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
