"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, FileText, BarChart3,
  TrendingUp, CreditCard,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", path: "/student", icon: <LayoutDashboard size={18} /> },
  { label: "Attempt Test", path: "/student/enrolled-tests", icon: <FileText size={18} /> },
  { label: "My Results", path: "/student/result", icon: <BarChart3 size={18} /> },
  { label: "Analytics", path: "/student/analytics", icon: <TrendingUp size={18} /> },
  { label: "Subscription", path: "/student/subscription", icon: <CreditCard size={18} /> },
];

// Test pages have their own full-screen layout (no sidebar)
const NO_SIDEBAR_PREFIXES = ["/student/test"];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSidebar = NO_SIDEBAR_PREFIXES.some((p) => pathname.startsWith(p));
  const { loading } = useAuth({ allowedRoles: ["STUDENT"] });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} logo="Praxes" />
      <main className="lg:ml-64">
        {children}
      </main>
    </div>
  );
}
