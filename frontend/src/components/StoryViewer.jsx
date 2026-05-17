import { useState, useEffect } from "react";
import { useStoryStore } from "../store/useStoryStore";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const StoryViewer = ({ userStories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { viewStory } = useStoryStore();
  const stories = userStories.stories;

  useEffect(() => {
    // Mark as viewed
    viewStory(stories[currentIndex]._id);

    // Auto progress
    const timer = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, stories]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const story = stories[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white z-50">
        <X size={32} />
      </button>

      <div className="relative w-full max-w-lg aspect-[9/16] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
        {/* Progress Bars */}
        <div className="absolute top-4 inset-x-4 flex gap-1 z-50">
          {stories.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-[5000ms] ease-linear
                  ${i < currentIndex ? "w-full" : i === currentIndex ? "w-full" : "w-0"}`}
              />
            </div>
          ))}
        </div>

        {/* User Info */}
        <div className="absolute top-10 left-4 flex items-center gap-3 z-50">
           <div className="size-10 rounded-full border-2 border-primary overflow-hidden">
              <img src={userStories.user.profilePic || "/avatar.png"} alt="" className="size-full object-cover" />
           </div>
           <div>
              <p className="text-white font-bold text-sm shadow-md">{userStories.user.fullName}</p>
              <p className="text-white/50 text-[10px]">Active Update</p>
           </div>
        </div>

        {/* Content */}
        <img src={story.imageUrl} className="size-full object-contain" alt="Story" />
        
        {story.caption && (
          <div className="absolute bottom-12 inset-x-0 p-8 text-center bg-gradient-to-t from-black/80 to-transparent">
             <p className="text-white text-lg font-medium">{story.caption}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-white transition-colors">
          <ChevronLeft size={48} />
        </button>
        <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-white transition-colors">
          <ChevronRight size={48} />
        </button>
      </div>
    </div>
  );
};

export default StoryViewer;
