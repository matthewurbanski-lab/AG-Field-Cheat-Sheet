"use client";

import { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { format, addDays } from "date-fns";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type IssueId =
  | "basement_water"
  | "foundation"
  | "crawl_space"
  | "concrete"
  | "structural"
  | "general";

interface IssueOption {
  id: IssueId;
  icon: string;
  label: string;
  description: string;
}

interface FollowUp {
  [key: string]: string;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  notes: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ISSUES: IssueOption[] = [
  {
    id: "basement_water",
    icon: "🌊",
    label: "Basement Water / Flooding",
    description: "Leaks, seepage, standing water",
  },
  {
    id: "foundation",
    icon: "🧱",
    label: "Foundation Cracks or Wall Problems",
    description: "Cracks, bowing, shifting walls",
  },
  {
    id: "crawl_space",
    icon: "🕳️",
    label: "Crawl Space Issues",
    description: "Moisture, odor, sagging floors",
  },
  {
    id: "concrete",
    icon: "🏗️",
    label: "Sinking or Uneven Concrete",
    description: "Driveway, patio, sidewalk, garage",
  },
  {
    id: "structural",
    icon: "🔧",
    label: "Structural / Floor Support Issues",
    description: "Sagging beams, uneven floors",
  },
  {
    id: "general",
    icon: "❓",
    label: "Not Sure — General Inspection",
    description: "Let Matthew take a look",
  },
];

const STEP_LABELS = [
  "Issues",
  "Details",
  "Photos",
  "Info",
  "Confirm",
];

const TIME_OPTIONS = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"];

const ACCEPTED_TYPES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/heic": [".heic"],
};

const MAX_PHOTOS = 6;

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.35,
} as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function RadioGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="mb-5">
      <legend className="block text-sm font-semibold text-navy mb-2">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              value === opt
                ? "bg-navy text-white border-navy"
                : "bg-white text-navy border-gray-300 hover:border-navy"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-bold text-navy mt-6 mb-3 border-b border-gray-200 pb-1">
      {children}
    </h3>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step 1
  const [selectedIssues, setSelectedIssues] = useState<IssueId[]>([]);

  // Step 2
  const [followUp, setFollowUp] = useState<FollowUp>({});

  // Step 3
  const [photos, setPhotos] = useState<File[]>([]);

  // Step 4
  const [contact, setContact] = useState<ContactInfo>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    notes: "",
  });

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ---------- navigation helpers ---------- */

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 5));
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  /* ---------- step 1 ---------- */

  const toggleIssue = useCallback((id: IssueId) => {
    setSelectedIssues((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  /* ---------- step 2 ---------- */

  const setFU = useCallback((key: string, value: string) => {
    setFollowUp((prev) => ({ ...prev, [key]: value }));
  }, []);

  /* ---------- step 3 (dropzone) ---------- */

  const onDrop = useCallback(
    (accepted: File[]) => {
      setPhotos((prev) => {
        const combined = [...prev, ...accepted];
        return combined.slice(0, MAX_PHOTOS);
      });
    },
    []
  );

  const removePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: MAX_PHOTOS,
    multiple: true,
  });

  /* ---------- step 4 ---------- */

  const updateContact = useCallback(
    (field: keyof ContactInfo, value: string) => {
      setContact((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const tomorrowStr = useMemo(() => format(addDays(new Date(), 1), "yyyy-MM-dd"), []);

  const step4Valid = useMemo(() => {
    const c = contact;
    return (
      c.firstName.trim() !== "" &&
      c.lastName.trim() !== "" &&
      c.address.trim() !== "" &&
      c.city.trim() !== "" &&
      c.zip.trim() !== "" &&
      c.phone.trim() !== "" &&
      c.email.trim() !== "" &&
      c.date !== "" &&
      c.time !== ""
    );
  }, [contact]);

  /* ---------- submit ---------- */

  const handleSubmit = useCallback(async () => {
    if (submitting || submitted) return;
    setSubmitting(true);

    const payload = {
      issues: selectedIssues,
      followUp,
      contact,
      photoCount: photos.length,
      submittedAt: new Date().toISOString(),
    };

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (photos.length > 0) {
        const formData = new FormData();
        photos.forEach((file, i) => formData.append(`photo_${i}`, file));
        formData.append("email", contact.email);
        formData.append("name", `${contact.firstName} ${contact.lastName}`);
        await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
      }
    } catch {
      // Silently continue to confirmation — backend issues should not block UX
    }

    setSubmitted(true);
    setSubmitting(false);
  }, [submitting, submitted, selectedIssues, followUp, contact, photos]);

  /* ---------------------------------------------------------------- */
  /*  Reach step 5 triggers submission                                 */
  /* ---------------------------------------------------------------- */

  const advanceToConfirmation = useCallback(() => {
    setDirection(1);
    setStep(5);
    // fire submit after render
    setTimeout(() => handleSubmit(), 0);
  }, [handleSubmit]);

  /* ---------------------------------------------------------------- */
  /*  Render Helpers                                                    */
  /* ---------------------------------------------------------------- */

  const renderProgressBar = () => (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;
            return (
              <div key={label} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  {i > 0 && (
                    <div
                      className={`h-0.5 flex-1 transition-colors duration-300 ${
                        step > stepNum - 1 ? "bg-navy" : "bg-gray-300"
                      }`}
                    />
                  )}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 shrink-0 ${
                      isCurrent
                        ? "bg-pink text-white"
                        : isCompleted
                        ? "bg-navy text-white"
                        : "bg-gray-300 text-white"
                    }`}
                  >
                    {isCompleted ? "✓" : stepNum}
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 transition-colors duration-300 ${
                        step > stepNum ? "bg-navy" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium transition-colors duration-300 ${
                    isCurrent
                      ? "text-pink"
                      : isCompleted
                      ? "text-navy"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* ---------- Step 1: Issue Selection ---------- */

  const renderStep1 = () => (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-1">
        What&rsquo;s Your Issue?
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        Select all that apply — Matthew will address everything in one visit.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ISSUES.map((issue) => {
          const selected = selectedIssues.includes(issue.id);
          return (
            <button
              key={issue.id}
              type="button"
              onClick={() => toggleIssue(issue.id)}
              className={`flex flex-col items-center justify-center text-center p-5 rounded-xl border-2 transition-all duration-200 ${
                selected
                  ? "border-navy bg-navy/5 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-400"
              }`}
            >
              <span className="text-4xl mb-2">{issue.icon}</span>
              <span className="font-semibold text-navy text-sm">
                {issue.label}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {issue.description}
              </span>
              {selected && (
                <span className="mt-2 text-xs font-bold text-pink">
                  ✓ Selected
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ---------- Step 2: Follow-Up Questions ---------- */

  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-1">Tell Us More</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Help Matthew prepare — these details make the inspection faster and more
        accurate.
      </p>

      {selectedIssues.includes("basement_water") && (
        <>
          <SectionHeading>🌊 Basement Water / Flooding</SectionHeading>
          <RadioGroup
            label="Where does water enter?"
            options={["Walls", "Floor", "Both", "Not sure"]}
            value={followUp.bw_entry ?? ""}
            onChange={(v) => setFU("bw_entry", v)}
          />
          <RadioGroup
            label="How often?"
            options={["Every rain", "Seasonal", "Occasional", "Standing water always"]}
            value={followUp.bw_frequency ?? ""}
            onChange={(v) => setFU("bw_frequency", v)}
          />
          <RadioGroup
            label="Visible mold or white staining?"
            options={["Yes", "No", "Not sure"]}
            value={followUp.bw_mold ?? ""}
            onChange={(v) => setFU("bw_mold", v)}
          />
        </>
      )}

      {selectedIssues.includes("foundation") && (
        <>
          <SectionHeading>🧱 Foundation Cracks or Wall Problems</SectionHeading>
          <RadioGroup
            label="Type of crack visible?"
            options={["Hairline", "Stair-step", "Horizontal", "Wide vertical", "None visible"]}
            value={followUp.fc_type ?? ""}
            onChange={(v) => setFU("fc_type", v)}
          />
          <RadioGroup
            label="Doors or windows sticking?"
            options={["Yes", "No"]}
            value={followUp.fc_sticking ?? ""}
            onChange={(v) => setFU("fc_sticking", v)}
          />
          <RadioGroup
            label="Any visible wall bowing?"
            options={["Yes", "No", "Not sure"]}
            value={followUp.fc_bowing ?? ""}
            onChange={(v) => setFU("fc_bowing", v)}
          />
          <RadioGroup
            label="Prior repairs?"
            options={["Yes", "No"]}
            value={followUp.fc_prior ?? ""}
            onChange={(v) => setFU("fc_prior", v)}
          />
        </>
      )}

      {selectedIssues.includes("crawl_space") && (
        <>
          <SectionHeading>🕳️ Crawl Space Issues</SectionHeading>
          <RadioGroup
            label="Musty smell inside home?"
            options={["Yes", "No"]}
            value={followUp.cs_smell ?? ""}
            onChange={(v) => setFU("cs_smell", v)}
          />
          <RadioGroup
            label="Soft or sagging floors above?"
            options={["Yes", "No"]}
            value={followUp.cs_sagging ?? ""}
            onChange={(v) => setFU("cs_sagging", v)}
          />
          <RadioGroup
            label="Visible moisture or standing water?"
            options={["Yes", "No"]}
            value={followUp.cs_moisture ?? ""}
            onChange={(v) => setFU("cs_moisture", v)}
          />
          <RadioGroup
            label="Existing vapor barrier?"
            options={["Yes", "No", "Not sure"]}
            value={followUp.cs_barrier ?? ""}
            onChange={(v) => setFU("cs_barrier", v)}
          />
        </>
      )}

      {selectedIssues.includes("concrete") && (
        <>
          <SectionHeading>🏗️ Sinking or Uneven Concrete</SectionHeading>
          <RadioGroup
            label="Location?"
            options={["Driveway", "Patio", "Walkway", "Garage floor", "Pool deck", "Other"]}
            value={followUp.co_location ?? ""}
            onChange={(v) => setFU("co_location", v)}
          />
          <RadioGroup
            label="Affected area size?"
            options={["Less than 10 sqft", "10–50 sqft", "50–100 sqft", "100+ sqft"]}
            value={followUp.co_size ?? ""}
            onChange={(v) => setFU("co_size", v)}
          />
          <RadioGroup
            label="Trip hazard present?"
            options={["Yes", "No"]}
            value={followUp.co_trip ?? ""}
            onChange={(v) => setFU("co_trip", v)}
          />
        </>
      )}

      {/* Questions for ALL issues */}
      <SectionHeading>General</SectionHeading>
      <RadioGroup
        label="How soon are you looking to address this?"
        options={["ASAP", "Within 1 month", "1–3 months", "Just exploring"]}
        value={followUp.timeline ?? ""}
        onChange={(v) => setFU("timeline", v)}
      />
      <RadioGroup
        label="How did you hear about Matthew?"
        options={["Google", "Referral", "Door hanger", "Social media", "Other"]}
        value={followUp.source ?? ""}
        onChange={(v) => setFU("source", v)}
      />
    </div>
  );

  /* ---------- Step 3: Photo Upload ---------- */

  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-1">Upload Photos</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Photos help Matthew prepare before he arrives — show us what you&rsquo;re
        seeing.
      </p>

      {photos.length < MAX_PHOTOS && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-pink bg-pink/5"
              : "border-gray-300 hover:border-navy"
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-4xl mb-2">📷</div>
          <p className="font-medium text-navy">
            {isDragActive
              ? "Drop your photos here"
              : "Drag & drop photos here, or tap to upload"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG, or HEIC — up to {MAX_PHOTOS} photos ({MAX_PHOTOS - photos.length}{" "}
            remaining)
          </p>
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-5">
          {photos.map((file, i) => (
            <div key={`${file.name}-${i}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                aria-label={`Remove ${file.name}`}
              >
                ✕
              </button>
              <p className="text-[10px] text-gray-400 truncate mt-1">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ---------- Step 4: Contact & Schedule ---------- */

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-navy placeholder:text-gray-400 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-colors";

  const renderStep4 = () => (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-1">
        Your Info + Schedule
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        Book a free inspection — Matthew will confirm within 24 hours.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              First Name *
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="First name"
              value={contact.firstName}
              onChange={(e) => updateContact("firstName", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Last Name *
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="Last name"
              value={contact.lastName}
              onChange={(e) => updateContact("lastName", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy mb-1">
            Full Address *
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="123 Main St"
            value={contact.address}
            onChange={(e) => updateContact("address", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              City *
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="City"
              value={contact.city}
              onChange={(e) => updateContact("city", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              ZIP *
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="ZIP code"
              value={contact.zip}
              onChange={(e) => updateContact("zip", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Phone *
            </label>
            <input
              type="tel"
              className={inputClass}
              placeholder="(555) 555-5555"
              value={contact.phone}
              onChange={(e) => updateContact("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Email *
            </label>
            <input
              type="email"
              className={inputClass}
              placeholder="you@email.com"
              value={contact.email}
              onChange={(e) => updateContact("email", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Preferred Date *
            </label>
            <input
              type="date"
              className={inputClass}
              min={tomorrowStr}
              value={contact.date}
              onChange={(e) => updateContact("date", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Preferred Time *
            </label>
            <select
              className={inputClass}
              value={contact.time}
              onChange={(e) => updateContact("time", e.target.value)}
            >
              <option value="">Select a time</option>
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy mb-1">
            Anything else Matthew should know?
          </label>
          <textarea
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="Access instructions, pet info, anything helpful..."
            value={contact.notes}
            onChange={(e) => updateContact("notes", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  /* ---------- Step 5: Confirmation ---------- */

  const selectedIssueLabels = useMemo(
    () =>
      selectedIssues.map(
        (id) => ISSUES.find((i) => i.id === id)?.label ?? id
      ),
    [selectedIssues]
  );

  const formattedDate = useMemo(() => {
    if (!contact.date) return "";
    try {
      return format(new Date(contact.date + "T12:00:00"), "EEEE, MMMM d, yyyy");
    } catch {
      return contact.date;
    }
  }, [contact.date]);

  const renderStep5 = () => (
    <div className="text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-navy mb-2">
        You&rsquo;re All Set!
      </h2>
      <p className="text-gray-500 mb-8 text-sm">
        Your free inspection request has been submitted.
      </p>

      <div className="bg-gray-light rounded-xl p-6 text-left max-w-md mx-auto space-y-3">
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Issues
          </span>
          <p className="text-sm text-navy font-medium">
            {selectedIssueLabels.join(", ")}
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Appointment
          </span>
          <p className="text-sm text-navy font-medium">
            {formattedDate} at {contact.time}
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Address
          </span>
          <p className="text-sm text-navy font-medium">
            {contact.address}, {contact.city} {contact.zip}
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Name
          </span>
          <p className="text-sm text-navy font-medium">
            {contact.firstName} {contact.lastName}
          </p>
        </div>
        {photos.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Photos
            </span>
            <p className="text-sm text-navy font-medium">
              {photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-3 max-w-md mx-auto">
        <p className="text-sm text-navy font-medium">
          Matthew will review your photos before your visit.
        </p>
        <p className="text-sm text-gray-500">
          Expect a call from Matthew to confirm within 24 hours.
        </p>
      </div>

      <Link
        href="/"
        className="inline-block mt-8 bg-navy text-white font-semibold px-8 py-3 rounded-full hover:bg-navy-dark transition-colors"
      >
        Done
      </Link>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step content map                                                 */
  /* ---------------------------------------------------------------- */

  const stepContent: Record<number, () => React.ReactNode> = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
    5: renderStep5,
  };

  /* ---------------------------------------------------------------- */
  /*  Can proceed?                                                     */
  /* ---------------------------------------------------------------- */

  const canProceed = useMemo(() => {
    switch (step) {
      case 1:
        return selectedIssues.length > 0;
      case 2:
        return true; // follow-ups are helpful but not blocking
      case 3:
        return true; // photos are optional
      case 4:
        return step4Valid;
      default:
        return false;
    }
  }, [step, selectedIssues, step4Valid]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen flex flex-col bg-gray-light">
      {/* Header */}
      <header className="bg-navy text-white px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold">Book Your Free Inspection</h1>
          <span className="text-sm text-white/70">
            Step {step} of 5
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="w-full"
          >
            <div className="max-w-3xl mx-auto px-4 py-8">
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                {stepContent[step]()}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Buttons */}
      {step < 5 && (
        <div className="border-t border-gray-200 bg-white px-4 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-navy border border-navy hover:bg-navy/5 transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {step === 3 && (
                <button
                  type="button"
                  onClick={goNext}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold text-gray-500 hover:text-navy transition-colors"
                >
                  Skip
                </button>
              )}
              <button
                type="button"
                onClick={step === 4 ? advanceToConfirmation : goNext}
                disabled={!canProceed || submitting}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-colors ${
                  canProceed && !submitting
                    ? "bg-pink hover:bg-pink-dark"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {step === 4
                  ? submitting
                    ? "Submitting..."
                    : "Submit & Confirm"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
