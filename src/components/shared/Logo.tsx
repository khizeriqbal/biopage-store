import Link from "next/link";

export function Logo({ className }: { className?: string }) {
    return (
        <Link href="/" className={`${className} flex items-center gap-1 font-heading text-xl font-bold tracking-tight`}>
            <span>bio page.store</span>
            <span className="h-2 w-2 rounded-full bg-accent" />
        </Link>
    );
}
