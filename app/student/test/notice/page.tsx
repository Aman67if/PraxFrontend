"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import {
  AlertTriangle,
  Monitor,
  EyeOff,
  Smartphone,
  ArrowLeft,
  ArrowRight,
  Shield,
} from "lucide-react";

function NoticeContent() {
  const router = useRouter();
  const params = useSearchParams();
  const groupId = params.get("groupId");

  const handleContinue = async () => {
    // Enter fullscreen
    try {
      await document.documentElement.requestFullscreen();
    } catch {}
    // Navigate to test page
    router.push(`/student/test?groupId=${groupId}`);
  };

  const rules = [
    {
      icon: <Monitor size={22} className="text-red-500" />,
      title: "Full-Screen Mode",
      desc: "The test will open in full-screen mode. Exiting full-screen will automatically submit your test.",
      color: "bg-red-50 border-red-100",
    },
    {
      icon: <EyeOff size={22} className="text-amber-500" />,
      title: "No Tab Switching",
      desc: "Switching tabs, minimizing the browser, or navigating away will automatically submit your test.",
      color: "bg-amber-50 border-amber-100",
    },
    {
      icon: <Smartphone size={22} className="text-purple-500" />,
      title: "No External Devices",
      desc: "Please do not use any mobile or electronic device to answer questions. This test is meant to improve confidence and achieve perfection in weaker areas.",
      color: "bg-purple-50 border-purple-100",
    },
    {
      icon: <Shield size={22} className="text-brand-500" />,
      title: "Auto-Submit on Close",
      desc: "If you close the browser or the browser crashes, your test will be automatically submitted with the answers recorded so far.",
      color: "bg-brand-50 border-brand-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={36} className="text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Before You Start
          </h1>
          <p className="text-gray-500">
            Please read the following rules carefully before proceeding
          </p>
        </div>

        {/* Rules */}
        <div className="space-y-3 mb-8">
          {rules.map((rule, i) => (
            <Card key={i} className={`${rule.color} border`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">{rule.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {rule.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Formal Notice */}
        <Card className="bg-gray-900 border-gray-800 text-white mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm leading-relaxed text-gray-300">
              <span className="font-semibold text-white">Important:</span> This
              test is meant to improve your confidence and achieve perfection in
              weaker areas. Please don&apos;t use any mobile or electronic
              device to answer questions, as it worsens knowledge and wastes
              practice. Once you click &quot;Continue&quot;, the test cannot be
              exited.
            </p>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
          <Button size="lg" onClick={handleContinue}>
            Continue to Test
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TestNoticePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <NoticeContent />
    </Suspense>
  );
}
