"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";

const STEPS = [
  { id: 1, title: "Bio & Avatar", description: "Set up your profile" },
  { id: 2, title: "Niche", description: "Choose your focus area" },
  { id: 3, title: "Store Design", description: "Customize your store" },
  { id: 4, title: "Payment Setup", description: "Connect payment processor" },
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar: "",
    niche: "",
    accentColor: "#6366f1",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleNext = async () => {
    if (currentStep === 4) {
      // Complete onboarding
      setLoading(true);
      try {
        await fetch("/api/user/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        router.push("/dashboard");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Background elements */}
      <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-brand/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-muted-foreground hover:text-white"
          >
            Skip for now
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between mb-8">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                  step.id < currentStep
                    ? "bg-green-500 text-white"
                    : step.id === currentStep
                    ? "bg-brand text-white"
                    : "bg-white/10 text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="text-center text-xs hidden sm:block">
                <p className="font-medium text-white">{step.title}</p>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 pb-12">
        <div className="p-8 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          {/* Step 1: Bio & Avatar */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">
                Tell us about yourself
              </h2>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <Input
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Bio
                </label>
                <textarea
                  placeholder="Tell your audience about yourself..."
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Avatar URL (optional)
                </label>
                <Input
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
          )}

          {/* Step 2: Niche */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">
                What's your niche?
              </h2>

              <div>
                <label className="block text-sm font-medium text-white mb-4">
                  Select your primary niche
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Coaching",
                    "Education",
                    "Digital Products",
                    "Software",
                    "Content Creation",
                    "E-commerce",
                    "Services",
                    "Other",
                  ].map((niche) => (
                    <button
                      key={niche}
                      onClick={() => setFormData({ ...formData, niche })}
                      className={`p-3 rounded-lg font-medium transition ${
                        formData.niche === niche
                          ? "bg-brand text-white"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10"
                      }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Store Design */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">
                Customize your store
              </h2>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accentColor: e.target.value,
                      })
                    }
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <span className="text-white font-mono text-sm">
                    {formData.accentColor}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-muted-foreground mb-3">Preview:</p>
                <div
                  style={{ backgroundColor: formData.accentColor }}
                  className="w-full h-20 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Step 4: Payment Setup */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">
                Connect payment processor
              </h2>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm text-blue-300 mb-2">
                  We support Whop for payments
                </p>
                <p className="text-xs text-blue-300/70">
                  You can connect your payment processor after setup. Click
                  "Continue" to finish onboarding.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="font-semibold text-white mb-2">Next steps:</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>✓ Visit your dashboard</li>
                  <li>✓ Create your first product</li>
                  <li>✓ Connect your payment processor</li>
                  <li>✓ Share your store link</li>
                </ul>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
                className="border-white/10 hover:bg-white/5"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 bg-brand hover:bg-brand/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : currentStep === 4 ? (
                "Complete Onboarding"
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
