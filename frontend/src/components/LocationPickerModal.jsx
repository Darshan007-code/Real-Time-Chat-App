import { useState, useEffect } from "react";
import { X, MapPin, Navigation, Send, Loader2, Radio } from "lucide-react";
import toast from "react-hot-toast";

const LocationPickerModal = ({ onSelect, onClose }) => {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      onClose();
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        toast.error("GPS Signal Weak or Denied");
        onClose();
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleSend = () => {
    if (coords) {
      onSelect(coords, isLive);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-base-100 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-white/10">
        
        {/* Header */}
        <div className="p-6 bg-base-200 flex items-center justify-between border-b border-base-300">
           <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                 <MapPin size={22} />
              </div>
              <div>
                 <h3 className="font-black text-lg tracking-tight uppercase">Share Location</h3>
                 <p className="text-[10px] font-bold opacity-40 tracking-widest uppercase">Secure GPS Frequency</p>
              </div>
           </div>
           <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
              <X size={20} />
           </button>
        </div>

        {/* Map Preview Area */}
        <div className="relative aspect-video bg-base-300 flex items-center justify-center overflow-hidden">
           {loading ? (
             <div className="flex flex-col items-center gap-4 text-primary">
                <Loader2 size={40} className="animate-spin" />
                <p className="text-xs font-black uppercase tracking-[0.3em]">Locating Node...</p>
             </div>
           ) : (
             <iframe
               title="map"
               width="100%"
               height="100%"
               frameBorder="0"
               scrolling="no"
               marginHeight="0"
               marginWidth="0"
               src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
               className="grayscale contrast-125 opacity-80"
             />
           )}
           {isLive && <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse shadow-lg z-20">LIVE TRACKING</div>}
           <div className="absolute inset-0 pointer-events-none border-4 border-inset border-base-100/20" />
        </div>

        {/* Options */}
        <div className="p-8 space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsLive(false)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${!isLive ? "border-primary bg-primary/10 shadow-lg shadow-primary/10" : "border-base-300 hover:border-primary/50"}`}
              >
                 <MapPin size={20} className={!isLive ? "text-primary" : "opacity-40"} />
                 <span className="text-[10px] font-black uppercase">Current Pin</span>
              </button>
              <button 
                onClick={() => setIsLive(true)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${isLive ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/10" : "border-base-300 hover:border-red-500/50"}`}
              >
                 <Radio size={20} className={isLive ? "text-red-500" : "opacity-40"} />
                 <span className="text-[10px] font-black uppercase">Live Location</span>
              </button>
           </div>

           <button 
            onClick={handleSend}
            disabled={loading}
            className={`btn w-full h-14 rounded-2xl text-lg font-black gap-3 shadow-xl transition-all active:scale-95 ${isLive ? "btn-error shadow-red-500/20" : "btn-primary shadow-primary/20"}`}
           >
              <Send size={20} /> {isLive ? "START LIVE SHARING" : "SEND CURRENT PIN"}
           </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;
