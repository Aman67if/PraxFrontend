"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Modal } from "@/components/Modal";
import { API_URL, apiFetch } from "@/lib/api";

import {
  Trash2,
  List,
  Plus,
  Loader2,
} from "lucide-react";

export default function SubscriptionPlansAdmin() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("SUBJECT");
  const [formBilling, setFormBilling] = useState("MONTHLY");
  const [formPrice, setFormPrice] = useState("");
  const [formOfferPrice, setFormOfferPrice] = useState("");
  const [formOfferEnd, setFormOfferEnd] = useState("");
  const [formSubjects, setFormSubjects] = useState("");
  const [formTopic, setFormTopic] = useState("");
  const [formClass, setFormClass] = useState("");

  const fetchPlans = async () => {
    try {
      const res = await apiFetch(`${API_URL}/admin/subscription-plans?all=true`, { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        setPlans(json.data || []);
      }
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormName(""); setFormPrice(""); setFormOfferPrice(""); setFormOfferEnd(""); setFormSubjects(""); setFormTopic(""); setFormClass("");
    setIsModalOpen(true);
  };

  const openEditModal = (plan: any) => {
    setEditingPlan(plan);
    setFormName(plan.name);
    setFormType(plan.type);
    setFormBilling(plan.billing_cycle);
    setFormPrice(String(plan.price));
    setFormOfferPrice(plan.offer_price ? String(plan.offer_price) : "");
    setFormOfferEnd(plan.offer_end_date ? plan.offer_end_date.split('T')[0] : "");
    setFormSubjects(plan.subjects ? plan.subjects.map((s:any) => s.subject).join(", ") : "");
    setFormTopic(plan.topic || "");
    setFormClass(plan.class_level ? String(plan.class_level) : "");
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formName.trim() || !formPrice) return;
    setSubmitting(true);
    try {
      const body: any = {
        name: formName,
        price: parseFloat(formPrice),
      };
      if (formOfferPrice) body.offer_price = parseFloat(formOfferPrice);
      if (formOfferEnd) body.offer_end_date = new Date(formOfferEnd);
      
      // Type-specific fields are usually not updated to prevent messing up existing subs, but we allow it for creation
      if (!editingPlan) {
        body.type = formType;
        body.billing_cycle = formBilling;
        if (formType === "SUBJECT") body.subjects = [formSubjects.trim()];
        if (formType === "SUBJECT_BUNDLE") body.subjects = formSubjects.split(",").map((s: string) => s.trim());
        if (formType === "TOPIC") body.topic = formTopic;
        if (formClass) body.class_level = parseInt(formClass);
      } else {
         // Allow updating is_active as part of update
         body.is_active = editingPlan.is_active;
      }

      const url = editingPlan 
        ? `${API_URL}/admin/subscription-plans/${editingPlan.id}`
        : `${API_URL}/admin/subscription-plans`;
      const method = editingPlan ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchPlans();
      } else {
        const json = await res.json();
        alert(json.message || "Failed to save plan.");
      }
    } catch { }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this plan? This cannot be undone.")) return;
    try {
      const res = await apiFetch(`${API_URL}/admin/subscription-plans/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        fetchPlans();
      } else {
        const json = await res.json();
        alert(json.message || "Failed to delete plan.");
      }
    } catch { }
  };

  const toggleActive = async (id: number, currentActive: boolean) => {
    try {
      await apiFetch(`${API_URL}/admin/subscription-plans/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_active: !currentActive }),
      });
      fetchPlans();
    } catch { }
  };

  return (
    <>
      <Navbar title="Manage Subscription Plans" />

      <div className="p-5 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">All Plans</h2>
          <Button size="sm" onClick={openCreateModal}>
            <Plus size={14} /> Create Plan
          </Button>
        </div>
        {loading ? (
          <div className="py-20 text-center"><Loader2 size={24} className="animate-spin mx-auto text-gray-400" /></div>
        ) : plans.length === 0 ? (
          <Card className="py-16 text-center">
            <p className="text-gray-500">No subscription plans yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan: any) => (
              <Card key={plan.id} className={!plan.is_active ? "opacity-60" : ""}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                      {plan.type?.replace("_", " ")}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-sm mt-1">{plan.name}</h3>
                  </div>
                  <button
                    onClick={() => toggleActive(plan.id, plan.is_active)}
                    className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${plan.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {plan.is_active ? "Active" : "Inactive"}
                  </button>
                </div>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-xl font-bold text-gray-900">₹{plan.price}</span>
                  {plan.offer_price && (
                    <span className="text-sm text-brand-600">→ ₹{plan.offer_price}</span>
                  )}
                  <span className="text-xs text-gray-400">/{plan.billing_cycle?.toLowerCase()}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {plan.subjects?.map((s: any) => s.subject).join(", ") || plan.topic || "—"}
                </p>
                <p className="text-xs text-gray-400 mt-1 mb-4">
                  {plan._count?.subscriptions || 0} subscribers
                </p>
                <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-3">
                  <button onClick={() => openEditModal(plan)} className="text-brand-600 text-xs font-semibold hover:underline">
                    Edit Plan
                  </button>
                  <button onClick={() => handleDelete(plan.id)} className="text-red-500 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Plan Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPlan ? "Edit Subscription Plan" : "Create Subscription Plan"}>
        <div className="space-y-4">
          <Input label="Plan Name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Mathematics Monthly" required />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" disabled={!!editingPlan} options={[
              { value: "SUBJECT", label: "Single Subject" },
              { value: "SUBJECT_BUNDLE", label: "Subject Bundle" },
              { value: "TOPIC", label: "Single Topic" },
            ]} value={formType} onChange={(e) => setFormType(e.target.value)} />
            <Select label="Billing Cycle" disabled={!!editingPlan} options={[
              { value: "MONTHLY", label: "Monthly" },
              { value: "YEARLY", label: "Yearly" },
            ]} value={formBilling} onChange={(e) => setFormBilling(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" label="Price (₹)" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="499" required />
            <Input type="number" label="Offer Price (₹)" value={formOfferPrice} onChange={(e) => setFormOfferPrice(e.target.value)} placeholder="optional" />
          </div>
          {formOfferPrice && (
            <Input type="date" label="Offer End Date" value={formOfferEnd} onChange={(e) => setFormOfferEnd(e.target.value)} />
          )}
          {(formType === "SUBJECT" || formType === "SUBJECT_BUNDLE") && (
            <Input label={formType === "SUBJECT" ? "Subject" : "Subjects (comma-separated)"}
              disabled={!!editingPlan}
              value={formSubjects} onChange={(e) => setFormSubjects(e.target.value)}
              placeholder={formType === "SUBJECT" ? "Mathematics" : "Math, Science, Physics"} />
          )}
          {formType === "TOPIC" && (
            <Input label="Topic" disabled={!!editingPlan} value={formTopic} onChange={(e) => setFormTopic(e.target.value)} placeholder="Linear Equations" />
          )}
          <Select label="Class (optional)" disabled={!!editingPlan} options={[
            { value: "", label: "All classes" },
            ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Class ${i + 1}` })),
          ]} value={formClass} onChange={(e) => setFormClass(e.target.value)} />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 size={14} className="animate-spin" /> : (editingPlan ? <List size={14}/> : <Plus size={14} />)}
              {editingPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </div>
      </Modal >
    </>
  );
}
