import { useEffect, useState, useRef } from "react";
import { useStoryStore } from "../store/useStoryStore";
import { useAuthStore } from "../store/useAuthStore";
import { Plus, Loader2 } from "lucide-react";
import StoryViewer from "./StoryViewer";

const StoryStrip = () => {
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
    <div className="flex items-center gap-4 px-5 py-4 overflow-x-auto no-scrollbar border-b border-base-300 bg-base-100/50">
      
      {/* My Story Creator */}
      <div className="flex flex-col items-center gap-1 min-w-[64px]">
        <div className="relative group">
           <div className="size-14 rounded-full p-0.5 border-2 border-dashed border-base-300 group-hover:border-primary transition-all">
              <img src={authUser.profilePic || "/avatar.png"} className="size-full rounded-full object-cover grayscale-[50%] group-hover:grayscale-0 transition-all" alt="" />
           </div>
           <button 
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 size-5 bg-primary text-primary-content rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
           >
              {isUploadingStory ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
           </button>
           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
        </div>
        <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-tighter">My Status</span>
      </div>

      {/* Others Stories */}
      {stories.map((item) => (
        <button
          key={item.user._id}
          onClick={() => setSelectedUserStories(item)}
          className="flex flex-col items-center gap-1 min-w-[64px] group"
        >
          <div className="size-14 rounded-full p-0.5 border-2 border-primary animate-pulse group-hover:scale-105 transition-all">
             <img src={item.user.profilePic || "/avatar.png"} className="size-full rounded-full object-cover" alt="" />
          </div>
          <span className="text-[10px] font-bold truncate w-full text-center uppercase tracking-tighter">
            {item.user.fullName.split(" ")[0]}
          </span>
        </button>
      ))}

      {isStoriesLoading && stories.length === 0 && (
         <div className="flex gap-4">
            {[1,2,3].map(i => (
               <div key={i} className="size-14 rounded-full bg-base-300 animate-pulse" />
            ))}
         </div>
      )}

      {selectedUserStories && (
        <StoryViewer 
          userStories={selectedUserStories} 
          onClose={() => setSelectedUserStories(null)} 
        />
      )}
    </div>
  );
};

export default StoryStrip;
