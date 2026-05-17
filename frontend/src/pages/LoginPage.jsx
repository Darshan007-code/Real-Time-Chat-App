import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import Logo from "../components/Logo";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-base-100">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden">
        {/* Background Blur Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-4 group">
              <div className="relative">
                <Logo size="xl" />
                <div className="absolute -top-2 -right-2 bg-primary text-primary-content rounded-full p-1 shadow-lg animate-pulse">
                  <Sparkles size={16} fill="currentColor" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-base-content via-primary to-purple-600 bg-clip-text text-transparent">
                  CHATTY
                </h1>
                <p className="text-base-content/50 font-medium tracking-widest text-xs uppercase">
                  The Future of Real-time Connection
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-base-200/50 backdrop-blur-sm p-8 rounded-3xl border border-base-300 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold opacity-70">Email Address</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <Mail className="h-5 w-5 opacity-40" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10 bg-base-100 focus:border-primary transition-all rounded-2xl"
                    placeholder="you@zenith.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold opacity-70">Password</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <Lock className="h-5 w-5 opacity-40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10 bg-base-100 focus:border-primary transition-all rounded-2xl"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 opacity-40" />
                    ) : (
                      <Eye className="h-5 w-5 opacity-40" />
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full h-12 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]" 
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Syncing...</span>
                  </div>
                ) : (
                  "Access Terminal"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-base-content/60 text-sm">
                New to the ecosystem?{" "}
                <Link to="/signup" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                  Create ID
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Chatty"}
        subtitle={"Join the next generation of real-time communication. Fast, secure, and infinitely connected."}
      />
    </div>
  );
};
export default LoginPage;
