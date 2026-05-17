import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  chatWallpaper: localStorage.getItem("chat-wallpaper") || "default",
  customWallpaper: localStorage.getItem("custom-wallpaper") || null,
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
  setChatWallpaper: (chatWallpaper) => {
    localStorage.setItem("chat-wallpaper", chatWallpaper);
    set({ chatWallpaper });
  },
  setCustomWallpaper: (customWallpaper) => {
    localStorage.setItem("custom-wallpaper", customWallpaper || "");
    set({ customWallpaper });
    if (customWallpaper) set({ chatWallpaper: "custom" });
  },
}));
