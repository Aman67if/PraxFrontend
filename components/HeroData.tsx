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

export interface HeroData {
  tickerItems: string[];
  features: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
  stats: {
    value: number;
    suffix: string;
    label: string;
  }[];
  testimonials: {
    name: string;
    meta: string;
    quote: string;
    initials: string;
    color: string;
  }[];
  classes: {
    range: string;
    subjects: string[];
    icon: string;
  }[];
}


export const tickerItems = [
  "50,000+ tests attempted",
  "12,000 active students",
  "500+ chapters covered",
  "Classes 1–12",
  "98% exam success rate",
  "LaTeX question support",
  "Instant detailed explanations",
  "Chapter-wise practice",
  "Performance analytics",
];

export const features = [
  {
    icon: <BookOpen size={24} />,
    title: "Chapter-wise Tests",
    description:
      "Every chapter broken into focused test sets — no more hunting for relevant questions across different sources.",
  },
  {
    icon: <Zap size={24} />,
    title: "Instant Explanations",
    description:
      "Every answer comes with a step-by-step explanation. Learn why you were wrong, not just that you were wrong.",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Deep Analytics",
    description:
      "See exactly which topics need work. Our analytics surface patterns across your test history automatically.",
  },
  {
    icon: <Target size={24} />,
    title: "Adaptive Difficulty",
    description:
      "Tests calibrate to your current level. Challenging enough to grow, manageable enough to stay motivated.",
  },
];

export const stats = [
  { value: 12000, suffix: "+", label: "Active Students" },
  { value: 50000, suffix: "+", label: "Tests Attempted" },
  { value: 500, suffix: "+", label: "Chapters Covered" },
  { value: 98, suffix: "%", label: "Exam Success Rate" },
];

export const testimonials = [
  {
    name: "Riya Sharma",
    meta: "Class 12 · Delhi",
    quote:
      "My board result jumped from 72% to 91% in one year. The analytics showed exactly which topics I was weak in — I stopped wasting time and started targeting my real gaps.",
    initials: "RS",
    color: "#7c3aed",
  },
  {
    name: "Arjun Mehta",
    meta: "Class 10 · Mumbai",
    quote:
      "3 tests every day, every morning before school. The step-by-step explanations after each question taught me more than any textbook did. Scored 94% in Maths.",
    initials: "AM",
    color: "#399376",
  },
  {
    name: "Priya Krishnan",
    meta: "Class 9 · Bangalore",
    quote:
      "I used to freeze up during exams. Two months on Praxes changed that completely. The chapter-wise structure builds your confidence one topic at a time.",
    initials: "PK",
    color: "#d97706",
  },
];

export const classes = [
  {
    range: "Classes 1–5",
    subjects: ["Mathematics", "English", "EVS"],
    icon: "🎒",
  },
  {
    range: "Classes 6–8",
    subjects: ["Mathematics", "English", "Science", "Social Studies"],
    icon: "📐",
  },
  {
    range: "Classes 9–10",
    subjects: ["Mathematics", "English", "Science"],
    icon: "🔬",
  },
  {
    range: "Classes 11–12",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
    icon: "⚛️",
  },
];