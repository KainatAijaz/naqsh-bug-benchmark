import { isBug } from "@/bugs";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GoldLine from "@/components/GoldLine";

type View = "login" | "signup" | "forgot";

const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const getStrengthScore = (pwd: string) =>
  passwordRequirements.filter((r) => r.test(pwd)).length;

const strengthMeta = [
  { label: "", color: "#e5e7eb" },
  { label: "Weak", color: "#ef4444" },
  { label: "Fair", color: "#f97316" },
  { label: "Good", color: "#eab308" },
  { label: "Strong", color: "#22c55e" },
];

const inputClass =
  "w-full bg-muted border border-border rounded-md px-4 py-3 text-sm font-sans text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 focus:bg-white transition-all";
const labelClass =
  "font-sans text-xs font-semibold tracking-[0.08em] text-foreground/70 uppercase mb-2 block";

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [view, setView] = useState<View>("login");
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [showSignupPwd, setShowSignupPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // Forgot state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoading(false);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    } else {
      if (!rememberMe) sessionStorage.setItem("naqsh-session-temp", "1");
      navigate("/dashboard");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim()) {
      toast({ title: "Name required", description: "Please enter your full name.", variant: "destructive" });
      return;
    }
    if (getStrengthScore(signupPassword) < (isBug("B08") ? 1 : 3)) {
      toast({ title: "Password too weak", description: "Please meet at least 3 of the 4 requirements.", variant: "destructive" });
      return;
    }
    if (!isBug("B09") && signupPassword !== signupConfirm) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords are identical.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupName);
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Check your email to confirm your account, then sign in." });
      setView("login");
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/auth`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Reset failed", description: error.message, variant: "destructive" });
    } else {
      setForgotSent(true);
    }
  };

  const strengthScore = getStrengthScore(signupPassword);
  const { label: strengthLabel, color: strengthColor } = strengthMeta[strengthScore];
  const confirmMismatch = signupConfirm.length > 0 && signupPassword !== signupConfirm;
  const confirmMatch = signupConfirm.length > 0 && signupPassword === signupConfirm;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 pt-24 pb-12">
      <div className="w-full max-w-md">

        {/* Brand mark */}
        <div className="text-center mb-8">
          <Link to="/">
            <span className="font-serif text-3xl font-normal tracking-[0.1em] text-foreground">
              Naqsh <span className="text-primary">نقش</span>
            </span>
          </Link>
        </div>

        <div className="card-luxury p-8 md:p-10">

          {/* ===== FORGOT PASSWORD VIEW ===== */}
          {view === "forgot" ? (
            <>
              <button
                onClick={() => { setView("login"); setForgotSent(false); setForgotEmail(""); }}
                className="flex items-center gap-1.5 font-sans text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft size={12} /> Back to sign in
              </button>

              <p className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-1">Account Recovery</p>
              <h2 className="font-serif text-2xl font-normal text-foreground mb-2">Forgot Password?</h2>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">
                Enter the email linked to your account and we'll send you a reset link.
              </p>

              <GoldLine />

              {forgotSent ? (
                <div className="mt-6 p-5 rounded-sm border border-primary/20 bg-primary/5 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Check size={18} className="text-primary" strokeWidth={2.5} />
                  </div>
                  <p className="font-sans text-sm font-semibold text-foreground mb-1">Reset link sent</p>
                  <p className="font-sans text-xs text-muted-foreground">
                    Check your inbox at <span className="font-medium text-foreground">{forgotEmail}</span> — and your spam folder.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="forgot-email" className={labelClass}>Email Address</label>
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-gold w-full text-center">
                    {loading ? "Sending…" : "Send Reset Link"}
                  </button>
                </form>
              )}
            </>
          ) : (
            /* ===== LOGIN / SIGNUP TABS ===== */
            <>
              {/* Tab toggle */}
              <div className="flex border-b border-border mb-7">
                {(["login", "signup"] as View[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`flex-1 pb-3 font-sans text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-200 relative ${
                      view === v ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {v === "login" ? "Sign In" : "Create Account"}
                    {view === v && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* ===== SIGN IN FORM ===== */}
              {view === "login" && (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label htmlFor="login-email" className={labelClass}>Email Address</label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="login-password" className={labelClass}>Password</label>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showLoginPwd ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowLoginPwd(!showLoginPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showLoginPwd ? "Hide password" : "Show password"}
                      >
                        {showLoginPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember me + Forgot password */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer group select-none">
                      <div
                        role="checkbox"
                        aria-checked={rememberMe}
                        onClick={() => setRememberMe(!rememberMe)}
                        className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors duration-200 ${
                          rememberMe
                            ? "bg-primary border-primary"
                            : "border-border group-hover:border-primary/40"
                        }`}
                      >
                        {rememberMe && <Check size={10} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className="font-sans text-xs font-medium text-muted-foreground">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="font-sans text-xs font-medium text-primary hover:text-primary/70 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button type="submit" disabled={loading} className="btn-gold w-full text-center">
                    {loading ? "Signing in…" : "Sign In"}
                  </button>

                  <p className="font-sans text-xs text-center text-muted-foreground pt-1">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setView("signup")}
                      className="font-medium text-primary hover:text-primary/70 transition-colors"
                    >
                      Create one
                    </button>
                  </p>
                </form>
              )}

              {/* ===== SIGN UP FORM ===== */}
              {view === "signup" && (
                <form onSubmit={handleSignup} className="space-y-5">
                  <div>
                    <label htmlFor="signup-name" className={labelClass}>Full Name</label>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor={isBug("B20") ? "signup-mail" : "signup-email"} className={labelClass}>Email Address</label>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="signup-password" className={labelClass}>Password</label>
                    <div className="relative">
                      <input
                        id="signup-password"
                        type={showSignupPwd ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowSignupPwd(!showSignupPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showSignupPwd ? "Hide password" : "Show password"}
                      >
                        {showSignupPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Strength bar */}
                    {signupPassword.length > 0 && (
                      <div className="mt-2.5">
                        <div className="flex gap-1 mb-1.5">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="flex-1 h-1 rounded-full transition-all duration-300"
                              style={{ background: i <= strengthScore ? strengthColor : "hsl(var(--border))" }}
                            />
                          ))}
                        </div>
                        {strengthLabel && (
                          <p className="font-sans text-xs font-semibold" style={{ color: strengthColor }}>
                            {strengthLabel}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Requirements checklist */}
                    {signupPassword.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {passwordRequirements.map((req) => {
                          const met = req.test(signupPassword);
                          return (
                            <li key={req.label} className="flex items-center gap-2">
                              <Check
                                size={11}
                                strokeWidth={met ? 3 : 2}
                                className={met ? "text-green-500" : "text-muted-foreground/30"}
                              />
                              <span className={`font-sans text-xs transition-colors ${met ? "text-foreground" : "text-muted-foreground"}`}>
                                {req.label}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <div>
                    <label htmlFor="signup-confirm" className={labelClass}>Confirm Password</label>
                    <div className="relative">
                      <input
                        id="signup-confirm"
                        type={showConfirmPwd ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        value={signupConfirm}
                        onChange={(e) => setSignupConfirm(e.target.value)}
                        placeholder="Repeat your password"
                        className={`${inputClass} pr-12 ${
                          confirmMismatch
                            ? "border-red-400 focus:border-red-400"
                            : confirmMatch
                            ? "border-green-400 focus:border-green-400"
                            : ""
                        }`}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showConfirmPwd ? "Hide password" : "Show password"}
                      >
                        {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {confirmMismatch && (
                      <p className="font-sans text-xs text-red-500 mt-1.5">Passwords do not match</p>
                    )}
                    {confirmMatch && (
                      <p className="font-sans text-xs text-green-500 mt-1.5 flex items-center gap-1">
                        <Check size={11} strokeWidth={3} /> Passwords match
                      </p>
                    )}
                  </div>

                  <button type="submit" disabled={loading} className="btn-gold w-full text-center">
                    {loading ? "Creating account…" : "Create Account"}
                  </button>

                  <p className="font-sans text-xs text-center text-muted-foreground leading-relaxed">
                    By creating an account you agree to our{" "}
                    <span className="font-medium text-foreground">Terms of Service</span>{" "}
                    and{" "}
                    <span className="font-medium text-foreground">Privacy Policy</span>.
                  </p>

                  <p className="font-sans text-xs text-center text-muted-foreground pt-1">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setView("login")}
                      className="font-medium text-primary hover:text-primary/70 transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
