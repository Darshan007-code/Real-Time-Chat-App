const Logo = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  return (
    <div className={`relative ${sizeClasses[size]} group perspective-1000`}>
      {/* Solar Glow Layer - Orange & Coral */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 via-rose-400 to-amber-400 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
      
      {/* Main Glass Body - Warm Tinted Glass */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl 
                    shadow-[0_15px_40px_-5px_rgba(249,115,22,0.25)] 
                    transform rotate-x-12 rotate-y-[-12deg] group-hover:rotate-x-0 group-hover:rotate-y-0
                    transition-all duration-700 ease-out flex items-center justify-center
                    overflow-hidden">
        
        {/* Golden Shine Effect */}
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-orange-100/30 to-transparent 
                      group-hover:left-full transition-all duration-1000 ease-in-out skew-x-12" />
        
        {/* Animated Internal Warmth */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-rose-500/5 animate-pulse" />

        {/* Icon with Sunset Gradient */}
        <div className="relative transform translate-z-10 group-hover:scale-110 transition-transform duration-500">
          <svg
            width={iconSizes[size]}
            height={iconSizes[size]}
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#solar-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_4px_10px_rgba(249,115,22,0.4)]"
          >
            <defs>
              <linearGradient id="solar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 9h8" />
            <path d="M8 13h6" />
          </svg>
        </div>
      </div>

      {/* Solar Floating Sparkle */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
         <div className="size-1.5 bg-white rounded-full" />
      </div>
    </div>
  );
};

export default Logo;
