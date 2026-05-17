import { useEffect, useRef } from "react";
import { useCallStore } from "../store/useCallStore";
import { useAuthStore } from "../store/useAuthStore";
import { PhoneOff, Mic, MicOff, Video, VideoOff, Maximize } from "lucide-react";

const CallInterface = () => {
  const { localStream, remoteStream, callAccepted, callEnded, endCall, call, isReceivingCall } = useCallStore();
  const { authUser } = useAuthStore();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (callEnded || (!localStream && !isReceivingCall)) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center p-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-base-900 to-black opacity-50" />

      {/* Main Video Area */}
      <div className="relative w-full max-w-5xl aspect-video bg-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
        
        {/* Remote Video (Full Screen in Container) */}
        {callAccepted ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full flex flex-col items-center justify-center gap-6">
             <div className="size-32 rounded-full bg-primary/10 animate-pulse flex items-center justify-center border-2 border-primary/20">
                <div className="size-24 rounded-full bg-primary/20 animate-ping" />
             </div>
             <p className="text-primary font-black uppercase tracking-[0.3em] text-sm animate-pulse">
                Establishing Frequency...
             </p>
          </div>
        )}

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-6 right-6 w-48 aspect-video bg-black rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl z-20 transition-all hover:scale-105">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="size-full object-cover"
          />
        </div>

        {/* Call Info Overlay */}
        <div className="absolute top-8 left-8 z-20 flex items-center gap-4 bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
           <div className="size-3 bg-green-500 rounded-full animate-pulse" />
           <div>
              <p className="text-white font-bold text-sm">{call?.name || "Secure Connection"}</p>
              <p className="text-white/50 text-[10px] uppercase tracking-widest">Quantum Encrypted</p>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="mt-12 flex items-center gap-6 z-20">
         <button className="btn btn-circle btn-lg bg-white/5 border-white/10 hover:bg-white/10 text-white backdrop-blur-xl">
            <Mic size={24} />
         </button>
         <button className="btn btn-circle btn-lg bg-white/5 border-white/10 hover:bg-white/10 text-white backdrop-blur-xl">
            <Video size={24} />
         </button>
         
         <button 
          onClick={endCall}
          className="btn btn-circle btn-lg btn-error shadow-2xl shadow-error/20 hover:scale-110 transition-all mx-4"
         >
            <PhoneOff size={28} />
         </button>

         <button className="btn btn-circle btn-lg bg-white/5 border-white/10 hover:bg-white/10 text-white backdrop-blur-xl">
            <Maximize size={24} />
         </button>
      </div>
    </div>
  );
};

export default CallInterface;
