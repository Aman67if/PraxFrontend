import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { Table } from "@/components/Table";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
  TrendingUp,
  Award,
} from "lucide-react";
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminMetrics() {
  const sidebarItems = [
    { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { label: "Employees", path: "/admin/employees", icon: <Users size={20} /> },
    {
      label: "Question Metrics",
      path: "/admin/metrics",
      icon: <BarChart3 size={20} />,
    },
    { label: "Logout", path: "/", icon: <LogOut size={20} /> },
  ];

  const stats = [
    {
      label: "Total Questions",
      value: "1,245",
      icon: <BarChart3 size={24} className="text-blue-600" />,
      change: "+12%",
    },
    {
      label: "Today's Entries",
      value: "47",
      icon: <TrendingUp size={24} className="text-green-600" />,
      change: "+8%",
    },
    {
      label: "This Week",
      value: "342",
      icon: <TrendingUp size={24} className="text-orange-600" />,
      change: "+15%",
    },
    {
      label: "This Month",
      value: "892",
      icon: <Award size={24} className="text-purple-600" />,
      change: "+20%",
    },
  ];

  const employeeMetrics = [
    { name: "Priya Sharma", today: 8, week: 52, month: 156, total: 1250 },
    { name: "Rahul Verma", today: 6, week: 48, month: 142, total: 1180 },
    { name: "Anjali Gupta", today: 7, week: 45, month: 138, total: 1120 },
    { name: "Vikram Singh", today: 5, week: 42, month: 125, total: 980 },
    { name: "Sneha Patel", today: 9, week: 58, month: 118, total: 890 },
  ];

  const weeklyData = [
    { day: "Mon", questions: 65 },
    { day: "Tue", questions: 72 },
    { day: "Wed", questions: 58 },
    { day: "Thu", questions: 68 },
    { day: "Fri", questions: 75 },
    { day: "Sat", questions: 42 },
    { day: "Sun", questions: 32 },
  ];

  const subjectData = [
    { subject: "Math", count: 425 },
    { subject: "Science", count: 320 },
    { subject: "English", count: 280 },
    { subject: "Physics", count: 155 },
    { subject: "Chemistry", count: 132 },
    { subject: "Biology", count: 128 },
  ];

  const columns = [
    { key: "name", header: "Employee Name" },
    {
      key: "today",
      header: "Today",
      render: (value: number) => <span className="text-blue-600">{value}</span>,
    },
    {
      key: "week",
      header: "This Week",
      render: (value: number) => (
        <span className="text-green-600">{value}</span>
      ),
    },
    {
      key: "month",
      header: "This Month",
      render: (value: number) => (
        <span className="text-orange-600">{value}</span>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (value: number) => (
        <span className="text-purple-600">{value}</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} logo="Praxes Admin" />

      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-gray-900">Question Metrics</h1>
          <p className="text-gray-600">
            Track question entry performance and statistics
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-gray-50 rounded-lg">{stat.icon}</div>
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="text-sm text-green-600">
                {stat.change} from last period
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        {/* <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <h2 className="text-xl mb-6 text-gray-900">Weekly Question Entry Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="questions"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h2 className="text-xl mb-6 text-gray-900">Questions by Subject</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="subject" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div> */}

        {/* Employee Performance Table */}
        <Card>
          <h2 className="text-xl mb-6 text-gray-900">
            Employee Performance Breakdown
          </h2>
          <Table columns={columns} data={employeeMetrics} />
        </Card>
      </main>
    </div>
  );
}
