import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// Admin user IDs (you'll set these in your database)
const ADMIN_IDS = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || [];

export async function requireAdmin() {
    const session = await auth();

    if (!session?.user?.id || !ADMIN_IDS.includes(session.user.id)) {
        redirect("/");
    }

    return session;
}

export async function checkIsAdmin(): Promise<boolean> {
    const session = await auth();
    return session?.user?.id ? ADMIN_IDS.includes(session.user.id) : false;
}
