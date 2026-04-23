"use client";

import { useState } from "react";

const STEPS = [
  { id: 1, title: "Personal Info" },
  { id: 2, title: "Academic Info" },
  { id: 3, title: "Essay" },
  { id: 4, title: "Review & Submit" },
];

type FormData = {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  stateOfOrigin: string;
  lga: string;
  address: string;
  // Step 2
  school: string;
  degree: string;
  field: string;
  year: string;
  gpa: string;
  sponsorName: string;
  sponsorRelation: string;
  // Step 3
  essay1: string;
  essay2: string;
  // Step 4 — no extra fields
};

const INITIAL: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  stateOfOrigin: "",
  lga: "",
  address: "",
  school: "",
  degree: "",
  field: "",
  year: "",
  gpa: "",
  sponsorName: "",
  sponsorRelation: "",
  essay1: "",
  essay2: "",
};

const STATES = ["Ekiti", "Lagos", "Ogun", "Ondo", "Osun", "Oyo", "Diaspora"];

const DEGREES = [
  "B.Sc.",
  "B.A.",
  "B.Tech.",
  "B.Eng.",
  "M.Sc.",
  "M.A.",
  "MBA",
  "Ph.D.",
  "Other",
];
const YEARS = [
  "100 Level",
  "200 Level",
  "300 Level",
  "400 Level",
  "500 Level",
  "Postgraduate Year 1",
  "Postgraduate Year 2",
];

export default function ScholarshipPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const set =
    (field: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--yif-navy-dark)] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--yif-green)]/20 border border-[var(--yif-green)]/40 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-[var(--yif-green)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-2">
            Application Submitted
          </p>
          <h2 className="font-display text-3xl font-semibold text-white mb-4">
            Ẹ dupe, {form.firstName}!
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            Your scholarship application has been received. Our committee will
            review your submission and respond via email within 4–6 weeks. Your
            reference number is{" "}
            <strong className="text-white font-mono">
              YIF-SCH-2026-{Math.floor(Math.random() * 9000) + 1000}
            </strong>
            .
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setForm(INITIAL);
            }}
            className="text-sm text-[var(--yif-gold)] hover:underline"
          >
            Start a new application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-1">
          Member Portal
        </p>
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Scholarship Application
        </h1>
        <p className="mt-1 text-white/50 text-sm">
          YIF Annual Academic Excellence Scholarship — 2026 Cycle
        </p>
      </div>

      {/* Progress stepper */}
      <div className="flex items-center gap-0 mb-10 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                  step > s.id
                    ? "bg-[var(--yif-green)] border-[var(--yif-green)] text-white"
                    : step === s.id
                      ? "bg-[var(--yif-gold)] border-[var(--yif-gold)] text-[var(--yif-navy-dark)]"
                      : "bg-transparent border-white/20 text-white/30"
                }`}
              >
                {step > s.id ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  s.id
                )}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                  step === s.id
                    ? "text-[var(--yif-gold)]"
                    : step > s.id
                      ? "text-[var(--yif-green)]"
                      : "text-white/30"
                }`}
              >
                {s.title}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 mb-5 transition-all ${step > s.id ? "bg-[var(--yif-green)]" : "bg-white/10"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="max-w-2xl rounded-2xl bg-white/5 border border-white/10 px-6 py-7 sm:px-8">
        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-white mb-6">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="First Name"
                value={form.firstName}
                onChange={set("firstName")}
                placeholder="Adewale"
                required
              />
              <Field
                label="Last Name"
                value={form.lastName}
                onChange={set("lastName")}
                placeholder="Okafor"
                required
              />
              <Field
                label="Email Address"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="adewale@example.com"
                required
              />
              <Field
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+234 800 000 0000"
              />
              <Field
                label="Date of Birth"
                type="date"
                value={form.dateOfBirth}
                onChange={set("dateOfBirth")}
                required
              />
              <SelectField
                label="State of Origin"
                value={form.stateOfOrigin}
                onChange={set("stateOfOrigin")}
                options={STATES}
                placeholder="Select state"
                required
              />
              <Field
                label="LGA"
                value={form.lga}
                onChange={set("lga")}
                placeholder="Ibadan North"
              />
              <div className="sm:col-span-2">
                <Field
                  label="Residential Address"
                  value={form.address}
                  onChange={set("address")}
                  placeholder="House No, Street, City, State"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-white mb-6">
              Academic Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  label="Institution Name"
                  value={form.school}
                  onChange={set("school")}
                  placeholder="University of Ibadan"
                  required
                />
              </div>
              <SelectField
                label="Degree"
                value={form.degree}
                onChange={set("degree")}
                options={DEGREES}
                placeholder="Select degree"
                required
              />
              <Field
                label="Field of Study"
                value={form.field}
                onChange={set("field")}
                placeholder="Computer Science"
                required
              />
              <SelectField
                label="Current Year"
                value={form.year}
                onChange={set("year")}
                options={YEARS}
                placeholder="Select year"
                required
              />
              <Field
                label="Current CGPA"
                value={form.gpa}
                onChange={set("gpa")}
                placeholder="4.50 / 5.00"
                required
              />
              <Field
                label="Name of Sponsor / Guardian"
                value={form.sponsorName}
                onChange={set("sponsorName")}
                placeholder="Full name"
              />
              <Field
                label="Sponsor Relationship"
                value={form.sponsorRelation}
                onChange={set("sponsorRelation")}
                placeholder="Parent, Sibling, etc."
              />
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-white mb-2">
              Personal Essays
            </h2>
            <p className="text-xs text-white/40 mb-6">
              Each essay should be 300–500 words. Write clearly and
              authentically in your own voice.
            </p>
            <div className="space-y-6">
              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium uppercase tracking-wide">
                  Essay 1 — Personal Journey (required)
                </label>
                <p className="text-xs text-white/35 mb-2">
                  Describe your background, challenges you have overcome, and
                  why you are pursuing this field of study.
                </p>
                <textarea
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[var(--yif-gold)]/50 transition-colors resize-none"
                  rows={7}
                  placeholder="Write your personal journey essay here…"
                  value={form.essay1}
                  onChange={set("essay1")}
                />
                <p className="text-xs text-white/25 mt-1 text-right">
                  {form.essay1.split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium uppercase tracking-wide">
                  Essay 2 — Community Impact (required)
                </label>
                <p className="text-xs text-white/35 mb-2">
                  How do you plan to use your education to serve the Yoruba
                  community and broader Nigerian society?
                </p>
                <textarea
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[var(--yif-gold)]/50 transition-colors resize-none"
                  rows={7}
                  placeholder="Write your community impact essay here…"
                  value={form.essay2}
                  onChange={set("essay2")}
                />
                <p className="text-xs text-white/25 mt-1 text-right">
                  {form.essay2.split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Review */}
        {step === 4 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-white mb-6">
              Review & Submit
            </h2>
            <div className="space-y-5">
              <ReviewSection title="Personal Information">
                <ReviewRow
                  label="Name"
                  value={`${form.firstName} ${form.lastName}`}
                />
                <ReviewRow label="Email" value={form.email} />
                <ReviewRow label="Phone" value={form.phone || "—"} />
                <ReviewRow
                  label="Date of Birth"
                  value={form.dateOfBirth || "—"}
                />
                <ReviewRow label="State" value={form.stateOfOrigin || "—"} />
                <ReviewRow label="LGA" value={form.lga || "—"} />
              </ReviewSection>
              <ReviewSection title="Academic Information">
                <ReviewRow label="Institution" value={form.school} />
                <ReviewRow
                  label="Degree"
                  value={`${form.degree} ${form.field}`}
                />
                <ReviewRow label="Year" value={form.year} />
                <ReviewRow label="CGPA" value={form.gpa} />
              </ReviewSection>
              <ReviewSection title="Essays">
                <ReviewRow
                  label="Essay 1"
                  value={
                    form.essay1
                      ? `${form.essay1.split(/\s+/).filter(Boolean).length} words`
                      : "Not written"
                  }
                />
                <ReviewRow
                  label="Essay 2"
                  value={
                    form.essay2
                      ? `${form.essay2.split(/\s+/).filter(Boolean).length} words`
                      : "Not written"
                  }
                />
              </ReviewSection>
            </div>
            <div className="mt-6 rounded-xl bg-[var(--yif-gold)]/8 border border-[var(--yif-gold)]/20 px-4 py-3 text-xs text-white/60 leading-relaxed">
              By submitting this application, I confirm that all information
              provided is accurate and complete. I understand that false
              information will disqualify my application.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <button
            onClick={back}
            className={`rounded-lg border border-white/20 text-white text-sm px-5 py-2.5 font-medium transition-colors hover:bg-white/10 ${step === 1 ? "invisible" : ""}`}
          >
            ← Back
          </button>
          {step < 4 ? (
            <button
              onClick={next}
              className="rounded-lg bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] text-sm px-6 py-2.5 font-semibold hover:bg-[var(--yif-gold-light)] transition-colors ml-auto"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={() => setSubmitted(true)}
              className="rounded-lg bg-[var(--yif-green)] text-white text-sm px-6 py-2.5 font-semibold hover:opacity-90 transition-opacity ml-auto"
            >
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-white/60 mb-1.5 font-medium uppercase tracking-wide">
        {label}
        {required && (
          <span className="text-[var(--yif-terracotta)] ml-1">*</span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-[var(--yif-gold)]/50 transition-colors"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: string[];
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-white/60 mb-1.5 font-medium uppercase tracking-wide">
        {label}
        {required && (
          <span className="text-[var(--yif-terracotta)] ml-1">*</span>
        )}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--yif-gold)]/50 transition-colors appearance-none"
      >
        <option value="" className="bg-[var(--yif-navy)]">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[var(--yif-navy)]">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-4">
      <p className="text-xs font-semibold text-[var(--yif-gold)] uppercase tracking-wider mb-3">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 text-sm">
      <span className="text-white/40 w-28 shrink-0">{label}</span>
      <span className="text-white/80">{value || "—"}</span>
    </div>
  );
}
