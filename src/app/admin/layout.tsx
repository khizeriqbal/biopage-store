import { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
    title: "Admin Panel | bio page.store",
    description: "Manage users, products, orders, and more.",
    robots: "noindex, nofollow",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-dark-bg text-white">
            <AdminSidebar />
            <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-6">{children}</div>
            </main>
        </div>
    );
}
