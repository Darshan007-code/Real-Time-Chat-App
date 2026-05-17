import { useState, useRef } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES, WALLPAPERS } from "../constants";
import { Send, Bell, Shield, Lock, Palette, Monitor, Globe, Eye, Smartphone, Key, Image, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { theme, setTheme, chatWallpaper, setChatWallpaper, customWallpaper, setCustomWallpaper } = useThemeStore();
  const [activeTab, setActiveTab] = useState("appearance");
  const fileInputRef = useRef(null);

  const tabs = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Safety", icon: Shield },
    { id: "security", label: "Account Security", icon: Lock },
  ];

  const handleCustomWallpaperUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setCustomWallpaper(reader.result);
      toast.success("Custom wallpaper applied!");
    };
  };

  const removeCustomWallpaper = () => {
    setCustomWallpaper(null);
    setChatWallpaper("default");
    toast.success("Reverted to default wallpaper");
  };

  const selectedWallpaper = chatWallpaper === "custom" 
    ? { id: "custom", label: "Custom Image", class: "", isCustom: true }
    : WALLPAPERS.find(w => w.id === chatWallpaper) || WALLPAPERS[0];

  return (
    <div className="min-h-screen pt-20 bg-base-200/50">
      <div className="max-w-5xl mx-auto p-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col gap-1 mb-8">
           <h1 className="text-4xl font-black tracking-tighter">System Settings</h1>
           <p className="text-base-content/60 font-medium uppercase tracking-widest text-xs">Configure your digital interface</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Category Navigation */}
          <div className="space-y-4">
             <div className="bg-base-100 rounded-3xl p-2 border border-base-300 shadow-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                      activeTab === tab.id 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-base-200 opacity-60"
                    }`}
                  >
                    <tab.icon size={20} /> {tab.label}
                  </button>
                ))}
             </div>

             <div className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-3xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                   <Monitor size={20} />
                   <span className="font-bold uppercase tracking-widest text-[10px]">Zenith V2.0</span>
                </div>
                <p className="text-sm font-medium opacity-90 leading-relaxed mb-4">
                   Your interface is running on the latest quantum-secure protocol.
                </p>
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full w-3/4 bg-white" />
                </div>
             </div>
          </div>

          {/* Right Column: Active Settings Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-base-100 rounded-[2.5rem] p-8 border border-base-300 shadow-sm min-h-[500px]">
              
              {/* APPEARANCE TAB */}
              {activeTab === "appearance" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                  
                  {/* Theme Section */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                          <Palette size={24} />
                      </div>
                      <div>
                          <h2 className="text-xl font-black tracking-tight">Theme Gallery</h2>
                          <p className="text-xs text-base-content/50 font-medium">Choose a global skin</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                      {THEMES.map((t) => (
                        <button
                          key={t}
                          className={`
                            group flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all
                            ${theme === t ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-base-200"}
                          `}
                          onClick={() => setTheme(t)}
                        >
                          <div className="relative size-10 rounded-xl overflow-hidden shadow-inner border border-base-300" data-theme={t}>
                            <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                              <div className="rounded-sm bg-primary"></div>
                              <div className="rounded-sm bg-secondary"></div>
                              <div className="rounded-sm bg-accent"></div>
                              <div className="rounded-sm bg-neutral"></div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold truncate w-full text-center uppercase tracking-tighter opacity-70">
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Wallpaper Section */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Image size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight">Chat Wallpaper</h2>
                            <p className="text-xs text-base-content/50 font-medium">Customize your messaging space</p>
                        </div>
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleCustomWallpaperUpload} />
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="btn btn-sm btn-outline rounded-xl gap-2 font-bold"
                      >
                         <Upload size={16} /> Upload Own
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {/* Custom Wallpaper Preview if exists */}
                      {customWallpaper && (
                        <button
                          onClick={() => setChatWallpaper("custom")}
                          className={`
                            group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all
                            ${chatWallpaper === "custom" ? "border-primary ring-4 ring-primary/10" : "border-base-300 hover:border-primary/50"}
                          `}
                        >
                           <img src={customWallpaper} className="absolute inset-0 size-full object-cover" />
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                           <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white uppercase tracking-widest drop-shadow-md">
                             Your Image
                           </span>
                           <button 
                            onClick={(e) => { e.stopPropagation(); removeCustomWallpaper(); }}
                            className="absolute top-1 right-1 size-6 bg-base-100/80 rounded-lg flex items-center justify-center text-error hover:bg-error hover:text-white transition-colors"
                           >
                              <X size={14} />
                           </button>
                        </button>
                      )}

                      {WALLPAPERS.map((wp) => (
                        <button
                          key={wp.id}
                          onClick={() => setChatWallpaper(wp.id)}
                          className={`
                            group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all
                            ${chatWallpaper === wp.id ? "border-primary ring-4 ring-primary/10" : "border-base-300 hover:border-primary/50"}
                          `}
                        >
                           <div className={`absolute inset-0 ${wp.class}`} />
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                           <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white uppercase tracking-widest drop-shadow-md">
                             {wp.label}
                           </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Preview UI */}
                  <section>
                    <h3 className="text-sm font-bold mb-4 uppercase tracking-widest text-base-content/30">Live Interface Preview</h3>
                    <div className="rounded-3xl border border-base-300 bg-base-100 overflow-hidden shadow-2xl">
                      <div className="p-4 bg-base-200 flex items-center justify-between border-b border-base-300">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-xl bg-primary flex items-center justify-center text-primary-content">
                              <Monitor size={16} />
                            </div>
                            <span className="text-xs font-black tracking-tight">Terminal Preview</span>
                        </div>
                      </div>
                      
                      {/* PREVIEW CONTAINER WITH WALLPAPER */}
                      <div className="p-6 space-y-4 relative min-h-[200px] overflow-hidden">
                        {/* Background Layer */}
                        {chatWallpaper === "custom" && customWallpaper ? (
                          <img src={customWallpaper} className="absolute inset-0 size-full object-cover" />
                        ) : (
                          <div className={`absolute inset-0 ${selectedWallpaper.class}`} />
                        )}

                        <div className="relative z-10">
                          <div className="flex gap-3">
                            <div className="size-10 rounded-2xl bg-primary flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-base-300/50 rounded-lg w-1/4" />
                              <div className="h-10 bg-base-200 rounded-2xl w-3/4 shadow-sm" />
                            </div>
                          </div>
                          <div className="flex gap-3 flex-row-reverse mt-4">
                            <div className="size-10 rounded-2xl bg-secondary flex-shrink-0" />
                            <div className="flex-1 flex flex-col items-end space-y-2">
                              <div className="h-4 bg-base-300/50 rounded-lg w-1/4" />
                              <div className="h-10 bg-secondary rounded-2xl w-3/4 flex items-center px-4 text-secondary-content font-medium shadow-sm">
                                Interface looks smooth!
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-base-200 flex gap-2">
                        <div className="flex-1 h-10 bg-base-100 rounded-xl border border-base-300 px-4 flex items-center text-xs opacity-40 italic">Type frequency...</div>
                        <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-primary-content"><Send size={18} /></div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === "notifications" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="size-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Notification Logic</h2>
                        <p className="text-xs text-base-content/50 font-medium">Control how the ecosystem alerts you</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: Smartphone, label: "Push Notifications", desc: "Receive alerts when the app is minimized" },
                      { icon: Bell, label: "Message Sounds", desc: "Play a frequency pulse on new messages" },
                      { icon: Monitor, label: "Desktop Alerts", desc: "Show a banner in the top corner of your display" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-base-200/50 rounded-3xl border border-base-300">
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-2xl bg-base-100 flex items-center justify-center text-primary shadow-sm">
                            <item.icon size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{item.label}</p>
                            <p className="text-xs opacity-50">{item.desc}</p>
                          </div>
                        </div>
                        <input type="checkbox" className="toggle toggle-primary toggle-sm" defaultChecked={i < 2} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PRIVACY TAB */}
              {activeTab === "privacy" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="size-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Privacy Matrix</h2>
                        <p className="text-xs text-base-content/50 font-medium">Manage your visibility across the grid</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-6 bg-base-200/50 rounded-3xl border border-base-300 space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <Eye size={20} className="text-primary" />
                            <span className="font-bold">Last Seen Visibility</span>
                         </div>
                         <select className="select select-bordered select-sm rounded-xl">
                            <option>Everyone</option>
                            <option>My Contacts</option>
                            <option>Nobody</option>
                         </select>
                      </div>
                      <div className="flex items-center justify-between border-t border-base-300 pt-6">
                         <div className="flex items-center gap-4">
                            <Globe size={20} className="text-primary" />
                            <span className="font-bold">Public Group Search</span>
                         </div>
                         <input type="checkbox" className="toggle toggle-primary toggle-sm" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === "security" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="size-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Encryption Keys</h2>
                        <p className="text-xs text-base-content/50 font-medium">Secure your account and session data</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Change Access Code</h4>
                      <div className="grid gap-4">
                        <input type="password" placeholder="Current Code" className="input input-bordered w-full h-12 bg-base-200/50 rounded-2xl px-5" />
                        <input type="password" placeholder="New Neural Key" className="input input-bordered w-full h-12 bg-base-200/50 rounded-2xl px-5" />
                        <button className="btn btn-primary rounded-2xl gap-2 font-bold"><Key size={18} /> Update Matrix</button>
                      </div>
                    </div>
                    
                    <div className="p-6 border border-rose-500/20 bg-rose-500/5 rounded-3xl">
                       <h4 className="text-sm font-bold text-rose-500 mb-2">Danger Zone</h4>
                       <p className="text-xs opacity-60 mb-4">Deleting your account will permanently wipe your data from the global mesh.</p>
                       <button className="btn btn-error btn-sm rounded-xl">Wipe Identity</button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
