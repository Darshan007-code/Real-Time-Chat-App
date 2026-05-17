# 🚀 Real-Time Chat Application

A modern, full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js), featuring real-time messaging, user authentication, and a polished UI.

## ✨ Features

- 📱 **Responsive UI**: Clean and modern interface built with TailwindCSS and DaisyUI.
- 💬 **Real-Time Messaging**: Instant message delivery powered by Socket.io.
- 🔐 **Authentication & Authorization**: Secure login and signup with JWT (JSON Web Tokens).
- 🟢 **Online Status**: Real-time tracking of online users.
- 📁 **Cloudinary Integration**: Profile picture uploads and image sharing.
- 🛠️ **State Management**: Efficient global state handling using Zustand.
- 🐞 **Error Handling**: Comprehensive error management on both client and server.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, DaisyUI, Zustand, Lucide React.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **Real-Time**: Socket.io.
- **Storage**: Cloudinary.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB account
- Cloudinary account

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd Real-Time-Chat-App
   ```

2. **Install dependencies**:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the `backend` directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_uri
   PORT=5001
   JWT_SECRET=your_jwt_secret

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   NODE_ENV=development
   ```

### Running the App

1. **Start the backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---
Developed by **Darshan**
