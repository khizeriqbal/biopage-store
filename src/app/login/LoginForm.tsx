"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginForm() {
  const router = useRouter();
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError("");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
      router.push("/dashboard");
    } catch (error: any) {
      setFormError(error.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.name,
      });
      setSuccess(
        "Sign up successful! Please check your email to confirm your account."
      );
      setTimeout(() => {
        setFormData({ email: "", password: "", confirmPassword: "", name: "" });
        setMode("signin");
      }, 2000);
    } catch (error: any) {
      setFormError(error.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = mode === "signin" ? handleSignIn : handleSignUp;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-8 bg-dark-surface/30 p-1 rounded-lg">
        <button
          onClick={() => setMode("signin")}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
            mode === "signin"
              ? "bg-brand text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
            mode === "signup"
              ? "bg-brand text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Error Message */}
      {formError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
          {formError}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 text-sm">
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field (Sign Up Only) */}
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <Input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="bg-dark-surface border-dark-border text-white placeholder-gray-500"
            />
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
            className="bg-dark-surface border-dark-border text-white placeholder-gray-500"
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              className="bg-dark-surface border-dark-border text-white placeholder-gray-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field (Sign Up Only) */}
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
              className="bg-dark-surface border-dark-border text-white placeholder-gray-500"
            />
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-brand hover:bg-brand/90 text-white font-medium py-3"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              {mode === "signin" ? "Signing in..." : "Creating account..."}
            </>
          ) : mode === "signin" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </div>
  );
}
