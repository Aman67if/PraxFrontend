import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  CreditCard,
  User,
  LogOut,
  TrendingUp,
} from "lucide-react";
// import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const sidebarItems = [
    {
      label: "Dashboard",
      path: "/student",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Attempt Test",
      path: "/student/enrolled-tests",
      icon: <FileText size={20} />,
    },
    {
      label: "My Results",
      path: "/student/result",
      icon: <BarChart3 size={20} />,
    },
    {
      label: "Performance Analytics",
      path: "/student/analytics",
      icon: <TrendingUp size={20} />,
    },
    {
      label: "Subscription",
      path: "/student/subscription",
      icon: <CreditCard size={20} />,
    },
    { label: "Profile", path: "/profile", icon: <User size={20} /> },
    { label: "Logout", path: "/", icon: <LogOut size={20} /> },
  ];

  const performanceData = [
    { date: "Feb 8", accuracy: 75 },
    { date: "Feb 9", accuracy: 78 },
    { date: "Feb 10", accuracy: 72 },
    { date: "Feb 11", accuracy: 82 },
    { date: "Feb 12", accuracy: 85 },
    { date: "Feb 13", accuracy: 80 },
    { date: "Feb 14", accuracy: 88 },
  ];

  const subjectData = [
    { subject: "Math", tests: 12 },
    { subject: "English", tests: 8 },
    { subject: "Science", tests: 10 },
    { subject: "Physics", tests: 6 },
  ];

  const accuracyData = [
    { name: "Correct", value: 78, color: "#22c55e" },
    { name: "Incorrect", value: 22, color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} />

      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600">
            Track your progress and identify areas for improvement
          </p>
        </div>

        {/* Performance Trend */}
        {/* <Card className="mb-8">
          <h2 className="text-xl mb-6 text-gray-900">Accuracy Trend (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
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
                dataKey="accuracy"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: '#2563eb', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card> */}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Subject-wise Tests */}
          {/* <Card>
            <h2 className="text-xl mb-6 text-gray-900">Tests by Subject</h2>
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
                <Bar dataKey="tests" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card> */}

          {/* Overall Accuracy */}
          {/* <Card>
            <h2 className="text-xl mb-6 text-gray-900">Overall Accuracy</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accuracyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {accuracyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card> */}
        </div>

        {/* Topic-wise Performance */}
        <Card>
          <h2 className="text-xl mb-6 text-gray-900">Topic-wise Performance</h2>
          <div className="space-y-4">
            {[
              {
                topic: "Linear Equations",
                accuracy: 92,
                color: "bg-green-500",
              },
              {
                topic: "Quadratic Equations",
                accuracy: 85,
                color: "bg-green-500",
              },
              { topic: "Trigonometry", accuracy: 78, color: "bg-yellow-500" },
              {
                topic: "Coordinate Geometry",
                accuracy: 72,
                color: "bg-yellow-500",
              },
              { topic: "Statistics", accuracy: 65, color: "bg-orange-500" },
              { topic: "Probability", accuracy: 58, color: "bg-red-500" },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">{item.topic}</span>
                  <span className="text-gray-900">{item.accuracy}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
