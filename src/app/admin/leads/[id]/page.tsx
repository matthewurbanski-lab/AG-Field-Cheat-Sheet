"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Loader2,
  AlertCircle,
  X,
  Send,
  Camera,
  FileText,
  CheckCircle2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Photo {
  id: string;
  url: string;
  file_name?: string;
  created_at: string;
}

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  issues: string[];
  answers: Record<string, unknown>;
  score: number;
  status: string;
  notes: string;
  source: string;
  appointment_date: string | null;
  appointment_time: string | null;
  created_at: string;
  photos?: Photo[];
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const STATUSES = [
  "New",
  "Contacted",
  "Appointment Set",
  "Inspected",
  "Proposal Sent",
  "Sold",
  "Lost",
];

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-700 border-blue-200",
  Contacted: "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Appointment Set": "bg-purple-100 text-purple-700 border-purple-200",
  Inspected: "bg-orange-100 text-orange-700 border-orange-200",
  "Proposal Sent": "bg-cyan-100 text-cyan-700 border-cyan-200",
  Sold: "bg-green-100 text-green-700 border-green-200",
  Lost: "bg-red-100 text-red-700 border-red-200",
};

/* Score breakdown signals — must match scoring.ts logic */
const SCORE_SIGNALS: {
  label: string;
  check: (a: Record<string, unknown>) => boolean;
  points: number;
}[] = [
  {
    label: "Standing water / crawl moisture",
    check: (a) =>
      a.waterFrequency === "standing_water_always" ||
      a.crawlMoisture === "yes",
    points: 20,
  },
  {
    label: "Horizontal cracks",
    check: (a) => a.crackType === "horizontal",
    points: 15,
  },
  {
    label: "Visible mold / efflorescence",
    check: (a) => a.visibleMold === "yes",
    points: 15,
  },
  {
    label: "Sagging floors",
    check: (a) => a.saggingFloors === "yes",
    points: 15,
  },
  {
    label: "ASAP timeline",
    check: (a) => a.timeline === "asap",
    points: 15,
  },
  {
    label: "Multiple issues",
    check: (a) => Array.isArray(a.issues) && a.issues.length > 1,
    points: 10,
  },
  {
    label: "Trip hazard",
    check: (a) => a.tripHazard === "yes",
    points: 10,
  },
  {
    label: "Photos uploaded",
    check: (a) => a.photosUploaded === true,
    points: 10,
  },
  {
    label: "Referral source",
    check: (a) => a.source === "referral",
    points: 5,
  },
  {
    label: "Notes provided",
    check: (a) =>
      typeof a.notes === "string" && a.notes.trim().length > 0,
    points: 5,
  },
  {
    label: "Just exploring timeline",
    check: (a) => a.timeline === "just_exploring",
    points: -10,
  },
  {
    label: "No visible symptoms",
    check: (a) => {
      return !(
        a.visibleMold === "yes" ||
        a.saggingFloors === "yes" ||
        a.wallBowing === "yes" ||
        a.tripHazard === "yes" ||
        a.crawlMoisture === "yes" ||
        a.waterFrequency === "standing_water_always" ||
        a.waterFrequency === "every_rain" ||
        a.crackType === "horizontal" ||
        a.crackType === "wide_vertical" ||
        a.stickingDoorsWindows === "yes" ||
        a.mustySmell === "yes"
      );
    },
    points: -5,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function scoreBadgeColor(score: number) {
  if (score >= 70) return "bg-red-100 text-red-700 border-red-200";
  if (score >= 40) return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-green-100 text-green-700 border-green-200";
}

function scoreLabel(score: number) {
  if (score >= 70) return "HOT LEAD";
  if (score >= 40) return "WARM LEAD";
  return "COOL LEAD";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function prettyAnswerKey(key: string): string {
  const map: Record<string, string> = {
    waterEntry: "Water Entry Location",
    waterFrequency: "Water Frequency",
    visibleMold: "Visible Mold",
    crackType: "Crack Type",
    stickingDoorsWindows: "Sticking Doors/Windows",
    wallBowing: "Wall Bowing",
    priorRepairs: "Prior Repairs",
    mustySmell: "Musty Smell",
    saggingFloors: "Sagging Floors",
    crawlMoisture: "Crawl Space Moisture",
    existingVaporBarrier: "Existing Vapor Barrier",
    concreteLocation: "Concrete Location",
    affectedArea: "Affected Area",
    tripHazard: "Trip Hazard",
    timeline: "Timeline",
    source: "Source",
    photosUploaded: "Photos Uploaded",
  };
  return (
    map[key] ||
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
  );
}

function prettyAnswerValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string")
    return value
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase());
  return String(value);
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Editable fields
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Lightbox
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Email modal
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  const fetchLead = useCallback(async () => {
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (!res.ok) throw new Error("Lead not found");
      const data = await res.json();
      const l = data.lead;
      setLead(l);
      setStatus(l.status || "New");
      setNotes(l.notes || "");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load lead");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  async function patchLead(fields: Record<string, unknown>) {
    setSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error("Failed to update");
      const data = await res.json();
      setLead((prev) => (prev ? { ...prev, ...data.lead } : prev));
      setSaveMessage("Saved");
      setTimeout(() => setSaveMessage(""), 2000);
    } catch {
      setSaveMessage("Error saving");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    setStatus(newStatus);
    await patchLead({ status: newStatus });
  }

  async function handleNotesBlur() {
    if (notes !== (lead?.notes || "")) {
      await patchLead({ notes });
    }
  }

  async function handleSendEmail() {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    setSendingEmail(true);
    setEmailMessage("");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: lead?.email,
          subject: emailSubject,
          message: emailBody,
        }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setEmailMessage("Email sent successfully!");
      setEmailSubject("");
      setEmailBody("");
      setTimeout(() => {
        setEmailModalOpen(false);
        setEmailMessage("");
      }, 1500);
    } catch {
      setEmailMessage("Failed to send email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-navy" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
        <p className="text-lg font-medium text-gray-700">
          {error || "Lead not found"}
        </p>
        <Link
          href="/admin/leads"
          className="mt-4 text-sm text-navy hover:underline font-medium"
        >
          Back to leads
        </Link>
      </div>
    );
  }

  const fullAddress = [lead.address, lead.city, lead.state, lead.zip]
    .filter(Boolean)
    .join(", ");
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;
  const answers = lead.answers || {};
  const photos = lead.photos || [];

  // Compute active score signals
  const mergedAnswers = { ...answers, issues: lead.issues };
  const activeSignals = SCORE_SIGNALS.filter((s) =>
    s.check(mergedAnswers as Record<string, unknown>)
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back + header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {lead.first_name} {lead.last_name}
        </h2>
        <div className="flex items-center gap-3">
          {/* Status dropdown */}
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`text-sm font-medium px-3 py-1.5 rounded-full border focus:outline-none focus:ring-2 focus:ring-navy ${
              STATUS_COLORS[status] || "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {saving && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          {saveMessage && (
            <span
              className={`text-xs font-medium ${
                saveMessage === "Saved" ? "text-green-600" : "text-red-500"
              }`}
            >
              {saveMessage}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT column: Contact + Answers + Photos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <a
                  href={`mailto:${lead.email}`}
                  className="inline-flex items-center gap-1.5 text-navy hover:text-pink transition text-sm font-medium"
                >
                  <Mail className="h-4 w-4" />
                  {lead.email}
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Phone</p>
                <a
                  href={`tel:${lead.phone}`}
                  className="inline-flex items-center gap-1.5 text-navy hover:text-pink transition text-sm font-medium"
                >
                  <Phone className="h-4 w-4" />
                  {lead.phone}
                </a>
              </div>
              {fullAddress && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400 mb-1">Address</p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-navy hover:text-pink transition text-sm font-medium"
                  >
                    <MapPin className="h-4 w-4" />
                    {fullAddress}
                  </a>
                </div>
              )}
              {lead.appointment_date && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400 mb-1">Appointment</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(lead.appointment_date)}
                    {lead.appointment_time
                      ? ` at ${lead.appointment_time}`
                      : ""}
                  </p>
                </div>
              )}
              {lead.source && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Source</p>
                  <p className="text-sm text-gray-700">{lead.source}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 mb-1">Submitted</p>
                <p className="text-sm text-gray-700">
                  {formatDate(lead.created_at)}
                </p>
              </div>
            </div>

            {/* Issues */}
            {lead.issues && lead.issues.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">Issues</p>
                <div className="flex flex-wrap gap-2">
                  {lead.issues.map((issue) => (
                    <span
                      key={issue}
                      className="inline-block bg-navy/10 text-navy text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Qualifying answers */}
          {Object.keys(answers).length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                <FileText className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                Qualifying Answers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {Object.entries(answers)
                  .filter(
                    ([key]) => key !== "notes" && key !== "photosUploaded"
                  )
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-baseline py-2 border-b border-gray-50"
                    >
                      <span className="text-sm text-gray-500">
                        {prettyAnswerKey(key)}
                      </span>
                      <span className="text-sm font-medium text-gray-900 text-right ml-4">
                        {prettyAnswerValue(value)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Photo gallery */}
          {photos.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                <Camera className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                Photos ({photos.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => setLightboxUrl(photo.url)}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-navy"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.file_name || "Lead photo"}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT column: Score + Notes + Actions */}
        <div className="space-y-6">
          {/* Score card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Lead Score
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`text-4xl font-bold ${
                  lead.score >= 70
                    ? "text-red-600"
                    : lead.score >= 40
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {lead.score}
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${scoreBadgeColor(
                  lead.score
                )}`}
              >
                {scoreLabel(lead.score)}
              </span>
            </div>

            {/* Score breakdown */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Score Breakdown
              </p>
              {activeSignals.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  No scoring signals detected
                </p>
              ) : (
                activeSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">{signal.label}</span>
                    <span
                      className={`font-semibold ${
                        signal.points > 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {signal.points > 0 ? "+" : ""}
                      {signal.points}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Private Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              rows={5}
              placeholder="Add private notes about this lead..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">
              Auto-saves when you click away
            </p>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Actions
            </h3>
            <button
              onClick={() => {
                setEmailSubject(
                  `Follow-up: Your AquaGuard Inspection`
                );
                setEmailBody(
                  `Hi ${lead.first_name},\n\nThank you for your interest in AquaGuard Foundation Solutions. I wanted to follow up regarding your inquiry.\n\nPlease don't hesitate to reach out if you have any questions.\n\nBest regards,\nMatthew Urbanski\nAquaGuard Foundation Solutions\n(470) 568-1681`
                );
                setEmailModalOpen(true);
              }}
              className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-dark transition flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send Follow-Up Email
            </button>
            <a
              href={`tel:${lead.phone}`}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Call {lead.first_name}
            </a>
          </div>
        </div>
      </div>

      {/* ---- Lightbox modal ---- */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition"
          >
            <X className="h-8 w-8" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Lead photo"
            className="max-w-full max-h-[90vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ---- Email modal ---- */}
      {emailModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setEmailModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                Send Follow-Up Email
              </h3>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">To</p>
              <p className="text-sm font-medium text-gray-700">{lead.email}</p>
            </div>

            <div className="mb-3">
              <label className="block text-xs text-gray-400 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">
                Message
              </label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={8}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent resize-y"
              />
            </div>

            {emailMessage && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  emailMessage.includes("success")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {emailMessage.includes("success") && (
                  <CheckCircle2 className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                )}
                {emailMessage}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEmailModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={
                  sendingEmail ||
                  !emailSubject.trim() ||
                  !emailBody.trim()
                }
                className="px-5 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy-dark transition disabled:opacity-50 flex items-center gap-2"
              >
                {sendingEmail ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sendingEmail ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
