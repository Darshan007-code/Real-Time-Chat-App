import Logo from "./Logo";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-[#fffbf9] p-12 relative overflow-hidden perspective-2000">
      {/* Solar Flare Background Elements */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-orange-200/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-rose-200/20 rounded-full blur-[120px] -ml-64 -mb-64 animate-pulse delay-700" />
      
      {/* Warm Sophisticated Mesh */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #f97316 1px, transparent 0)`, backgroundSize: '60px 60px' }} />

      <div className="max-w-xl w-full text-center relative z-10 px-4">
        
        {/* SOLAR LOGO AREA - Scaled for Better Fit */}
        <div className="relative h-64 flex items-center justify-center mb-12 group">
          
          {/* Animated Warm Rings - Scaled Down */}
          <div className="absolute size-64 border-2 border-dashed border-orange-500/10 rounded-full animate-[spin_30s_linear_infinite]" />
          <div className="absolute size-48 border border-rose-500/20 rounded-full scale-110 animate-[pulse_4s_ease-in-out_infinite]" />
          
          {/* Main Logo Container with Smooth Pop-Out */}
          <div className="relative animate-[hero-pop-out_1.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
            
            {/* The Floating Logo Wrapper - Scaled Down */}
            <div className="relative z-10 animate-[magnetic-float_6s_ease-in-out_infinite_1.5s] transition-all duration-700 group-hover:scale-105">
               {/* Warm Radiant Glow */}
               <div className="absolute inset-0 bg-orange-500/15 rounded-full blur-[80px] animate-pulse" />
               
               {/* Solar Shield - Reduced Padding */}
               <div className="bg-white/40 backdrop-blur-3xl p-8 rounded-[50px] border border-white/80 shadow-[0_40px_80px_-15px_rgba(249,115,22,0.25)] transform hover:rotate-x-12 hover:-rotate-y-12 transition-transform duration-500">
                  <Logo size="lg" />
               </div>
            </div>

            {/* Floating Solar Particles - Scaled Down */}
            <div className="absolute -top-8 -right-8 size-6 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full blur-[1px] animate-[bounce_4s_infinite] shadow-lg">
                <div className="w-full h-full bg-white/20 rounded-full blur-sm" />
            </div>
            <div className="absolute -bottom-8 -left-8 size-5 bg-gradient-to-tr from-rose-400 to-orange-600 rounded-full blur-[1px] animate-[bounce_5s_infinite_delay-1000] shadow-lg" />
          </div>
        </div>

        {/* Solar Typography - Slightly Smaller Text */}
        <div className="space-y-4 animate-[fade-up_1s_ease-out_0.8s_both]">
          <div className="relative inline-block">
            <h2 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-orange-600 via-rose-500 to-amber-500 bg-clip-text text-transparent uppercase italic">
              {title}
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent mt-1 rounded-full shadow-[0_0_15px_#f97316]" />
          </div>
          
          <p className="text-lg text-orange-950/60 font-medium tracking-tight max-w-sm mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Premium Warm Status */}
        <div className="mt-16 flex items-center justify-center gap-10 animate-[fade-up_1s_ease-out_1.2s_both]">
           <div className="flex items-center gap-3 px-6 py-2.5 bg-orange-500/5 rounded-full border border-orange-500/20 backdrop-blur-md hover:bg-orange-500/10 transition-all group">
              <span className="size-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#f97316]" />
              <span className="text-[11px] font-black tracking-[0.4em] uppercase text-orange-700/70 group-hover:text-orange-800">Quantum Mesh</span>
           </div>
           <div className="flex items-center gap-3 px-6 py-2.5 bg-rose-500/5 rounded-full border border-rose-500/20 backdrop-blur-md hover:bg-rose-500/10 transition-all group">
              <span className="size-2 bg-rose-500 rounded-full animate-pulse delay-500 shadow-[0_0_10px_#f43f5e]" />
              <span className="text-[11px] font-black tracking-[0.4em] uppercase text-rose-700/70 group-hover:text-rose-800">Secure Node</span>
           </div>
        </div>
      </div>
      
      <style>{`
        @keyframes hero-pop-out {
          0% { transform: scale(0) translateZ(-500px) rotateX(45deg); opacity: 0; filter: blur(10px); }
          60% { transform: scale(1.1) translateZ(100px) rotateX(-10deg); opacity: 1; filter: blur(0); }
          100% { transform: scale(1) translateZ(0) rotateX(0); opacity: 1; }
        }
        @keyframes magnetic-float {
          0%, 100% { transform: translateY(0) rotateY(0) rotateX(0); }
          33% { transform: translateY(-15px) rotateY(5deg) rotateX(-5deg); }
          66% { transform: translateY(5px) rotateY(-5deg) rotateX(5deg); }
        }
        @keyframes fade-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AuthImagePattern;
