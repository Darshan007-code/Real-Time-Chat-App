import Story from "../models/story.model.js";
import cloudinary from "../lib/cloudinary.js";

export const createStory = async (req, res) => {
  try {
    const { image, caption } = req.body;
    const userId = req.user._id;

    if (!image) {
      return res.status(400).json({ message: "Image is required for a story" });
    }

    const uploadResponse = await cloudinary.uploader.upload(image);
    
    const newStory = new Story({
      userId,
      imageUrl: uploadResponse.secure_url,
      caption: caption || "",
    });

    await newStory.save();
    
    const populatedStory = await newStory.populate("userId", "fullName profilePic");

    res.status(201).json(populatedStory);
  } catch (error) {
    console.error("Error in createStory controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStories = async (req, res) => {
  try {
    // Get all stories that haven't expired
    const stories = await Story.find({
      expiresAt: { $gt: new Date() }
    })
    .populate("userId", "fullName profilePic")
    .sort({ createdAt: -1 });

    // Group stories by user for easier frontend rendering
    const groupedStories = stories.reduce((acc, story) => {
      const userId = story.userId._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          user: story.userId,
          stories: []
        };
      }
      acc[userId].stories.push(story);
      return acc;
    }, {});

    res.status(200).json(Object.values(groupedStories));
  } catch (error) {
    console.error("Error in getStories controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const viewStory = async (req, res) => {
  try {
    const { id: storyId } = req.params;
    const userId = req.user._id;

    await Story.findByIdAndUpdate(storyId, {
      $addToSet: { viewedBy: userId }
    });

    res.status(200).json({ message: "Story marked as viewed" });
  } catch (error) {
    console.error("Error in viewStory controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
