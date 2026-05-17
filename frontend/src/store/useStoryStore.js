import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useStoryStore = create((set, get) => ({
  stories: [], // Array of { user, stories: [] }
  isStoriesLoading: false,
  isUploadingStory: false,

  getStories: async () => {
    set({ isStoriesLoading: true });
    try {
      const res = await axiosInstance.get("/stories");
      set({ stories: res.data });
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      set({ isStoriesLoading: false });
    }
  },

  createStory: async (storyData) => {
    set({ isUploadingStory: true });
    try {
      const res = await axiosInstance.post("/stories", storyData);
      // Refresh stories after upload
      get().getStories();
      toast.success("Story posted successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post story");
    } finally {
      set({ isUploadingStory: false });
    }
  },

  viewStory: async (storyId) => {
    try {
      await axiosInstance.post(`/stories/view/${storyId}`);
    } catch (error) {
      console.error("Error marking story as viewed:", error);
    }
  },
}));
