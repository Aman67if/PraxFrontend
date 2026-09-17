"use client";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, List, Search,
  AlertTriangle, XCircle,
} from "lucide-react";

const sidebarItems = [
  { label: "Add Question", path: "/employee/question-entry", icon: <LayoutDashboard size={18} /> },
  { label: "View Questions", path: "/employee/view-questions", icon: <List size={18} /> },
  { label: "Search", path: "/employee/search", icon: <Search size={18} /> },
  { label: "Corrections", path: "/employee/corrections", icon: <AlertTriangle size={18} /> },
  { label: "Rejections", path: "/employee/rejections", icon: <XCircle size={18} /> },
];

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth({ allowedRoles: ["EMPLOYEE"] });

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
