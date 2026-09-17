"use client";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Users, BarChart3,
  Layers, CreditCard, ImageIcon,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
  { label: "Employees", path: "/admin/employees", icon: <Users size={18} /> },
  { label: "Questions", path: "/admin/questions", icon: <BarChart3 size={18} /> },
  { label: "Images", path: "/admin/uploaded-images", icon: <ImageIcon size={18} /> },
  { label: "Test Groups", path: "/admin/test-groups", icon: <Layers size={18} /> },
  { label: "Subscriptions", path: "/admin/subscription-plans", icon: <CreditCard size={18} /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth({ allowedRoles: ["ADMIN"] });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
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
