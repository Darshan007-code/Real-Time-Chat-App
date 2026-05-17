import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCallStore } from "../store/useCallStore";
import { X, Phone, Video, Info, Shield, Bell, Image, Users, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, selectedGroup, setSelectedGroup } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { initiateCall } = useCallStore();
  const [showInfo, setShowInfo] = useState(false);

  const handleClose = () => {
    setSelectedUser(null);
    setSelectedGroup(null);
  };

  const handleCall = (type) => {
    if (selectedGroup) {
      return toast.error("Group calling is not supported in this version.");
    }
    
    if (!onlineUsers.includes(selectedUser._id)) {
      return toast.error(`${selectedUser.fullName} is currently offline.`);
    }

    initiateCall(selectedUser._id, type);
  };

  const displayName = selectedGroup ? selectedGroup.name : selectedUser?.fullName || "Unknown";
  const displayAvatar = selectedGroup ? selectedGroup.avatar : selectedUser?.profilePic;
  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);
  
  const status = selectedGroup 
    ? `${selectedGroup.members.length} members`
    : (isOnline ? "Online" : "Offline");

  if (!selectedUser && !selectedGroup) return null;

  return (
    <>
      <div className="p-3 border-b border-base-300 bg-base-100/50 backdrop-blur-md relative z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="avatar">
              <div className="size-10 rounded-2xl relative border border-primary/10 overflow-hidden">
                <img src={displayAvatar || "/avatar.png"} alt={displayName} className="object-cover" />
              </div>
            </div>

            {/* User info */}
            <div className="text-left">
              <h3 className="font-bold text-sm leading-tight flex items-center gap-2">
                {displayName}
                {selectedGroup && <div className="size-1.5 bg-primary rounded-full" />}
              </h3>
              <p className={`text-[10px] font-bold uppercase tracking-widest 
                ${isOnline ? "text-green-500" : "text-base-content/40"}`}>
                {status}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => handleCall("voice")}
              className="btn btn-ghost btn-sm btn-circle hover:bg-primary/10 hover:text-primary transition-all"
              title="Voice Call"
            >
              <Phone size={18} />
            </button>
            <button 
              onClick={() => handleCall("video")}
              className="btn btn-ghost btn-sm btn-circle hover:bg-primary/10 hover:text-primary transition-all"
              title="Video Call"
            >
              <Video size={18} />
            </button>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className={`btn btn-sm btn-circle transition-all ${showInfo ? "bg-primary text-primary-content" : "btn-ghost hover:bg-primary/10 hover:text-primary"}`}
              title="Information"
            >
              <Info size={18} />
            </button>
            <div className="divider divider-horizontal mx-1" />
            <button 
              onClick={handleClose} 
              className="btn btn-ghost btn-sm btn-circle hover:bg-error/10 hover:text-error transition-all"
              title="Close Chat"
            >
              <X size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* INFO SIDEBAR OVERLAY */}
      {showInfo && (
        <div className="absolute top-[65px] right-0 bottom-0 w-80 bg-base-100 border-l border-base-300 z-30 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
           <div className="p-6 text-center border-b border-base-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-br from-primary/10 to-transparent" />
              <img src={displayAvatar || "/avatar.png"} className="size-24 rounded-[2rem] object-cover mx-auto mb-4 border-2 border-base-300 shadow-lg relative z-10" alt="" />
              <h4 className="font-black text-xl tracking-tight relative z-10">{displayName}</h4>
              <p className="text-xs font-bold opacity-40 uppercase tracking-widest relative z-10">{selectedGroup ? "Community Node" : "Verified User"}</p>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                 <h5 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Security Protocol</h5>
                 <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-2xl border border-base-300">
                    <Shield size={18} className="text-green-500" />
                    <div>
                       <p className="text-xs font-bold">End-to-End Encrypted</p>
                       <p className="text-[9px] opacity-50">Secure Quantum Tunnel Active</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h5 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Media Gallery</h5>
                 <div className="grid grid-cols-3 gap-2">
                    {[1,2,3].map(i => (
                       <div key={i} className="aspect-square bg-base-200 rounded-xl flex items-center justify-center border border-base-300 overflow-hidden group hover:border-primary/50 transition-colors">
                          <Image size={16} className="opacity-20 group-hover:scale-110 group-hover:opacity-50 transition-all" />
                       </div>
                    ))}
                 </div>
              </div>

              {selectedGroup && (
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Network Members</h5>
                   <div className="flex -space-x-3 overflow-hidden">
                      {selectedGroup.members.slice(0, 5).map((m, i) => (
                         <img key={i} className="inline-block size-8 rounded-xl ring-2 ring-base-100 object-cover" src={m.profilePic || "/avatar.png"} alt="" />
                      ))}
                      {selectedGroup.members.length > 5 && (
                        <div className="size-8 rounded-xl bg-base-300 flex items-center justify-center text-[10px] font-bold ring-2 ring-base-100">
                           +{selectedGroup.members.length - 5}
                        </div>
                      )}
                   </div>
                </div>
              )}
           </div>

           <div className="p-6 border-t border-base-300">
              <button className="w-full btn btn-sm btn-ghost hover:bg-error/10 hover:text-error rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px]">
                 <LogOut size={14} /> Leave Connection
              </button>
           </div>
        </div>
      )}
    </>
  );
};
export default ChatHeader;
