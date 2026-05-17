import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
import Group from "../models/group.model.js";
import mongoose from "mongoose";

config();

const groups = [
  {
    name: "Tech Enthusiasts",
    description: "A group for discussing latest technology trends, gadgets, and programming.",
    isPublic: true,
    avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80",
  },
  {
    name: "Movie Buffs",
    description: "Talk about your favorite movies, series, and reviews.",
    isPublic: true,
    avatar: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&q=80",
  },
  {
    name: "Healthy Living",
    description: "Tips for fitness, healthy recipes, and mental well-being.",
    isPublic: true,
    avatar: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=80",
  },
  {
    name: "Gaming Zone",
    description: "Connect with gamers, share tips, and organize tournaments.",
    isPublic: true,
    avatar: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80",
  },
  {
    name: "Travel Explorers",
    description: "Share your travel experiences and discover new destinations.",
    isPublic: true,
    avatar: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&q=80",
  },
];

const seedGroups = async () => {
  try {
    await connectDB();

    const user = await User.findOne({ email: "user@test.com" });
    if (!user) {
      console.error("User user@test.com not found. Please run user seed first.");
      process.exit(1);
    }

    await Group.deleteMany({ isPublic: true });

    const groupsWithCreator = groups.map((group) => ({
      ...group,
      createdBy: user._id,
      members: [user._id],
      admins: [user._id],
    }));

    await Group.insertMany(groupsWithCreator);
    console.log("Public groups seeded successfully");
  } catch (error) {
    console.error("Error seeding groups:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedGroups();
