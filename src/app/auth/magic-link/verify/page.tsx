import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

interface Props {
    searchParams: { token?: string };
}

export default async function VerifyMagicLinkPage({ searchParams }: Props) {
    const token = searchParams.token;

    if (!token) {
        redirect("/login?error=invalid_token");
    }

    try {
        // Find user with valid token
        const user = await prisma.user.findFirst({
            where: {
                magicLinkToken: token,
                magicLinkExpires: {
                    gt: new Date() // Token not expired
                }
            }
        });

        if (!user) {
            redirect("/login?error=invalid_or_expired_token");
        }

        // Clear the magic link token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                magicLinkToken: null,
                magicLinkExpires: null,
                emailVerified: new Date() // Mark email as verified
            }
        });

        // Create session via signIn
        await signIn("credentials", {
            email: user.email,
            password: user.email, // Use email as password for magic link users
            redirect: false
        });

        // Redirect to dashboard
        redirect("/dashboard");
    } catch (error) {
        console.error("Magic link verification error:", error);
        redirect("/login?error=verification_failed");
    }
}
