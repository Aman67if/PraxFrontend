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
  TrendingUp,
  CheckCircle2,
  Crown,
} from "lucide-react";

export default function Subscription() {
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

  const plans = [
    {
      name: "Monthly",
      price: "₹199",
      period: "/month",
      features: [
        "All subjects access",
        "Unlimited tests",
        "Detailed analytics",
        "Email support",
      ],
    },
    {
      name: "Quarterly",
      price: "₹499",
      period: "/3 months",
      features: [
        "All subjects access",
        "Unlimited tests",
        "Detailed analytics",
        "Priority support",
        "Save 17%",
      ],
      popular: true,
    },
    {
      name: "Yearly",
      price: "₹1599",
      period: "/year",
      features: [
        "All subjects access",
        "Unlimited tests",
        "Detailed analytics",
        "Priority support",
        "Save 33%",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} />

      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-gray-900">Subscription Plans</h1>
          <p className="text-gray-600">
            Choose the plan that works best for you
          </p>
        </div>

        {/* Current Subscription */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Crown size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl mb-2">Current Plan: Quarterly</h2>
              <p className="text-blue-100 mb-4">Active until April 14, 2026</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary">Upgrade Plan</Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Manage Subscription
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`text-center ${plan.popular ? "ring-2 ring-blue-600 shadow-xl" : ""}`}
            >
              {plan.popular && (
                <div className="bg-blue-600 text-white text-sm py-1 px-3 rounded-full inline-block mb-4">
                  Current Plan
                </div>
              )}
              <h3 className="text-2xl mb-2 text-gray-900">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl text-blue-600">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 justify-center text-gray-700"
                  >
                    <CheckCircle2 size={16} className="text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "outline" : "primary"}
                className="w-full"
                disabled={plan.popular}
              >
                {plan.popular ? "Current Plan" : "Choose Plan"}
              </Button>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <Card className="mt-8">
          <h2 className="text-xl mb-6 text-gray-900">Subscription Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Access to all subjects and classes",
              "Unlimited test attempts",
              "Detailed performance analytics",
              "Question-wise explanations",
              "Track your progress over time",
              "Priority customer support",
              "Regular content updates",
              "Mobile-friendly interface",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2
                  size={20}
                  className="text-green-600 flex-shrink-0"
                />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
