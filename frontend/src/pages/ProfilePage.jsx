import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Info, Save, Shield, Calendar, Award } from "lucide-react";
import Logo from "../components/Logo";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [about, setAbout] = useState(authUser?.about || "");
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [isEditingName, setIsEditingName] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleUpdateAbout = async () => {
    if (about === authUser?.about) return;
    await updateProfile({ about });
  };

  const handleUpdateName = async () => {
    if (fullName === authUser?.fullName) {
      setIsEditingName(false);
      return;
    }
    await updateProfile({ fullName });
    setIsEditingName(false);
  };

  return (
    <div className="min-h-screen pt-20 bg-base-200/50">
      <div className="max-w-4xl mx-auto p-4 py-8">
        
        {/* Header Hero Section */}
        <div className="relative mb-8">
          <div className="h-48 w-full bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 rounded-3xl shadow-lg relative overflow-hidden">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
             <div className="absolute bottom-4 right-6 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white text-xs font-bold uppercase tracking-widest">
                <Shield size={14} /> Verified Account
             </div>
          </div>
          
          <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            <div className="relative group">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-[2.5rem] object-cover border-4 border-base-100 shadow-2xl bg-base-100"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-primary text-primary-content hover:scale-110
                  p-2.5 rounded-2xl cursor-pointer 
                  transition-all duration-300 shadow-lg
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5" />
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
              </label>
            </div>
            
            <div className="pb-4">
               <h1 className="text-3xl font-black tracking-tighter text-base-content flex items-center gap-2">
                  {authUser?.fullName}
                  <Logo size="sm" />
               </h1>
               <p className="text-base-content/60 font-medium">Digital ID: {authUser?._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
          
          {/* Left Column: Stats & Meta */}
          <div className="space-y-6">
             <div className="bg-base-100 rounded-3xl p-6 border border-base-300 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-base-content/40 mb-4 flex items-center gap-2">
                   <Award size={16} className="text-primary" /> Achievements
                </h3>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-base-200/50 p-4 rounded-2xl text-center border border-base-300 hover:border-primary/30 transition-colors">
                      <div className="text-2xl font-black text-primary">124</div>
                      <div className="text-[10px] font-bold uppercase opacity-50">Sent</div>
                   </div>
                   <div className="bg-base-200/50 p-4 rounded-2xl text-center border border-base-300 hover:border-primary/30 transition-colors">
                      <div className="text-2xl font-black text-secondary">12</div>
                      <div className="text-[10px] font-bold uppercase opacity-50">Groups</div>
                   </div>
                </div>
             </div>

             <div className="bg-base-100 rounded-3xl p-6 border border-base-300 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-base-content/40 mb-4">Meta Data</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 opacity-60"><Calendar size={14} /> Joined</span>
                      <span className="font-bold">{authUser.createdAt?.split("T")[0]}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 opacity-60"><Shield size={14} /> Privacy</span>
                      <span className="text-green-500 font-bold">High</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column: Editable Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-base-100 rounded-[2.5rem] p-8 border border-base-300 shadow-sm space-y-8">
              
              {/* Full Name Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                   <label className="text-xs font-bold uppercase tracking-[0.2em] text-base-content/40 flex items-center gap-2">
                      <User size={14} /> Legal Identity
                   </label>
                   {!isEditingName ? (
                     <button onClick={() => setIsEditingName(true)} className="text-primary text-xs font-bold hover:underline">Edit ID</button>
                   ) : (
                     <button onClick={handleUpdateName} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"><Save size={12} /> Sync Changes</button>
                   )}
                </div>
                {isEditingName ? (
                  <input type="text" className="input input-bordered w-full h-12 bg-base-200/50 rounded-2xl focus:border-primary border-2 transition-all font-bold" value={fullName} onChange={(e) => setFullName(e.target.value)} autoFocus />
                ) : (
                  <div className="px-5 py-4 bg-base-200/30 rounded-2xl border border-base-300 font-bold text-lg">{authUser?.fullName}</div>
                )}
              </div>

              {/* Email Section (Read Only) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-base-content/40 flex items-center gap-2">
                   <Mail size={14} /> Frequency Address
                </label>
                <div className="px-5 py-4 bg-base-200/30 rounded-2xl border border-base-300 font-medium opacity-70">{authUser?.email}</div>
              </div>

              {/* About/Bio Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-base-content/40 flex items-center gap-2">
                   <Info size={14} /> Neural Bio
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-32 bg-base-200/50 rounded-2xl focus:border-primary border-2 transition-all resize-none p-5"
                  placeholder="Tell the ecosystem about yourself..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  onBlur={handleUpdateAbout}
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
