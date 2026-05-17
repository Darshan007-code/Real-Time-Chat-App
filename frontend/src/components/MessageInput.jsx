import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X, Smile, Flame, CornerDownRight, Mic, MicOff, Loader2, Trash2, FileText, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import LocationPickerModal from "./LocationPickerModal";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSelfDestruct, setIsSelfDestruct] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const liveLocationWatchId = useRef(null);
  
  const { sendMessage, sendTypingStatus, sendStopTypingStatus, replyToMessage, setReplyToMessage, selectedUser } = useChatStore();
  const { socket } = useAuthStore();
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (liveLocationWatchId.current) navigator.geolocation.clearWatch(liveLocationWatchId.current);
    };
  }, []);

  const handleInputChange = (e) => {
    setText(e.target.value);
    sendTypingStatus();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendStopTypingStatus();
    }, 3000);
  };

  const handleLocationSelect = async (coords, isLive) => {
    try {
      const res = await sendMessage({
        location: coords,
        isLiveLocation: isLive
      });

      if (isLive && res && socket) {
        toast.success("Live location started");
        
        // Start watching position and emitting updates
        liveLocationWatchId.current = navigator.geolocation.watchPosition(
          (pos) => {
            const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            socket.emit("updateLiveLocation", {
              messageId: res._id,
              coords: newCoords,
              to: selectedUser._id
            });
          },
          (err) => console.error(err),
          { enableHighAccuracy: true }
        );
      } else {
        toast.success("Location pin shared");
      }
    } catch (err) {
      toast.error("Failed to share location");
    }
  };

  const onEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingMedia(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        await sendMessage({ file: reader.result, fileName: file.name, fileType: file.type });
        toast.success("Document sent");
      } finally {
        setIsUploadingMedia(false);
      }
    };
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => setRecordingDuration(prev => prev + 1), 1000);
    } catch (error) {
      toast.error("Mic access denied");
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = null;
    }
    cleanupRecording();
  };

  const finishAndSendVoice = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        setIsUploadingMedia(true);
        try {
          await sendMessage({ audio: reader.result });
        } finally {
          setIsUploadingMedia(false);
        }
      };
      cleanupRecording();
    };
    mediaRecorderRef.current.stop();
  };

  const cleanupRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    await sendMessage({ text: text.trim(), image: imagePreview, selfDestruct: isSelfDestruct });
    setText(""); setImagePreview(null);
  };

  return (
    <div className="p-4 w-full relative z-20 bg-base-100/50 backdrop-blur-lg border-t border-base-300">
      
      {replyToMessage && (
        <div className="mb-2 p-3 bg-base-200 rounded-2xl flex items-center justify-between border-l-4 border-primary">
           <div className="flex items-center gap-3 overflow-hidden text-xs">
              <CornerDownRight size={14} className="text-primary flex-shrink-0" />
              <p className="opacity-70 truncate">Replying to: {replyToMessage.text || "Media"}</p>
           </div>
           <button onClick={() => setReplyToMessage(null)} className="btn btn-ghost btn-xs btn-circle"><X size={14} /></button>
        </div>
      )}

      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 z-10 left-4 shadow-2xl">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

      <div className="flex items-center gap-2">
        {isRecording ? (
           <div className="flex-1 flex items-center justify-between bg-base-200 p-2 px-4 rounded-[2rem] border-2 border-primary/20 animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-3">
                 <div className="size-2 bg-red-500 rounded-full animate-ping" />
                 <span className="text-sm font-bold font-mono">{formatDuration(recordingDuration)}</span>
              </div>
              <div className="flex items-center gap-2">
                 <button onClick={cancelRecording} className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10"><Trash2 size={18} /></button>
                 <button onClick={finishAndSendVoice} className="btn btn-primary btn-sm rounded-full px-4 gap-2 font-bold shadow-lg shadow-primary/20"><Send size={14} /> SEND</button>
              </div>
           </div>
        ) : isUploadingMedia ? (
            <div className="flex-1 flex items-center gap-4 bg-primary/5 p-3 rounded-[2rem] animate-pulse">
                <Loader2 size={18} className="animate-spin text-primary ml-2" />
                <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Syncing Frequency...</span>
            </div>
        ) : (
          <>
            <div className="flex-1 flex items-center gap-2 bg-base-200 px-3 py-1 rounded-[2rem] border border-base-300 focus-within:border-primary/50 transition-all">
                <button type="button" className={`btn btn-ghost btn-sm btn-circle ${showEmojiPicker ? "text-primary" : "opacity-40"}`} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <Smile size={20} />
                </button>
                <input 
                    type="text" 
                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-sm h-10 px-1" 
                    placeholder="Type a message..." 
                    value={text} 
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                />

                <div className="flex items-center">
                  <button type="button" className="btn btn-ghost btn-sm btn-circle opacity-40 hover:text-primary" onClick={() => docInputRef.current?.click()} title="Send Document">
                      <FileText size={20} />
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm btn-circle opacity-40 hover:text-primary" onClick={() => setIsLocationModalOpen(true)} title="Share Location">
                      <MapPin size={20} />
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm btn-circle opacity-40 hover:text-primary" onClick={() => fileInputRef.current?.click()} title="Send Image">
                      <Image size={20} />
                  </button>
                </div>

                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                <input type="file" ref={docInputRef} className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
            </div>

            {text.trim() || imagePreview ? (
                <button onClick={handleSendMessage} className="btn btn-circle btn-primary shadow-lg shadow-primary/20">
                    <Send size={20} className="translate-x-0.5" />
                </button>
            ) : (
                <button onClick={startRecording} className="btn btn-circle btn-primary shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all">
                    <Mic size={22} />
                </button>
            )}
          </>
        )}
      </div>

      {isLocationModalOpen && (
        <LocationPickerModal 
          onSelect={handleLocationSelect} 
          onClose={() => setIsLocationModalOpen(false)} 
        />
      )}
    </div>
  );
};
export default MessageInput;
