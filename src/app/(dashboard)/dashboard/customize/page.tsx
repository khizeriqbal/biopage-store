import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageBuilder from "@/components/builder/PageBuilder";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';


export default async function CustomizePage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const settings = await prisma.pageSettings.findUnique({
        where: { userId },
    });

    return (
        <div className="absolute inset-0 z-50 bg-dark-bg p-0 m-0">
            <div className="h-full flex flex-col">
                {/* Top Bar for Mobile */}
                <div className="h-16 border-b border-border bg-dark-bg flex items-center justify-between px-6 md:hidden">
                    <h1 className="text-xl font-bold text-white tracking-tight">Editor</h1>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1 min-h-0">
                    <PageBuilder initialData={settings as any} />
                </div>
            </div>
        </div>
    );
}

const X = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);

const Button = ({ children, variant, size, className, onClick }: any) => (
    <button onClick={onClick} className={className}>{children}</button>
);
