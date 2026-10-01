import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck, Trash2, Flame, CornerDownLeft, SmilePlus, Play, Pause, FileCode, Download, MapPin, ExternalLink, Radio, Navigation } from "lucide-react";
import { WALLPAPERS } from "../constants";

const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    const updateProgress = () => { if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100); };
    const onEnded = () => { setIsPlaying(false); setProgress(0); };
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", onEnded);
    return () => { audio.removeEventListener("timeupdate", updateProgress); audio.removeEventListener("ended", onEnded); audio.pause(); };
  }, [src]);
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(err => console.error("Audio play failed:", err));
    setIsPlaying(!isPlaying);
  };
  return (
    <div className="flex items-center gap-3 bg-black/20 p-3 rounded-2xl min-w-[220px]">
       <button onClick={togglePlay} className="size-10 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="translate-x-0.5" />}
       </button>
       <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-100" style={{ width: `${progress}%` }} />
       </div>
       <span className="text-[10px] font-black opacity-50 mr-1">Voice</span>
    </div>
  );
};

const FileAttachment = ({ url, name, type }) => {
  return (
    <div className="flex flex-col bg-black/10 rounded-2xl overflow-hidden border border-white/10 min-w-[260px]">
       <div className="p-4 flex items-center gap-4 bg-base-100/50 backdrop-blur-sm">
          <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner"><FileCode size={24} /></div>
          <div className="flex-1 min-w-0">
             <p className="text-sm font-black truncate leading-none mb-1">{name || "Document"}</p>
             <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{type?.split('/')[1] || 'File'}</p>
          </div>
       </div>
       <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-base-100 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all border-t border-white/5">
          <Download size={14} /> Download Document
       </a>
    </div>
  );
};

const LocationCard = ({ lat, lng, isLive, isActive, isMyMessage, onStop }) => {
  const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  return (
    <div className="bg-base-100 rounded-3xl overflow-hidden shadow-2xl min-w-[280px] border border-base-300">
       <div className={`p-3 flex items-center justify-between ${isLive ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
          <div className="flex items-center gap-3">
             <div className={`size-8 rounded-xl flex items-center justify-center ${isLive ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {isLive ? <Radio size={16} className="animate-pulse" /> : <MapPin size={16} />}
             </div>
             <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">{isLive ? 'Live' : 'Pin'}</p>
                <h4 className="text-xs font-bold">{isLive ? 'Real-Time' : 'Location'}</h4>
             </div>
          </div>
       </div>
       <div className="h-32 relative group"><iframe title="map" width="100%" height="100%" frameBorder="0" src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`} className="opacity-90 contrast-125 pointer-events-none" /></div>
       <div className="p-3 bg-base-100 flex gap-2">
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex-1 btn btn-xs btn-primary rounded-lg text-[10px] font-black uppercase">Open Maps</a>
          {isLive && isActive && isMyMessage && <button onClick={onStop} className="btn btn-xs btn-error btn-outline rounded-lg text-[10px] font-black uppercase">Stop</button>}
       </div>
    </div>
  );
};

const ChatContainer = () => {
  const { messages, getMessages, getGroupMessages, isMessagesLoading, selectedUser, selectedGroup, subscribeToMessages, unsubscribeFromMessages, typingUsers, deleteMessage, setReplyToMessage, addReaction } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const { chatWallpaper, customWallpaper } = useThemeStore();
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const messageEndRef = useRef(null);
  const selectedWallpaper = WALLPAPERS.find(w => w.id === chatWallpaper) || WALLPAPERS[0];

  useEffect(() => {
    if (selectedGroup) getGroupMessages(selectedGroup._id);
    else if (selectedUser) getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, selectedGroup?._id, getMessages, getGroupMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const handleStopLiveLocation = (messageId) => { if (socket) socket.emit("stopLiveLocation", { messageId, to: selectedUser._id }); };

  if (isMessagesLoading) return <div className="flex-1 flex flex-col overflow-auto"><ChatHeader /><MessageSkeleton /><MessageInput /></div>;

  return (
    <div className="flex-1 flex flex-col overflow-auto relative">
      <ChatHeader />
      {chatWallpaper === "custom" && customWallpaper ? (
         <div className="absolute inset-0 z-0"><img src={customWallpaper} className="size-full object-cover" alt="" /></div>
      ) : (
        <div className={`absolute inset-0 z-0 opacity-100 ${selectedWallpaper.class}`} />
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        {messages.map((message) => {
          const senderId = message.senderId?._id || message.senderId;
          const isMyMessage = senderId === authUser._id;
          const sender = message.senderId?._id ? message.senderId : (isMyMessage ? authUser : (selectedUser || {}));
          
          const hasImage = !!message.image;
          const hasAudio = !!message.audio;
          const hasFile = !!message.fileUrl;
          const hasLocation = !!message.location?.lat;
          const isMedia = hasImage || hasAudio || hasFile || hasLocation;

          return (
            <div key={message._id} className={`chat ${isMyMessage ? "chat-end" : "chat-start"}`} ref={messageEndRef} onMouseEnter={() => setHoveredMessageId(message._id)} onMouseLeave={() => setHoveredMessageId(null)}>
              <div className=" chat-image avatar">
                <div className="size-10 rounded-full border border-white/20"><img src={sender.profilePic || "/avatar.png"} alt="" /></div>
              </div>
              <div className="chat-header mb-1 flex items-center gap-1">
                {selectedGroup && !isMyMessage && <span className="text-xs font-bold mr-2 text-primary">{sender.fullName}</span>}
                <time className="text-[10px] opacity-50">{formatMessageTime(message.createdAt)}</time>
              </div>
              
              <div className="relative group">
                {hoveredMessageId === message._id && (
                   <div className={`absolute top-0 flex gap-1 z-30 animate-in fade-in slide-in-from-bottom-2 ${isMyMessage ? "right-full mr-2" : "left-full ml-2"}`}>
                      <button onClick={() => setReplyToMessage(message)} className="p-1.5 rounded-full bg-base-100 border border-base-300 shadow-md hover:bg-primary hover:text-white transition-all"><CornerDownLeft size={14} /></button>
                      <button onClick={() => deleteMessage(message._id)} className="p-1.5 rounded-full bg-base-100 border border-base-300 shadow-md hover:bg-error hover:text-white transition-all"><Trash2 size={14} /></button>
                   </div>
                )}

                {message.replyTo && (
                  <div className="mb-1 p-2 bg-black/10 rounded-xl border-l-4 border-primary text-[10px] max-w-[200px] opacity-80">
                     <p className="font-black uppercase tracking-tighter opacity-50 text-[8px]">Replied to</p>
                     <p className="truncate italic">&quot;{message.replyTo.text || "Media Attachment"}&quot;</p>
                  </div>
                )}

                <div className={`chat-bubble flex flex-col relative shadow-md overflow-hidden min-w-[80px]
                  ${isMyMessage ? "bg-primary text-primary-content" : "bg-base-200"}
                  ${isMedia ? "p-1.5" : "p-3"}`}>
                  
                  {hasAudio && <AudioPlayer src={message.audio} />}
                  {hasFile && <FileAttachment url={message.fileUrl} name={message.fileName} type={message.fileType} />}
                  {hasLocation && <LocationCard lat={message.location.lat} lng={message.location.lng} isLive={message.isLiveLocation} isActive={message.isLiveActive} isMyMessage={isMyMessage} onStop={() => handleStopLiveLocation(message._id)} />}
                  {hasImage && <img src={message.image} alt="" className="max-w-[280px] rounded-2xl shadow-lg border border-white/10" />}
                  
                  {message.text && <p className={`text-sm leading-relaxed ${isMedia ? "p-3 font-medium bg-black/5 rounded-b-2xl mt-1" : ""}`}>{message.text}</p>}
                  
                  <div className={`flex items-center justify-end gap-1 mt-1 ${isMedia ? "px-3 pb-2" : ""}`}>
                     {message.selfDestruct && <Flame size={12} className="text-orange-500 animate-pulse" fill="currentColor" />}
                     {isMyMessage && !selectedGroup && (message.isSeen ? <CheckCheck size={14} className="text-blue-400" /> : <Check size={14} className="opacity-40" />)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
};
export default ChatContainer;
