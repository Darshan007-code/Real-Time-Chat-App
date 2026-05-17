import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  groups: [],
  publicGroups: [],
  selectedUser: null,
  selectedGroup: null,
  replyToMessage: null,
  isUsersLoading: false,
  isGroupsLoading: false,
  isMessagesLoading: false,
  isPublicGroupsLoading: false,
  typingUsers: [],

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
      
      const socket = useAuthStore.getState().socket;
      if (socket && res.data.length > 0) {
        socket.emit("joinGroups", { groupIds: res.data.map(g => g._id) });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  searchPublicGroups: async (query) => {
    if (!query) {
      set({ publicGroups: [] });
      return;
    }
    set({ isPublicGroupsLoading: true });
    try {
      const res = await axiosInstance.get(`/groups/search?query=${query}`);
      set({ publicGroups: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to search public groups");
    } finally {
      set({ isPublicGroupsLoading: false });
    }
  },

  joinGroup: async (groupId) => {
    try {
      const res = await axiosInstance.post(`/groups/join/${groupId}`);
      set({ groups: [...get().groups, res.data] });
      toast.success("Joined group successfully");
      
      const socket = useAuthStore.getState().socket;
      if (socket) socket.emit("joinGroup", { groupId: res.data._id });
      
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join group");
    }
  },

  createGroup: async (groupData) => {
    try {
      const res = await axiosInstance.post("/groups/create", groupData);
      set({ groups: [...get().groups, res.data] });
      toast.success("Group created successfully");
      
      const socket = useAuthStore.getState().socket;
      if (socket) socket.emit("joinGroup", { groupId: res.data._id });
      
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      get().markMessagesAsSeen(userId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getGroupMessages: async (groupId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groups/messages/${groupId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch group messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, selectedGroup, messages, replyToMessage } = get();
    try {
      let res;
      const payload = { ...messageData, replyTo: replyToMessage?._id };
      
      if (selectedGroup) {
        res = await axiosInstance.post(`/groups/messages/send/${selectedGroup._id}`, payload);
      } else {
        res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, payload);
      }
      set({ messages: [...messages, res.data], replyToMessage: null });
      return res.data; // CRITICAL: Return the data for frontend tracking
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  addReaction: async (messageId, emoji) => {
    try {
      await axiosInstance.post(`/messages/react/${messageId}`, { emoji });
      const currentUserId = useAuthStore.getState().authUser._id;
      
      set({
        messages: get().messages.map(m => {
          if (m._id === messageId) {
            const reactions = m.reactions.filter(r => (r.userId._id || r.userId) !== currentUserId);
            reactions.push({ userId: currentUserId, emoji });
            return { ...m, reactions };
          }
          return m;
        })
      });
    } catch (error) {
      toast.error("Failed to add reaction");
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/delete/${messageId}`);
      set({
        messages: get().messages.filter((m) => m._id !== messageId),
      });
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  setReplyToMessage: (message) => set({ replyToMessage: message }),

  subscribeToMessages: () => {
    const { selectedUser, selectedGroup } = get();
    if (!selectedUser && !selectedGroup) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedGroup) return;
      const senderId = newMessage.senderId?._id || newMessage.senderId;
      const isMessageSentFromSelectedUser = senderId === selectedUser?._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });

      get().markMessagesAsSeen(selectedUser._id);
    });

    socket.on("newGroupMessage", (newMessage) => {
      if (!selectedGroup || newMessage.groupId !== selectedGroup._id) return;
      const currentUserId = useAuthStore.getState().authUser?._id;
      const senderId = newMessage.senderId?._id || newMessage.senderId;
      if (senderId === currentUserId) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });

    socket.on("messageReaction", ({ messageId, userId, emoji }) => {
      set({
        messages: get().messages.map(m => {
          if (m._id === messageId) {
            const reactions = m.reactions.filter(r => (r.userId._id || r.userId) !== userId);
            reactions.push({ userId, emoji });
            return { ...m, reactions };
          }
          return m;
        })
      });
    });

    socket.on("liveLocationUpdated", ({ messageId, coords }) => {
      set({
        messages: get().messages.map(m => m._id === messageId ? { ...m, location: coords } : m)
      });
    });

    socket.on("liveLocationStopped", ({ messageId }) => {
      set({
        messages: get().messages.map(m => m._id === messageId ? { ...m, isLiveActive: false } : m)
      });
    });

    socket.on("userTyping", ({ senderId, groupId }) => {
      if (groupId) {
        if (!selectedGroup || groupId !== selectedGroup._id) return;
      } else {
        if (!selectedUser || senderId !== selectedUser._id) return;
      }
      
      if (!get().typingUsers.includes(senderId)) {
        set({ typingUsers: [...get().typingUsers, senderId] });
      }
    });

    socket.on("userStoppedTyping", ({ senderId, groupId }) => {
      set({ typingUsers: get().typingUsers.filter((id) => id !== senderId) });
    });

    socket.on("messagesSeen", ({ seenBy }) => {
      if (!selectedUser || seenBy !== selectedUser._id) return;
      set({
        messages: get().messages.map((m) =>
          m.senderId === useAuthStore.getState().authUser._id ? { ...m, isSeen: true } : m
        ),
      });
    });

    socket.on("messageDeleted", ({ messageId }) => {
      set({
        messages: get().messages.filter((m) => m._id !== messageId),
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("newGroupMessage");
    socket.off("messageReaction");
    socket.off("liveLocationUpdated");
    socket.off("liveLocationStopped");
    socket.off("userTyping");
    socket.off("userStoppedTyping");
    socket.off("messagesSeen");
    socket.off("messageDeleted");
  },

  sendTypingStatus: () => {
    const { selectedUser, selectedGroup } = get();
    if (!selectedUser && !selectedGroup) return;
    const socket = useAuthStore.getState().socket;
    socket.emit("typing", { 
      receiverId: selectedUser?._id, 
      groupId: selectedGroup?._id 
    });
  },

  sendStopTypingStatus: () => {
    const { selectedUser, selectedGroup } = get();
    if (!selectedUser && !selectedGroup) return;
    const socket = useAuthStore.getState().socket;
    socket.emit("stopTyping", { 
      receiverId: selectedUser?._id, 
      groupId: selectedGroup?._id 
    });
  },

  markMessagesAsSeen: (senderId) => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.emit("markAsSeen", { senderId });
  },

  setSelectedUser: (selectedUser) => set({ selectedUser, selectedGroup: null, typingUsers: [], messages: [], replyToMessage: null }),
  setSelectedGroup: (selectedGroup) => set({ selectedGroup, selectedUser: null, typingUsers: [], messages: [], replyToMessage: null }),
}));
