import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User, Zap } from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-xl bg-base-100/60 transition-all duration-300"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group transition-all duration-300">
              <div className="relative">
                <Logo size="sm" />
                <div className="absolute -top-1 -right-1 bg-primary text-primary-content rounded-full p-0.5 scale-75 animate-bounce">
                    <Zap size={10} fill="currentColor" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <h1 className="text-xl font-black tracking-tighter leading-none bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-primary transition-all duration-500">
                  CHATTY
                </h1>
                <span className="text-[10px] font-bold tracking-[0.2em] text-base-content/40 uppercase leading-none">
                  Chat Ecosystem
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className="btn btn-sm btn-ghost hover:bg-primary/10 hover:text-primary gap-2 transition-all duration-300 rounded-full"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link 
                    to={"/profile"} 
                    className="btn btn-sm btn-ghost hover:bg-primary/10 hover:text-primary gap-2 transition-all duration-300 rounded-full"
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button 
                    className="btn btn-sm btn-ghost text-error hover:bg-error/10 gap-2 transition-all duration-300 rounded-full flex items-center" 
                    onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
