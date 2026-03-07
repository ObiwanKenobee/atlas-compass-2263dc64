import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, ArrowLeft } from "lucide-react";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    if (mode === "forgot") {
      const { error } = await resetPassword(email);
      if (error) setError(error.message);
      else setMessage("Check your email for a password reset link.");
      setSubmitting(false);
      return;
    }

    const fn = mode === "login" ? signIn : signUp;
    const { error } = await fn(email, password);
    if (error) {
      setError(error.message);
    } else if (mode === "signup") {
      setMessage("Check your email to confirm your account.");
    } else {
      navigate("/admin");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-sage/10">
            <Activity className="h-5 w-5 text-sage" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Atlas Sanctum</h1>
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {mode === "login" ? "Admin Login" : mode === "signup" ? "Create Account" : "Reset Password"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
              placeholder="admin@atlassanctum.io"
            />
          </div>

          {mode !== "forgot" && (
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <div className="rounded-md bg-rose/10 border border-rose/20 px-3 py-2 text-xs text-rose">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-md bg-sage/10 border border-sage/20 px-3 py-2 text-xs text-sage">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-sage px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-sage/90 disabled:opacity-50"
          >
            {submitting
              ? "..."
              : mode === "login"
              ? "Sign In"
              : mode === "signup"
              ? "Create Account"
              : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-4 space-y-2 text-center">
          {mode === "login" && (
            <>
              <button
                onClick={() => setMode("forgot")}
                className="block w-full text-xs text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </button>
              <button
                onClick={() => setMode("signup")}
                className="block w-full text-xs text-muted-foreground hover:text-foreground"
              >
                Don't have an account? <span className="text-sage">Sign up</span>
              </button>
            </>
          )}
          {mode === "signup" && (
            <button
              onClick={() => setMode("login")}
              className="block w-full text-xs text-muted-foreground hover:text-foreground"
            >
              Already have an account? <span className="text-sage">Sign in</span>
            </button>
          )}
          {mode === "forgot" && (
            <button
              onClick={() => setMode("login")}
              className="flex items-center justify-center gap-1 w-full text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Back to login
            </button>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
