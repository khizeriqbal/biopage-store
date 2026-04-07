import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/dashboard/OnboardingFlow";

export default async function OnboardingPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { pageSettings: true }
    });

    if (!user) {
        redirect("/login");
    }

    // Redirect if already onboarded
    if (user.username && user.whopCompanyId) {
        // redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-dark-bg p-8 flex flex-col items-center py-20 animate-in fade-in duration-700">
            <div className="w-full max-w-5xl flex flex-col items-center gap-16 relative">
                <div className="flex flex-col items-center gap-3">
                    <h1 className="text-xl font-black text-white uppercase tracking-[0.3em] leading-none opacity-50 group hover:opacity-100 transition-opacity">
                        Welcome to bio page.store
                    </h1>
                    <div className="h-1 w-12 rounded-full bg-brand/50 group-hover:w-24 transition-all" />
                </div>

                <div className="w-full">
                    <OnboardingFlow user={user as any} />
                </div>
            </div>
        </div>
    );
}
