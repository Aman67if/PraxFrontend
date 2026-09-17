"use client"
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  CreditCard,
  Sparkles, Calendar, Loader2, Crown, CheckCircle2, AlertCircle, X
} from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL, apiFetch } from "@/lib/api";

function SubscriptionContent() {
  const [activeSubs, setActiveSubs] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [userClassLevel, setUserClassLevel] = useState<number | null>(null);

  // Per-plan loading state
  const [subscribing, setSubscribing] = useState<number | null>(null);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [paymentResult, setPaymentResult] = useState<'success' | 'failed' | null>(null);
  const [paymentReason, setPaymentReason] = useState<string | null>(null);
  const paytmFormRef = useRef<HTMLFormElement>(null);
  const [paytmData, setPaytmData] = useState<Record<string, string> | null>(null);

  const fetchSubs = async () => {
    try {
      const res = await apiFetch(`${API_URL}/subscriptions/my-subscriptions`, { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        setActiveSubs(json.data || []);
      }
    } catch { }
  };

  useEffect(() => {
    const result = searchParams.get('payment');
    const reason = searchParams.get('reason');
    if (result === 'success') { setPaymentResult('success'); fetchSubs(); }
    else if (result === 'failed') {
      setPaymentResult('failed');
      setPaymentReason(reason);
    }
  }, []);

  // Auto-submit the Paytm form when paytmData is set
  useEffect(() => {
    if (paytmData && paytmFormRef.current) {
      paytmFormRef.current.submit();
    }
  }, [paytmData]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await apiFetch(`${API_URL}/auth/me`, { credentials: "include" });
        if (res.ok) {
          const json = await res.json();
          setUserClassLevel(json.data?.class_level ?? null);
        }
      } catch { }
    };
    const fetchPlans = async () => {
      setPlansLoading(true);
      try {
        const res = await apiFetch(`${API_URL}/subscriptions/plans`, { credentials: "include" });
        if (res.ok) {
          const json = await res.json();
          setPlans(json.data || []);
        }
      } catch { }
      setPlansLoading(false);
    };
    fetchMe();
    fetchSubs();
    fetchPlans();
  }, []);

  const sortedPlans = [...plans].sort((a, b) => {
    const aMatch = userClassLevel && a.class_levels?.includes(userClassLevel) ? 0 : 1;
    const bMatch = userClassLevel && b.class_levels?.includes(userClassLevel) ? 0 : 1;
    if (aMatch !== bMatch) return aMatch - bMatch;
    return 0;
  });

  const handleSubscribe = async (plan: any) => {
    setSubscribing(plan.id);
    setSubscribeError(null);
    try {
      const res = await apiFetch(`${API_URL}/payments/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan_id: plan.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to initiate payment.");
      // Set Paytm form data — useEffect will auto-submit the form
      setPaytmData(json.data);
    } catch (err: any) {
      setSubscribeError(err.message);
      setSubscribing(null);
    }
  };

  const isAlreadySubscribed = (planId: number) =>
    activeSubs.some((s: any) => s.plan_id === planId);

  return (
    <>
      <Navbar title="Subscriptions" />

      {/* Hidden Paytm form — auto-submits to redirect user to payment gateway */}
      {paytmData && (
        <form
          ref={paytmFormRef}
          method="POST"
          action={paytmData.txnUrl}
          style={{ display: 'none' }}
        >
          {Object.entries(paytmData)
            .filter(([key]) => key !== 'txnUrl' && key !== 'plan_id')
            .map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={String(value)} />
            ))}
        </form>
      )}

      <div className="p-5 lg:p-8 max-w-5xl">
        <div className="mb-7">
          <h1 className="text-2xl font-semibold text-gray-900">Subscription Plans</h1>
          <p className="text-sm text-gray-500 mt-1">Choose the plan that works best for you</p>
        </div>

        {/* Payment result banners (from Paytm redirect) */}
        {paymentResult === 'success' && (
          <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />
            <span className="flex-1">Payment successful! Your subscription is now active.</span>
            <button onClick={() => setPaymentResult(null)}><X size={14} /></button>
          </div>
        )}
        {paymentResult === 'failed' && (
          <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
            <span className="flex-1">Payment failed or was cancelled. Please try again. {paymentReason && `(Reason: ${paymentReason})`}</span>
            <button onClick={() => setPaymentResult(null)}><X size={14} /></button>
          </div>
        )}
        {subscribeError && (
          <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
            <span className="flex-1">{subscribeError}</span>
            <button onClick={() => setSubscribeError(null)}><X size={14} /></button>
          </div>
        )}

        {/* Active Subscriptions */}
        <Card className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Crown size={16} className="text-amber-500" /> Active Subscriptions
          </h2>
          {activeSubs.length === 0 ? (
            <p className="text-sm text-gray-400">You don&apos;t have any active subscriptions yet.</p>
          ) : (
            <div className="space-y-3">
              {activeSubs.map((sub: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-brand-50 border border-brand-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sub.plan?.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Calendar size={11} /> Expires {new Date(sub.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Active</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Explore Subscriptions */}
        <Card className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-brand-500" /> Explore Subscriptions
          </h2>
          {plansLoading ? (
            <div className="py-8 text-center"><Loader2 size={20} className="animate-spin mx-auto text-gray-400" /></div>
          ) : sortedPlans.length === 0 ? (
            <p className="text-sm text-gray-400">No subscription plans available at the moment.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedPlans.map((plan: any) => {
                const alreadySubscribed = isAlreadySubscribed(plan.id);
                const isLoading = subscribing === plan.id;
                return (
                  <div key={plan.id} className="rounded-xl border border-gray-100 p-5 hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                        {plan.type?.replace("_", " ")}
                      </span>
                      {plan.has_active_offer && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          🎉 Offer!
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1.5 mb-3">
                      {plan.has_active_offer ? (
                        <>
                          <span className="text-xl font-bold text-brand-600">₹{plan.effective_price}</span>
                          <span className="text-sm text-gray-400 line-through">₹{plan.price}</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">₹{plan.price}</span>
                      )}
                      <span className="text-xs text-gray-500">/{plan.billing_cycle?.toLowerCase()}</span>
                    </div>
                    {plan.subjects?.length > 0 && (
                      <p className="text-xs text-gray-500 mb-3">
                        {plan.subjects.map((s: any) => s.subject).join(", ")}
                      </p>
                    )}
                    <div className="flex-1" />
                    {alreadySubscribed ? (
                      <div className="w-full mt-3 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg bg-green-50 border border-green-200 text-green-700">
                        <CheckCircle2 size={14} /> Subscribed
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleSubscribe(plan)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <><Loader2 size={14} className="animate-spin" /> Subscribing…</>
                        ) : (
                          <><CreditCard size={14} /> Subscribe</>
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

export default function Subscription() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-gray-400" /></div>}>
      <SubscriptionContent />
    </Suspense>
  );
}
