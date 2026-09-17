"use client";
import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Table } from "@/components/Table";
import { API_URL, apiFetch } from "@/lib/api";

import {
  TrendingUp,
  RefreshCw,
} from "lucide-react";

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

function StatCard({
  label,
  value,
  loading,
  color,
}: {
  label: string;
  value: string | number;
  loading: boolean;
  color: string;
}) {
  return (
    <Card className={color}>
      {/* <div className="flex items-center gap-4">
        <div>
          <p className="text-xs mb-0.5">{label}</p>
          {loading ? (
            <div className="h-7 w-16 bg-gray-200 rounded animate-pulse mt-1" />
          ) : (
            <p className="text-2xl font-semibold">{value}</p>
          )}
        </div>
      </div> */}
        <div className="text-2xl font-bold mb-0.5">
          {loading ? (
            <div className="h-8 w-16 bg-current opacity-20 rounded animate-pulse" />
          ) : (
            value
          )}
        </div>
        <div className="text-sm opacity-70">{label}</div>
    </Card>
  );
}

export default function AdminPanel() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState("");
  const [employeeMetrics, setEmployeeMetrics] = useState<EmployeeMetric[]>([]);
  const [empLoading, setEmpLoading] = useState(true);
  const [empError, setEmpError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);



  const fetchMetrics = useCallback(async () => {
    setMetricsLoading(true);
    setMetricsError("");
    try {
      const res = await apiFetch(`${API_URL}/admin/metrics`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMetrics(data.data);
    } catch {
      setMetricsError("Failed to load metrics.");
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  const fetchEmployeeMetrics = useCallback(async () => {
    setEmpLoading(true);
    setEmpError("");
    try {
      const res = await apiFetch(`${API_URL}/admin/employee-metrics`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmployeeMetrics(data.data ?? []);
    } catch {
      setEmpError("Failed to load employee performance data.");
    } finally {
      setEmpLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchMetrics(), fetchEmployeeMetrics()]);
    setLastUpdated(new Date());
  }, [fetchMetrics, fetchEmployeeMetrics]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const stats = [
    {
      label: "Total Questions",
      value: metrics?.total_questions.toLocaleString() ?? "—",
      color: "bg-brand-50 border-brand-100 text-brand-700",
    },
    {
      label: "Total Employees",
      value: metrics?.total_employees ?? "—",
      color: "bg-green-50 border-green-100 text-green-700",
    },
    {
      label: "Total Students",
      value: metrics?.total_students ?? "—",
      color: "bg-orange-50 border-orange-100 text-orange-700",
    },
  ];

  const columns = [
    { key: "name", header: "Employee Name" },
    { key: "email", header: "Email", render: (v: string | null) => v ?? "—" },
    {
      key: "today",
      header: "Today",
      render: (v: number) => (
        <span
          className={`font-semibold ${v > 0 ? "text-brand-600" : "text-gray-400"}`}
        >
          {v}
        </span>
      ),
    },
    {
      key: "month",
      header: "This Month",
      render: (v: number) => (
        <span
          className={`font-semibold ${v > 0 ? "text-green-600" : "text-gray-400"}`}
        >
          {v}
        </span>
      ),
    },
    {
      key: "total",
      header: "All Time",
      render: (v: number) => (
        <span className="font-semibold text-gray-700">{v}</span>
      ),
    },
  ];

  return (
    <>
      <Navbar title="Admin Dashboard" subtitle="Manage employees and monitor metrics" />

      <div className="p-5 lg:p-8">
        <div className="flex justify-end mb-5">
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={fetchAll}
              disabled={metricsLoading || empLoading}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                size={13}
                className={metricsLoading || empLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
            {lastUpdated && (
              <span className="text-xs text-gray-400">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-7">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} loading={metricsLoading} />
          ))}
        </div>

        {metricsError && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
            {metricsError}
            <button
              onClick={fetchMetrics}
              className="text-brand-600 underline ml-2 text-xs"
            >
              Retry
            </button>
          </div>
        )}

        <Card>
          <h2 className="font-semibold text-gray-900 mb-5">
            Employee Performance
          </h2>

          {empLoading && (
            <div className="py-12 text-center text-gray-400">
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading employee data…</p>
            </div>
          )}

          {empError && !empLoading && (
            <div className="py-6 text-center text-red-500 text-sm">
              {empError}
              <button
                onClick={fetchEmployeeMetrics}
                className="ml-2 text-brand-600 underline"
              >
                Retry
              </button>
            </div>
          )}

          {!empLoading && !empError && employeeMetrics.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">
              No employee data found.
            </div>
          )}

          {!empLoading && !empError && employeeMetrics.length > 0 && (
            <Table columns={columns} data={employeeMetrics} />
          )}
        </Card>
      </div>
    </>
  );
}
