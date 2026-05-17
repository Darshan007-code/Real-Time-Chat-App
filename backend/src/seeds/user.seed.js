import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

config();

const seedUsers = [
  {
    email: "user@test.com",
    fullName: "Aryan Sharma",
    password: "user123",
    profilePic: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
  },
  // Cricketers
  {
    email: "virat.kohli@example.com",
    fullName: "Virat Kohli",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    email: "rohit.sharma@example.com",
    fullName: "Rohit Sharma",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    email: "ms.dhoni@example.com",
    fullName: "MS Dhoni",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    email: "kl.rahul@example.com",
    fullName: "KL Rahul",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
  },
  {
    email: "hardik.pandya@example.com",
    fullName: "Hardik Pandya",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  },
  // Actors
  {
    email: "ranbir.kapoor@example.com",
    fullName: "Ranbir Kapoor",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    email: "akshay.kumar@example.com",
    fullName: "Akshay Kumar",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  },
  {
    email: "hrithik.roshan@example.com",
    fullName: "Hrithik Roshan",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
  },
  {
    email: "ayushmann.khurrana@example.com",
    fullName: "Ayushmann Khurrana",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop",
  },
  {
    email: "vicky.kaushal@example.com",
    fullName: "Vicky Kaushal",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=400&h=400&fit=crop",
  },
  {
    email: "kartik.aaryan@example.com",
    fullName: "Kartik Aaryan",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await User.deleteMany({});
    const hashedUsers = await Promise.all(
      seedUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    await User.insertMany(hashedUsers);
    console.log("Database seeded successfully with Reliable Image URLs");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
