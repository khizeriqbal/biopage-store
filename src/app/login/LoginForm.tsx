"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    name: "",
  });
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const checkUsername = async (username) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    try {
      const res = await fetch(`/api/user/check-username?username=${username}`);
      const data = await res.json();
      setUsernameAvailable(data.available);
    } catch {
      setUsernameAvailable(true);
    }
    setCheckingUsername(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (result?.error) {
        setFormError(result.error);
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch {
      setFormError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setFormError("");
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed");
        return;
      }
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (result?.ok) {
        router.push("/onboarding");
      }
    } catch {
      setFormError("Error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <>
      <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-lg">
        <button onClick={() => setMode("signin")} className={`flex-1 py-2 px-4 rounded-md font-medium ${mode === "signin" ? "bg-brand text-white" : "text-muted-foreground"}`}>Sign In</button>
        <button onClick={() => setMode("signup")} className={`flex-1 py-2 px-4 rounded-md font-medium ${mode === "signup" ? "bg-brand text-white" : "text-muted-foreground"}`}>Sign Up</button>
      </div>
      {(formError || error) && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"><p className="text-sm text-red-400">{formError || error}</p></div>}
      {mode === "signin" && (
        <form onSubmit={handleSignIn} className="space-y-4">
          <div><label className="block text-sm font-medium text-white mb-2">Email</label><Input type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-white/5 border-white/10" /></div>
          <div><label className="block text-sm font-medium text-white mb-2">Password</label><Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="bg-white/5 border-white/10" /></div>
          <Button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand/90">{loading ? "Signing in..." : "Sign In"}</Button>
        </form>
      )}
      {mode === "signup" && (
        <form onSubmit={handleSignUp} className="space-y-4">
          <Input placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-white/5 border-white/10" />
          <Input type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-white/5 border-white/10" />
          <Input type="text" placeholder="username" value={formData.username} onChange={(e) => {setFormData({...formData, username: e.target.value}); checkUsername(e.target.value);}} className="bg-white/5 border-white/10" />
          <Input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="bg-white/5 border-white/10" />
          <Input type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="bg-white/5 border-white/10" />
          <Button type="submit" disabled={loading || usernameAvailable !== true} className="w-full bg-brand hover:bg-brand/90">{loading ? "Creating..." : "Create Account"}</Button>
        </form>
      )}
      <div className="my-6 flex items-center gap-3"><div className="flex-1 h-px bg-white/10" /><span className="text-sm text-muted-foreground">Or</span><div className="flex-1 h-px bg-white/10" /></div>
      <Button onClick={handleGoogleSignIn} disabled={loading} variant="outline" className="w-full border-white/10 hover:bg-white/5">Sign in with Google</Button>
    </>
  );
}
