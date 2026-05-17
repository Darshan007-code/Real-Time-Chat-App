import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";
import Logo from "../components/Logo";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden">
        {/* Background Blur Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-3 group">
              <div className="relative">
                <Logo size="lg" />
                <div className="absolute -top-1 -right-1 bg-primary text-primary-content rounded-full p-1 shadow-lg animate-pulse scale-75">
                  <Sparkles size={14} fill="currentColor" />
                </div>
              </div>
              <div className="space-y-0.5">
                <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-br from-base-content via-primary to-purple-600 bg-clip-text text-transparent uppercase">
                  CHATTY ID
                </h1>
                <p className="text-base-content/50 font-medium tracking-widest text-[10px] uppercase">
                  Join the Global Network
                </p>
              </div>
            </div>
          </div>

          <div className="bg-base-200/50 backdrop-blur-sm p-8 rounded-3xl border border-base-300 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold opacity-70">Full Name</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <User className="size-5 opacity-40" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 bg-base-100 focus:border-primary transition-all rounded-2xl"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold opacity-70">Email Address</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <Mail className="size-5 opacity-40" />
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
                    <Lock className="size-5 opacity-40" />
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
                      <EyeOff className="size-5 opacity-40" />
                    ) : (
                      <Eye className="size-5 opacity-40" />
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full h-12 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98] mt-4" 
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-5 animate-spin" />
                    <span>Deploying...</span>
                  </div>
                ) : (
                  "Create Digital ID"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-base-content/60 text-sm">
                Already have an ID?{" "}
                <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                  Access Terminal
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <AuthImagePattern
        title="Chatty"
        subtitle="Join our global community of innovators and creators. Build connections that matter."
      />
    </div>
  );
};
export default SignUpPage;
