import Link from "next/link";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import Grainient from "../components/Grainient";
import {
  BookOpen,
  BarChart3,
  Target,
  Zap,
  CheckCircle2,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

export default function Landing() {
  const date = new Date();
  const currentYear = date.getFullYear();
  const features = [
    {
      icon: <BookOpen size={32} className="text-blue-600" />,
      title: "Chapter-wise Tests",
      description:
        "Practice with structured tests covering every chapter and topic",
    },
    {
      icon: <Zap size={32} className="text-blue-600" />,
      title: "Instant Results",
      description:
        "Get immediate feedback with detailed explanations for every question",
    },
    {
      icon: <BarChart3 size={32} className="text-blue-600" />,
      title: "Performance Analytics",
      description:
        "Track your progress with comprehensive analytics and insights",
    },
    {
      icon: <Target size={32} className="text-blue-600" />,
      title: "Difficulty-based Practice",
      description: "Adaptive difficulty levels to match your learning pace",
    },
  ];

  const classes = [
    { range: "Classes 1-5", subjects: ["Math", "English", "EVS"] },
    {
      range: "Classes 6-8",
      subjects: ["Math", "English", "Science", "Social Studies"],
    },
    { range: "Classes 9-10", subjects: ["Math", "English", "Science"] },
    {
      range: "Classes 11-12",
      subjects: ["Math", "Physics", "Chemistry", "Biology", "English"],
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Select Class & Subject",
      description: "Choose your class and subject area",
    },
    {
      number: "2",
      title: "Attempt Test",
      description: "Take chapter-wise or topic-wise tests",
    },
    {
      number: "3",
      title: "Get Detailed Results",
      description: "Review answers with detailed explanations",
    },
  ];

  const pricingPlans = [
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
    <div className="min-h-screen bg-white">
      <section
        className="relative [mask-image:linear-gradient(to_bottom,black_65%,black_70%,transparent_100%)]
            [-webkit-mask-image:linear-gradient(to_bottom,black_65%,black_70%,transparent_100%)]"
      >
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <Grainient
            color1="#399376"
            color2="#7aaa99"
            color3="#a1bfb5"
            timeSpeed={1}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={0.5}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.3}
          />
        </div>
        {/* Header */}
        <header className="absolute top-5 z-30 w-full">
          <div
            className="relative max-w-[50%] mx-auto px-4 py-4 flex items-center justify-between
                  rounded-4xl overflow-hidden backdrop-blur-[10px]
                  border border-white/30"
          >
            {/* 🌫️ Inner Glow */}
            <div
              className="pointer-events-none absolute inset-0 
      shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),
              inset_0_-1px_2px_rgba(255,255,255,0.1)]"
            ></div>

            {/* 🌾 Grain Texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-25 
      bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%271.1%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27 opacity=%270.12%27/%3E%3C/svg%3E')]"
            ></div>

            {/* Content */}
            <h1 className="text-2xl font-semibold text-white relative z-10">
              Praxes
            </h1>

            <nav className="hidden md:flex items-center gap-6 relative z-10">
              <a
                href="#classes"
                className="text-white/80 hover:text-white transition"
              >
                Classes
              </a>
              <a
                href="#pricing"
                className="text-white/80 hover:text-white transition"
              >
                Pricing
              </a>

              <Link href={"/auth/login"}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white 
                     bg-white/10 backdrop-blur-md
                     hover:bg-white/20 hover:border-white/40
                     transition"
                >
                  Login
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <div className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] w-[80%]">
          <div>
            <h1 className="flex justify-center text-center text-6xl lg:text-8xl mb-6 text-white text-shadow:0_2px_6px_rgba(0,0,0,0.95)">
              Consistency, Discipline, Excellence
            </h1>
            <p className="flex justify-center text-center text-xl text-white mb-8 text-shadow:0_2px_6px_rgba(0,0,0,0.25) w-[60%] mx-auto">
              AI-powered structured test preparation platform for Classes 1–12.
              Master every subject with personalized practice, instant feedback,
              and detailed analytics.
            </p>
            <div className="flex justify-center flex-wrap gap-4">
              <Link href={"/auth/signup"}>
                <Button
                  className="border-white border-2 text-white 
                     bg-white/10 backdrop-blur-md
                     hover:bg-white/20 hover:border-white
                     transition text-shadow:0_2px_6px_rgba(0,0,0,0.95)"
                  size="lg"
                >
                  Start Practicing
                </Button>
              </Link>
              {/* <Link href="/auth/login">
                  <Button variant="outline" size="lg">
                    Login
                  </Button>
                </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">Powerful Features</h2>
            <p className="text-xl text-gray-600">
              Everything you need to excel in your exams
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Covered Section */}
      <section id="classes" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">Classes Covered</h2>
            <p className="text-xl text-gray-600">
              Comprehensive test series for every grade
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {classes.map((classInfo, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <h3 className="text-xl mb-3 text-blue-600">
                  {classInfo.range}
                </h3>
                <ul className="space-y-2">
                  {classInfo.subjects.map((subject, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <CheckCircle2 size={16} className="text-green-600" />
                      {subject}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-gray-900">Simple Pricing</h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works for you
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`text-center ${
                  plan.popular ? "ring-2 ring-blue-600 shadow-xl" : ""
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-sm py-1 px-3 rounded-full inline-block mb-4">
                    Most Popular
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
                <Link href={""}>
                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl text-blue-400 mb-4">Praxes</h3>
              <p className="text-gray-400">Practice. Analyze. Excel.</p>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {currentYear} Praxes.in - All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
