import { useEffect, useState, useRef } from "react";
import { useStoryStore } from "../store/useStoryStore";
import { useAuthStore } from "../store/useAuthStore";
import { Plus, Loader2, Camera, User } from "lucide-react";
import StoryViewer from "./StoryViewer";

const StatusCenter = () => {
  const { stories, getStories, createStory, isStoriesLoading, isUploadingStory } = useStoryStore();
  const { authUser } = useAuthStore();
  const [selectedUserStories, setSelectedUserStories] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getStories();
  }, [getStories]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      await createStory({ image: reader.result });
    };
  };

  return (
    <div className="flex flex-col h-full bg-base-100/50">
      
      {/* My Status Card */}
      <div className="p-5 border-b border-base-300">
         <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4">My Status</h3>
         <div className="flex items-center gap-4 p-3 bg-base-100 rounded-3xl border border-base-300 shadow-sm">
            <div className="relative group">
               <div className="size-14 rounded-2xl p-0.5 border-2 border-dashed border-primary">
                  <img src={authUser.profilePic || "/avatar.png"} className="size-full rounded-2xl object-cover" alt="" />
               </div>
               <button 
                onClick={() => fileInputRef.current.click()}
                className="absolute -bottom-1 -right-1 size-6 bg-primary text-primary-content rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 border-base-100"
               >
                  {isUploadingStory ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
               </button>
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>
            <div className="flex-1">
               <p className="font-bold text-sm">Add to Story</p>
               <p className="text-[10px] opacity-50">Share a moment with the network</p>
            </div>
         </div>
      </div>

      {/* Recent Updates List */}
      <div className="flex-1 overflow-y-auto p-5">
         <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4">Recent Updates</h3>
         
         <div className="grid grid-cols-1 gap-3">
            {stories.map((item) => (
              <button
                key={item.user._id}
                onClick={() => setSelectedUserStories(item)}
                className="w-full flex items-center gap-4 p-4 bg-base-100 hover:bg-base-200 rounded-[2rem] border border-base-300 transition-all group"
              >
                <div className="size-14 rounded-2xl p-0.5 border-2 border-primary group-hover:scale-105 transition-all">
                   <img src={item.user.profilePic || "/avatar.png"} className="size-full rounded-2xl object-cover" alt="" />
                </div>
                <div className="text-left flex-1">
                   <p className="font-bold text-sm">{item.user.fullName}</p>
                   <p className="text-[10px] opacity-50 uppercase tracking-tighter">
                     {item.stories.length} new update{item.stories.length > 1 ? 's' : ''}
                   </p>
                </div>
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                   <Plus size={16} />
                </div>
              </button>
            ))}

            {stories.length === 0 && !isStoriesLoading && (
               <div className="text-center py-20 opacity-20">
                  <Camera size={48} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">No status updates yet</p>
               </div>
            )}

            {isStoriesLoading && (
               <div className="flex flex-col gap-3">
                  {[1,2,3].map(i => (
                     <div key={i} className="h-20 w-full rounded-[2rem] bg-base-300 animate-pulse" />
                  ))}
               </div>
            )}
         </div>
      </div>

      {selectedUserStories && (
        <StoryViewer 
          userStories={selectedUserStories} 
          onClose={() => setSelectedUserStories(null)} 
        />
      )}
    </div>
  );
};

export default StatusCenter;
