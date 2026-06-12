"use client";
import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { Table } from "@/components/Table";
import {
  LayoutDashboard, Users, BarChart3, LogOut, TrendingUp, RefreshCw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlatformMetrics {
  total_students: number;
  total_employees: number;
  total_questions: number;
}

interface EmployeeMetric {
  id: number;
  name: string;
  email: string | null;
  today: number;
  month: number;
  total: number;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, icon, loading,
}: {
  label: string; value: string | number; icon: React.ReactNode; loading: boolean;
}) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          {loading
            ? <div className="h-7 w-16 bg-gray-200 rounded animate-pulse mt-1" />
            : <p className="text-2xl text-gray-900">{value}</p>
          }
        </div>
      </div>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState('');

  const [employeeMetrics, setEmployeeMetrics] = useState<EmployeeMetric[]>([]);
  const [empLoading, setEmpLoading] = useState(true);
  const [empError, setEmpError] = useState('');

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const sidebarItems = [
    { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { label: "Employees", path: "/admin/employees", icon: <Users size={20} /> },
    { label: "Question Metrics", path: "/admin/metrics", icon: <BarChart3 size={20} /> },
    { label: "Logout", path: "/", icon: <LogOut size={20} /> },
  ];

  // ── Fetch platform-wide metrics ──
  const fetchMetrics = useCallback(async () => {
    setMetricsLoading(true);
    setMetricsError('');
    try {
      const res = await fetch("http://localhost:5000/api/admin/metrics", {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMetrics(data.data);
    } catch {
      setMetricsError('Failed to load metrics.');
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  // ── Fetch per-employee question metrics ──
  const fetchEmployeeMetrics = useCallback(async () => {
    setEmpLoading(true);
    setEmpError('');
    try {
      const res = await fetch("http://localhost:5000/api/admin/employee-metrics", {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmployeeMetrics(data.data ?? []);
    } catch {
      setEmpError('Failed to load employee performance data.');
    } finally {
      setEmpLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchMetrics(), fetchEmployeeMetrics()]);
    setLastUpdated(new Date());
  }, [fetchMetrics, fetchEmployeeMetrics]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Stats config ──
  const stats = [
    {
      label: "Total Questions",
      value: metrics?.total_questions.toLocaleString() ?? '—',
      icon: <BarChart3 size={24} className="text-blue-600" />,
    },
    {
      label: "Total Employees",
      value: metrics?.total_employees ?? '—',
      icon: <Users size={24} className="text-green-600" />,
    },
    {
      label: "Total Students",
      value: metrics?.total_students ?? '—',
      icon: <TrendingUp size={24} className="text-orange-600" />,
    },
  ];

  const columns = [
    { key: "name", header: "Employee Name" },
    { key: "email", header: "Email", render: (value: string | null) => value ?? "—" },
    {
      key: "today",
      header: "Questions Today",
      render: (value: number) => (
        <span className={`font-medium ${value > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
          {value}
        </span>
      ),
    },
    {
      key: "month",
      header: "This Month",
      render: (value: number) => (
        <span className={`font-medium ${value > 0 ? 'text-green-600' : 'text-gray-400'}`}>
          {value}
        </span>
      ),
    },
    {
      key: "total",
      header: "All Time",
      render: (value: number) => (
        <span className="font-medium text-gray-700">{value}</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} logo="Praxes" />

      <main className="lg:ml-64 p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl mb-2 text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage employees and monitor question metrics</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={fetchAll}
              disabled={metricsLoading || empLoading}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                border border-gray-200 bg-white text-gray-600 hover:bg-gray-50
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw size={14} className={(metricsLoading || empLoading) ? 'animate-spin' : ''} />
              Refresh
            </button>
            {lastUpdated && (
              <span className="text-xs text-gray-400">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} loading={metricsLoading} />
          ))}
        </div>

        {metricsError && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
            {metricsError}
            <button onClick={fetchMetrics} className="text-blue-600 underline ml-2">Retry</button>
          </div>
        )}

        {/* Employee Performance Table */}
        <Card>
          <h2 className="text-xl mb-6 text-gray-900">Employee Performance</h2>

          {empLoading && (
            <div className="py-12 text-center text-gray-400">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading employee data...
            </div>
          )}

          {empError && !empLoading && (
            <div className="py-6 text-center text-red-500">
              {empError}
              <button onClick={fetchEmployeeMetrics} className="ml-2 text-blue-600 underline text-sm">Retry</button>
            </div>
          )}

          {!empLoading && !empError && employeeMetrics.length === 0 && (
            <div className="py-12 text-center text-gray-400">No employee data found.</div>
          )}

          {!empLoading && !empError && employeeMetrics.length > 0 && (
            <Table columns={columns} data={employeeMetrics} />
          )}
        </Card>
      </main>
    </div>
  );
}