import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AuthModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast.success("Registration successful! Check your email to confirm.");
        onClose();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back to ConvertX Pro!");
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An authentication error occurred.");
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl p-6 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Title / Logo */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                {isSignUp ? "Create an Account" : "Welcome Back"}
              </h2>
              <p className="mt-1.5 text-xs font-medium text-muted-foreground">
                {isSignUp
                  ? "Sign up to securely sync and store your conversion history."
                  : "Sign in to keep your session and conversion history active."}
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11 w-full rounded-xl border border-border bg-secondary/50 pl-10 pr-4 text-sm font-medium transition-all focus:border-primary focus:bg-background focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-secondary/50 pl-10 pr-4 text-sm font-medium transition-all focus:border-primary focus:bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-secondary/50 pl-10 pr-4 text-sm font-medium transition-all focus:border-primary focus:bg-background focus:outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="gradient-primary h-11 w-full rounded-xl border-0 font-bold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:scale-[1.02]"
              >
                {loading
                  ? "Processing..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </Button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center text-xs">
              <span className="text-muted-foreground">
                {isSignUp ? "Already have an account?" : "New to ConvertX Pro?"}
              </span>{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg("");
                }}
                className="font-bold text-primary hover:underline"
              >
                {isSignUp ? "Sign In" : "Create an account"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
