import { useCallStore } from "../store/useCallStore";
import { Phone, X, PhoneOff } from "lucide-react";

const IncomingCallModal = () => {
  const { isReceivingCall, call, answerCall, rejectCall } = useCallStore();

  if (!isReceivingCall || !call) return null;

  return (
    <div className="fixed top-20 right-8 z-[250] w-80 animate-in slide-in-from-right duration-500">
      <div className="bg-base-100 rounded-[2rem] shadow-2xl border border-primary/20 overflow-hidden backdrop-blur-xl bg-opacity-90">
         <div className="p-6 text-center space-y-4">
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
               <img src={call.profilePic || "/avatar.png"} className="size-20 rounded-2xl object-cover border-2 border-primary relative z-10" alt="" />
            </div>
            
            <div>
               <h3 className="font-black text-lg tracking-tight">{call.name}</h3>
               <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">Incoming {call.callType} call</p>
            </div>

            <div className="flex justify-center gap-4 pt-2">
               <button 
                onClick={rejectCall}
                className="btn btn-circle btn-error shadow-lg shadow-error/20 hover:scale-110 transition-all"
               >
                  <PhoneOff size={20} className="rotate-[135deg]" />
               </button>
               <button 
                onClick={answerCall}
                className="btn btn-circle btn-success shadow-lg shadow-success/20 hover:scale-110 transition-all animate-bounce"
               >
                  <Phone size={20} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
