"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "../components/Button";
import Grainient from "../components/Grainient";
import {
  tickerItems,
  features,
  stats,
  testimonials,
  classes,
} from "../components/HeroData";

import {
  BookOpen,
  BarChart3,
  Target,
  Zap,
  CheckCircle2,
  Twitter,
  Linkedin,
  Instagram,
  Star,
  ArrowRight,
} from "lucide-react";

/* ─── Scroll-reveal hook ──────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Animated counter ────────────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else setCount(Math.floor(current));
          }, duration / steps);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Main page ───────────────────────────────────────────────────── */
export default function Landing() {
  useScrollReveal();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="min-h-screen bg-white overflow-x-hidden">
        {/* ─── HERO — DO NOT MODIFY ─────────────────────────────────────── */}
        <section
          className="relative h-[100dvh] min-h-[600px] w-full"
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
          <header className="absolute top-5 z-30 w-full">
            <div className="relative w-[90%] md:w-[70%] lg:max-w-[50%] mx-auto px-4 py-4 flex items-center justify-between rounded-4xl overflow-hidden backdrop-blur-[10px] border border-white/30">
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1)]" />
              <div className="pointer-events-none absolute inset-0 opacity-25 bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%271.1%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27 opacity=%270.12%27/%3E%3C/svg%3E')]" />
              <h1 className="text-2xl font-semibold text-white relative z-10">
                Praxes
              </h1>
              <nav className="flex items-center gap-4 sm:gap-6 relative z-10">
                <div className="hidden md:flex items-center gap-6">
                  <a
                    href="#features"
                    className="text-white/80 hover:text-white transition"
                  >
                    Features
                  </a>
                  <a
                    href="#classes"
                    className="text-white/80 hover:text-white transition"
                  >
                    Classes
                  </a>
                </div>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/40 transition text-xs sm:text-sm px-3 py-1.5"
                  >
                    Login
                  </Button>
                </Link>
              </nav>
            </div>
          </header>
          <div className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] w-[90%] md:w-[80%]">
            <div>
              <h1 className="flex justify-center text-center text-4xl sm:text-6xl lg:text-8xl mb-6 text-white text-shadow:0_2px_6px_rgba(0,0,0,0.95) leading-tight">
                Consistency, Discipline, Excellence
              </h1>
              <p className="flex justify-center text-center text-base sm:text-lg lg:text-xl text-white mb-8 text-shadow:0_2px_6px_rgba(0,0,0,0.25) w-full md:w-[80%] lg:w-[60%] mx-auto">
                AI-powered structured test preparation platform for Classes
                1–12. Master every subject with personalized practice, instant
                feedback, and detailed analytics.
              </p>
              <div className="flex justify-center flex-wrap gap-4">
                <Link href="/auth/signup">
                  <Button
                    className="border-white border-2 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white transition text-shadow:0_2px_6px_rgba(0,0,0,0.95)"
                    size="lg"
                  >
                    Start Practicing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* ─── END HERO ─────────────────────────────────────────────────── */}

        {/* ─── Ticker ───────────────────────────────────────────────────── */}
        <div className="border-y border-brand-100 bg-brand-50 py-3 overflow-hidden select-none">
          <div className="ticker-track flex gap-0 w-max">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-3 px-6 text-sm font-medium text-brand-700 whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ─── Features ─────────────────────────────────────────────────── */}
        <section id="features" className="py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span
                data-reveal
                className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-600 mb-3"
              >
                Why Praxes
              </span>
              <h2
                data-reveal
                data-delay="1"
                className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 tracking-tight"
              >
                Built for serious learners
              </h2>
              <p
                data-reveal
                data-delay="2"
                className="text-lg text-gray-500 max-w-xl mx-auto"
              >
                Everything you need to excel — structured practice, instant
                feedback, and analytics that actually tell you something
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f, i) => (
                <div
                  key={i}
                  data-reveal
                  data-delay={String(i + 1)}
                  className="feature-card group p-7 rounded-2xl border border-gray-100 bg-white hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 cursor-default"
                >
                  <div className="feature-icon-wrap w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center mb-5 group-hover:bg-brand-100 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2.5 text-base">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Feature deep-dive 1: Test Interface ──────────────────────── */}
        <section className="py-24 bg-brand-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span
                  data-reveal
                  className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-600 mb-4"
                >
                  Smart Practice
                </span>
                <h2
                  data-reveal
                  data-delay="1"
                  className="text-4xl font-semibold text-gray-900 mb-5 tracking-tight leading-snug"
                >
                  Every question teaches.
                  <br />
                  Not just tests.
                </h2>
                <p
                  data-reveal
                  data-delay="2"
                  className="text-gray-500 leading-relaxed mb-8"
                >
                  Questions are drawn randomly from the chapter, options are
                  reshuffled per session, and the answer is never revealed until
                  you submit. Then — a full explanation, every time. No more
                  guessing and moving on.
                </p>
                <div data-reveal data-delay="3" className="space-y-4">
                  {[
                    "LaTeX-rendered math and science notation",
                    "Options reshuffled every session",
                    "Timer to simulate exam pressure",
                    "Step-by-step explanation after each answer",
                  ].map((pt, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        size={17}
                        className="text-brand-500 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-gray-600">{pt}</span>
                    </div>
                  ))}
                </div>
                <div data-reveal data-delay="4" className="mt-8">
                  <Link href="/auth/signup">
                    <Button size="lg">
                      Try a test free <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Mock test UI */}
              <div
                data-reveal
                data-delay="2"
                className="relative flex justify-center lg:justify-end"
              >
                <div className="float-card bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-full max-w-[360px]">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        Mathematics · Chapter 4
                      </p>
                      <p className="text-xs font-semibold text-gray-700">
                        Question 12 of 20
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </svg>
                      15:42
                    </div>
                  </div>
                  <div className="mb-5">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: "60%" }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      60% complete
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-5 leading-relaxed">
                    Solve for <em>x</em>: x² + 5x + 6 = 0
                  </p>
                  <div className="space-y-2.5">
                    {[
                      "x = −2 and −3",
                      "x = 2 and 3",
                      "x = −2 and 3",
                      "x = 1 and 6",
                    ].map((opt, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm transition-colors ${i === 0 ? "border-brand-500 bg-brand-50" : "border-gray-100 hover:border-gray-200"}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500"}`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span
                          className={
                            i === 0
                              ? "text-brand-700 font-medium"
                              : "text-gray-600"
                          }
                        >
                          {opt}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2.5 mt-5">
                    <button className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                      Skip
                    </button>
                    <button className="flex-1 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors">
                      Next →
                    </button>
                  </div>
                </div>
                {/* floating badge */}
                <div className="float-card-slow absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-brand-100 px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">
                      Answer explained
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Full step-by-step solution
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Feature deep-dive 2: Analytics ───────────────────────────── */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Mock analytics UI */}
              <div
                data-reveal
                className="relative flex justify-center lg:justify-start order-2 lg:order-1"
              >
                <div className="float-card-slow bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-full max-w-[360px]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Performance Overview
                    </h3>
                    <span className="text-xs text-gray-400">Last 30 days</span>
                  </div>
                  <div className="space-y-4 mb-6">
                    {[
                      { topic: "Algebra", pct: 92 },
                      { topic: "Geometry", pct: 74 },
                      { topic: "Trigonometry", pct: 58 },
                      { topic: "Statistics", pct: 85 },
                      { topic: "Calculus", pct: 67 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-600">{item.topic}</span>
                          <span className="font-semibold text-gray-900">
                            {item.pct}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bar-animated ${item.pct >= 80 ? "bg-brand-500" : item.pct >= 65 ? "bg-yellow-400" : "bg-orange-400"}`}
                            style={{ ["--bar-w" as any]: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-3">
                    {[
                      ["Overall", "76%", "text-brand-600"],
                      ["Tests", "14", "text-gray-900"],
                      ["Streak", "7d 🔥", "text-orange-500"],
                    ].map(([label, val, cls], i) => (
                      <div key={i} className="text-center">
                        <p className={`text-xl font-bold ${cls}`}>{val}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="float-card absolute -top-5 -right-4 bg-white rounded-2xl shadow-xl border border-orange-100 px-4 py-3">
                  <p className="text-[11px] text-gray-500 mb-0.5">
                    Needs attention
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    Trigonometry
                  </p>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <span
                  data-reveal
                  className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-600 mb-4"
                >
                  Analytics
                </span>
                <h2
                  data-reveal
                  data-delay="1"
                  className="text-4xl font-semibold text-gray-900 mb-5 tracking-tight leading-snug"
                >
                  Know exactly where
                  <br />
                  you stand.
                </h2>
                <p
                  data-reveal
                  data-delay="2"
                  className="text-gray-500 leading-relaxed mb-8"
                >
                  Most students study harder without knowing what to study.
                  Praxes tracks accuracy per topic over time, surfaces your
                  weakest areas automatically, and shows you how you're
                  improving week over week.
                </p>
                <div data-reveal data-delay="3" className="space-y-4">
                  {[
                    "Topic-level accuracy breakdown",
                    "Week-by-week improvement charts",
                    "Strongest and weakest subject detection",
                    "Daily practice streak tracking",
                  ].map((pt, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        size={17}
                        className="text-brand-500 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-gray-600">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats counter ─────────────────────────────────────────────── */}
        <section className="py-24 bg-[#0d1e18]">
          <div className="max-w-7xl mx-auto px-6">
            <div data-reveal className="text-center mb-14">
              <h2 className="text-3xl font-semibold text-white mb-3">
                Students who practise, win
              </h2>
              <p className="text-white/40 text-base">
                Numbers that speak for themselves
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div
                  key={i}
                  data-reveal
                  data-delay={String(i + 1)}
                  className="text-center p-7 rounded-2xl border border-white/8 bg-white/4 hover:bg-white/7 transition-colors"
                >
                  <div className="text-5xl font-bold text-white mb-2 tabular-nums">
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <p className="text-white/50 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Classes covered ───────────────────────────────────────────── */}
        <section id="classes" className="py-28 bg-brand-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span
                data-reveal
                className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-600 mb-3"
              >
                Coverage
              </span>
              <h2
                data-reveal
                data-delay="1"
                className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight"
              >
                Classes 1–12, fully covered
              </h2>
              <p data-reveal data-delay="2" className="text-lg text-gray-500">
                Comprehensive test series for every grade and subject
                combination
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {classes.map((c, i) => (
                <div
                  key={i}
                  data-reveal
                  data-delay={String(i + 1)}
                  className="bg-white rounded-2xl border border-brand-100 p-6 shadow-sm hover:shadow-lg hover:shadow-brand-500/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-2xl mb-3">{c.icon}</div>
                  <h3 className="font-semibold text-brand-700 mb-4 text-sm uppercase tracking-wide">
                    {c.range}
                  </h3>
                  <ul className="space-y-2.5">
                    {c.subjects.map((sub, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2.5 text-sm text-gray-700"
                      >
                        <CheckCircle2
                          size={14}
                          className="text-brand-500 flex-shrink-0"
                        />
                        {sub}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      {c.subjects.length} subjects · All chapters
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How it works ──────────────────────────────────────────────── */}
        <section className="py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span
                data-reveal
                className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-600 mb-3"
              >
                Get Started
              </span>
              <h2
                data-reveal
                data-delay="1"
                className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight"
              >
                Up and running in 60 seconds
              </h2>
              <p data-reveal data-delay="2" className="text-lg text-gray-500">
                No setup, no configuration. Just pick a chapter and practice.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div
                className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px"
                style={{
                  background:
                    "repeating-linear-gradient(to right, #a2d6c5 0, #a2d6c5 6px, transparent 6px, transparent 14px)",
                }}
              />
              {[
                {
                  n: "1",
                  title: "Create a free account",
                  detail:
                    "Sign up in under a minute. No credit card required to start.",
                },
                {
                  n: "2",
                  title: "Pick your class & chapter",
                  detail:
                    "Browse the full curriculum. Find your exact chapter and start immediately.",
                },
                {
                  n: "3",
                  title: "Practice, review, improve",
                  detail:
                    "Complete tests, study the explanations, watch your accuracy climb.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  data-reveal
                  data-delay={String(i + 1)}
                  className="text-center relative z-10"
                >
                  <div className="w-20 h-20 rounded-2xl bg-brand-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-xl shadow-brand-500/25">
                    {step.n}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-base">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
            <div data-reveal className="text-center mt-12">
              <Link href="/auth/signup">
                <Button size="lg">
                  Create free account <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Testimonials ──────────────────────────────────────────────── */}
        <section className="py-28 bg-brand-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span
                data-reveal
                className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-600 mb-3"
              >
                Student Stories
              </span>
              <h2
                data-reveal
                data-delay="1"
                className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight"
              >
                Real results, real students
              </h2>
              <p data-reveal data-delay="2" className="text-lg text-gray-500">
                From consistent practice to board exam success
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  data-reveal
                  data-delay={String(i + 1)}
                  className="testimonial-card bg-white rounded-2xl border border-gray-100 shadow-sm p-7"
                >
                  <div className="flex gap-0.5 mb-5">
                    {Array(5)
                      .fill(0)
                      .map((_, j) => (
                        <Star
                          key={j}
                          size={14}
                          className="text-amber-400 fill-amber-400"
                        />
                      ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-7">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-400">{t.meta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Pricing ───────────────────────────────────────────────────── */}
        {/* <section id="pricing" className="py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span
                data-reveal
                className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-600 mb-3"
              >
                Pricing
              </span>
              <h2
                data-reveal
                data-delay="1"
                className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight"
              >
                Simple, honest pricing
              </h2>
              <p data-reveal data-delay="2" className="text-lg text-gray-500">
                No hidden fees. Cancel anytime.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {pricingPlans.map((plan, i) => (
                <div
                  key={i}
                  data-reveal
                  data-delay={String(i + 1)}
                  className={[
                    "bg-white rounded-2xl p-7 flex flex-col border transition-all",
                    plan.popular
                      ? "plan-popular border-brand-500"
                      : "border-gray-100 shadow-sm hover:shadow-lg",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    {plan.popular && (
                      <span className="bg-brand-500 text-white text-[11px] font-semibold py-1 px-2.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="mb-1">
                    <span className="text-4xl font-bold text-brand-600">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                  {plan.save ? (
                    <span className="text-xs font-semibold text-green-600 mb-5">
                      {plan.save}
                    </span>
                  ) : (
                    <span className="text-xs text-transparent mb-5">–</span>
                  )}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2.5 text-sm text-gray-600"
                      >
                        <CheckCircle2
                          size={14}
                          className="text-brand-500 flex-shrink-0"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/signup">
                    <Button
                      variant={plan.popular ? "primary" : "outline"}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
            <p data-reveal className="text-center text-sm text-gray-400 mt-7">
              All plans include a 7-day free trial. No credit card required.
            </p>
          </div>
        </section> */}

        {/* ─── CTA band ──────────────────────────────────────────────────── */}
        <section className="py-24 bg-[#0d1e18] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')] bg-[length:128px]" />
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <div
              data-reveal
              className="inline-flex items-center gap-2 text-brand-400 text-xs font-semibold tracking-widest uppercase mb-6 px-4 py-2 rounded-full border border-brand-800 bg-brand-900/40"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block" />
              Join 12,000+ students
            </div>
            <h2
              data-reveal
              data-delay="1"
              className="text-4xl lg:text-5xl font-semibold text-white mb-5 tracking-tight"
            >
              Your next exam.
              <br />
              Start preparing today.
            </h2>
            <p
              data-reveal
              data-delay="2"
              className="text-white/50 text-lg mb-10"
            >
              Free to start. No credit card. First test in under two minutes.
            </p>
            <div
              data-reveal
              data-delay="3"
              className="flex flex-col items-center sm:flex-row gap-4 justify-center"
            >
              <Link href="/auth/signup">
                <button className="px-8 py-3.5 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 active:bg-brand-700 transition-colors flex items-center gap-2 justify-center">
                  Start Practicing Free <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="px-8 py-3.5 bg-white/8 border border-white/15 text-white text-sm font-medium rounded-xl hover:bg-white/12 transition-colors">
                  Already have an account
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Footer ────────────────────────────────────────────────────── */}
        <footer className="bg-[#080f0c] text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-5 gap-8 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Praxes</h3>
                </div>
                <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                  Structured test preparation for Classes 1–12. Practice.
                  Analyze. Excel.
                </p>
                <div className="flex gap-4 mt-5">
                  {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-8 h-8 rounded-lg bg-white/6 border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-400 hover:bg-brand-900/40 transition-all"
                    >
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              </div>
              {[
                {
                  heading: "Product",
                  links: [
                    "Features",
                    // "Pricing",
                    "Classes 1–12",
                    "How it works",
                  ],
                },
                { heading: "Company", links: ["About", "Contact", "Blog"] },
                {
                  heading: "Legal",
                  links: [
                    "Privacy Policy",
                    "Terms of Service",
                    "Refund Policy",
                  ],
                },
              ].map((col, i) => (
                <div key={i}>
                  <h4 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wide">
                    {col.heading}
                  </h4>
                  <ul className="space-y-2.5">
                    {col.links.map((link, j) => (
                      <li key={j}>
                        <a
                          href="#"
                          className="text-sm text-white/35 hover:text-white/80 transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-white/6 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-white/25 text-xs">
                © {currentYear} Praxes.in — All rights reserved
              </p>
              <p className="text-white/20 text-xs">
                Built for every student in India
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
