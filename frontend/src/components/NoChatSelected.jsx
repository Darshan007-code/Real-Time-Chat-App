import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse delay-700" />

      <div className="max-w-md text-center space-y-8 relative z-10">
        {/* Animated Icon Container */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative group">
            <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center animate-bounce shadow-2xl shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
              <MessageSquare className="size-10 text-primary" />
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-2 -right-2 size-4 bg-secondary rounded-full animate-ping" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            CHATTY ECOSYSTEM
          </h2>
          <p className="text-base-content/60 font-medium">
            Select a frequency from the terminal to initiate a secure connection.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 hover:border-primary/30 transition-colors">
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Global</div>
            <p className="text-[10px] opacity-50 uppercase">Public Groups</p>
          </div>
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 hover:border-primary/30 transition-colors">
            <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Secure</div>
            <p className="text-[10px] opacity-50 uppercase">Encrypted ID</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
