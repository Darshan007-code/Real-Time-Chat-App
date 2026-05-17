import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Group from "../models/group.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Join group rooms on connection
  socket.on("joinGroups", async ({ groupIds }) => {
    if (groupIds && Array.isArray(groupIds)) {
      groupIds.forEach((groupId) => {
        socket.join(groupId);
        console.log(`User ${userId} joined group ${groupId}`);
      });
    }
  });

  socket.on("joinGroup", ({ groupId }) => {
    socket.join(groupId);
    console.log(`User ${userId} joined group ${groupId}`);
  });

  // --- WEBRTC SIGNALING ---
  socket.on("callUser", ({ userToCall, signalData, from, name, callType }) => {
    const receiverSocketId = getReceiverSocketId(userToCall);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incomingCall", { signal: signalData, from, name, callType });
    }
  });

  socket.on("answerCall", (data) => {
    const receiverSocketId = getReceiverSocketId(data.to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callAccepted", data.signal);
    }
  });

  socket.on("iceCandidate", (data) => {
    const receiverSocketId = getReceiverSocketId(data.to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("iceCandidate", data.candidate);
    }
  });

  socket.on("endCall", ({ to }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callEnded");
    }
  });
  // -------------------------

  // --- LIVE LOCATION UPDATE ---
  socket.on("updateLiveLocation", async ({ messageId, coords, to }) => {
    try {
      await Message.findByIdAndUpdate(messageId, { location: coords });
      const receiverSocketId = getReceiverSocketId(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("liveLocationUpdated", { messageId, coords });
      }
    } catch (err) {
      console.error("Live location update failed:", err);
    }
  });

  socket.on("stopLiveLocation", async ({ messageId, to }) => {
    try {
      await Message.findByIdAndUpdate(messageId, { isLiveActive: false });
      const receiverSocketId = getReceiverSocketId(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("liveLocationStopped", { messageId });
      }
    } catch (err) {
      console.error("Stop live location failed:", err);
    }
  });
  // ----------------------------

  socket.on("typing", ({ receiverId, groupId }) => {
    if (groupId) {
      socket.to(groupId).emit("userTyping", { senderId: userId, groupId });
    } else if (receiverId) {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", { senderId: userId });
      }
    }
  });

  socket.on("stopTyping", ({ receiverId, groupId }) => {
    if (groupId) {
      socket.to(groupId).emit("userStoppedTyping", { senderId: userId, groupId });
    } else if (receiverId) {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userStoppedTyping", { senderId: userId });
      }
    }
  });

  socket.on("markAsSeen", async ({ senderId }) => {
    try {
      // Find messages that are being seen and handle self-destruct logic
      const unreadMessages = await Message.find({ senderId, receiverId: userId, isSeen: false });
      
      for (const msg of unreadMessages) {
        if (msg.selfDestruct) {
          const deleteAfter = 10000; // 10 seconds
          setTimeout(async () => {
            await Message.findByIdAndDelete(msg._id);
            io.to(socket.id).emit("messageDeleted", { messageId: msg._id });
            const senderSocketId = getReceiverSocketId(senderId);
            if (senderSocketId) io.to(senderSocketId).emit("messageDeleted", { messageId: msg._id });
          }, deleteAfter);
        }
      }

      await Message.updateMany(
        { senderId, receiverId: userId, isSeen: false },
        { $set: { isSeen: true } }
      );
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", { seenBy: userId });
      }
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  });

  socket.on("disconnect", async () => {
    console.log("A user disconnected", socket.id);
    if (userId) {
      await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
