"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
  Wrench,
  MapPin,
  Star,
  Mail,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Settings {
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  service_categories: string[];
  zip_codes: string;
  warn_outside_area: boolean;
  review_link: string;
  customer_confirmation_template: string;
  lead_alert_template: string;
}

const DEFAULT_CATEGORIES = [
  "Basement Waterproofing",
  "Foundation Repair",
  "Crawl Space Repair",
  "Concrete Lifting",
];

const DEFAULT_SETTINGS: Settings = {
  contact_name: "Matthew Urbanski",
  contact_phone: "(470) 568-1681",
  contact_email: "matthew.urbanski@aquaguard.net",
  service_categories: [...DEFAULT_CATEGORIES],
  zip_codes: "",
  warn_outside_area: false,
  review_link: "",
  customer_confirmation_template:
    "Hi {name},\n\nThank you for scheduling your free inspection with AquaGuard Foundation Solutions. I look forward to helping you protect your home.\n\nYour appointment is on {date} at {time}.\n\nBest regards,\nMatthew Urbanski",
  lead_alert_template:
    "New lead: {name}\nScore: {score}\nPhone: {phone}\nEmail: {email}\nIssues: {issues}\nCity: {city}",
};

/* ------------------------------------------------------------------ */
/*  Toast notification                                                 */
/* ------------------------------------------------------------------ */
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
        type === "success"
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      {message}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings((prev) => ({ ...prev, ...data.settings }));
          }
        }
      } catch {
        // Use defaults if settings API doesn't exist yet
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      setToast({ message: "Settings saved successfully!", type: "success" });
    } catch {
      setToast({
        message: "Failed to save settings. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  function toggleCategory(category: string) {
    setSettings((prev) => {
      const cats = prev.service_categories.includes(category)
        ? prev.service_categories.filter((c) => c !== category)
        : [...prev.service_categories, category];
      return { ...prev, service_categories: cats };
    });
  }

  function updateField<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-navy" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-dark transition disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* ---- Contact Info ---- */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <User className="h-4 w-4" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={settings.contact_name}
              onChange={(e) => updateField("contact_name", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Phone</label>
            <input
              type="tel"
              value={settings.contact_phone}
              onChange={(e) => updateField("contact_phone", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => updateField("contact_email", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* ---- Service Categories ---- */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          Service Categories
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          Toggle which issue types appear in the booking form.
        </p>
        <div className="space-y-3">
          {DEFAULT_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                  settings.service_categories.includes(cat)
                    ? "bg-navy border-navy"
                    : "border-gray-300 group-hover:border-navy"
                }`}
              >
                {settings.service_categories.includes(cat) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ---- Service Area ---- */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Service Area
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              ZIP Codes (comma separated)
            </label>
            <textarea
              value={settings.zip_codes}
              onChange={(e) => updateField("zip_codes", e.target.value)}
              rows={3}
              placeholder="30301, 30302, 30303, 30304..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent resize-y"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                settings.warn_outside_area
                  ? "bg-navy border-navy"
                  : "border-gray-300 group-hover:border-navy"
              }`}
              onClick={() =>
                updateField("warn_outside_area", !settings.warn_outside_area)
              }
            >
              {settings.warn_outside_area && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-700">
              Warn if customer is outside service area
            </span>
          </label>
        </div>
      </div>

      {/* ---- Review Link ---- */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Star className="h-4 w-4" />
          Review Link
        </h3>
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Google Business Profile Review URL
          </label>
          <input
            type="url"
            value={settings.review_link}
            onChange={(e) => updateField("review_link", e.target.value)}
            placeholder="https://g.page/r/..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>
      </div>

      {/* ---- Email Templates ---- */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Templates
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Available variables: {"{name}"}, {"{email}"}, {"{phone}"},{" "}
          {"{date}"}, {"{time}"}, {"{city}"}, {"{issues}"}, {"{score}"}
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Customer Confirmation Template
            </label>
            <textarea
              value={settings.customer_confirmation_template}
              onChange={(e) =>
                updateField("customer_confirmation_template", e.target.value)
              }
              rows={6}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent resize-y font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Lead Alert Template
            </label>
            <textarea
              value={settings.lead_alert_template}
              onChange={(e) =>
                updateField("lead_alert_template", e.target.value)
              }
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent resize-y font-mono"
            />
          </div>
        </div>
      </div>

      {/* Bottom save button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-navy-dark transition disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
