import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Redirect new users to onboarding if not completed
    // (only redirect from /dashboard, not from /onboarding itself)
    const onboardingDone = (session.user as any).onboardingDone;
    // We allow /onboarding to be accessed freely within the layout
    // But guard is handled per-page; we don't redirect here to avoid loop

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-dark-bg">
            <div className="hidden md:block w-60 min-h-screen">
                <Sidebar />
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden relative">
                <MobileNav />
                <main className="p-4 md:p-8 pt-6 pb-12 w-full max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
