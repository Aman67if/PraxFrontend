import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  CreditCard,
  User,
  LogOut,
  Award,
  TrendingUp,
  Target,
} from "lucide-react";

export default function StudentDashboard() {
  // const navigate = useNavigate();

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

  const stats = [
    {
      label: "Tests Attempted",
      value: "24",
      icon: <FileText size={24} className="text-blue-600" />,
    },
    {
      label: "Overall Accuracy",
      value: "78%",
      icon: <Target size={24} className="text-green-600" />,
    },
    {
      label: "Current Streak",
      value: "7 days",
      icon: <Award size={24} className="text-orange-600" />,
    },
  ];

  const strengths = ["Algebra", "Grammar", "Physics"];
  const weaknesses = ["Geometry", "Vocabulary", "Chemistry"];

  const recentTests = [
    {
      subject: "Mathematics",
      chapter: "Linear Equations",
      score: "85%",
      date: "Feb 12, 2026",
    },
    {
      subject: "English",
      chapter: "Comprehension",
      score: "72%",
      date: "Feb 10, 2026",
    },
    {
      subject: "Physics",
      chapter: "Motion",
      score: "90%",
      date: "Feb 8, 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} />

      <main className="lg:ml-64 p-4 lg:p-8">
        {/* Welcome Card */}
        {/* <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">Welcome back, Rahul! 👋</h1>
              <p className="text-blue-100">Ready to continue your learning journey?</p>
            </div>
            <Link href="/student/test-selection">
              <Button variant="secondary" size="lg" className="mt-4 md:mt-0">
                Start Test
              </Button>
            </Link>
          </div>
        </Card> */}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">{stat.icon}</div>
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h2 className="text-xl mb-4 text-gray-900">Your Strengths 💪</h2>
            <div className="space-y-2">
              {strengths.map((topic, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-700">{topic}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl mb-4 text-gray-900">Areas to Improve 📚</h2>
            <div className="space-y-2">
              {weaknesses.map((topic, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-gray-700">{topic}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Tests */}
        <Card>
          <h2 className="text-xl mb-4 text-gray-900">Recent Tests</h2>
          <div className="space-y-4">
            {recentTests.map((test, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="text-gray-900 mb-1">{test.subject}</h3>
                  <p className="text-sm text-gray-600">{test.chapter}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <span className="text-sm text-gray-600">{test.date}</span>
                  <span className="text-lg text-blue-600">{test.score}</span>
                  <Link href="/student/results">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
