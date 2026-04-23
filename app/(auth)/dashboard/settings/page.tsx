"use client";

import { useState } from "react";

type NotifKey =
  | "eventInvites"
  | "newsletter"
  | "donationReceipts"
  | "memberUpdates"
  | "scholarshipNews";

type NotifState = Record<NotifKey, boolean>;

const NOTIF_ITEMS: { key: NotifKey; label: string; description: string }[] = [
  {
    key: "eventInvites",
    label: "Event Invitations",
    description:
      "Receive invites to YIF events, galas, and cultural gatherings.",
  },
  {
    key: "newsletter",
    label: "Monthly Newsletter",
    description:
      "Monthly digest of YIF news, programmes, and community highlights.",
  },
  {
    key: "donationReceipts",
    label: "Donation Receipts",
    description: "Email confirmation whenever a donation is processed.",
  },
  {
    key: "memberUpdates",
    label: "Membership Reminders",
    description:
      "Reminders about upcoming membership renewals and tier changes.",
  },
  {
    key: "scholarshipNews",
    label: "Scholarship Announcements",
    description:
      "Updates on scholarship cycles, deadlines, and award announcements.",
  },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "Adewale",
    lastName: "Okafor",
    email: "adewale.okafor@example.com",
    phone: "+234 812 345 6789",
    state: "Lagos",
    lga: "Ikeja",
    bio: "Software engineer, YIF member since 2022. Proud Yoruba heritage advocate.",
  });

  const [notifs, setNotifs] = useState<NotifState>({
    eventInvites: true,
    newsletter: true,
    donationReceipts: true,
    memberUpdates: false,
    scholarshipNews: true,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [profileSaved, setProfileSaved] = useState(false);
  const [passSaved, setPassSaved] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  const saveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };
  const savePass = () => {
    setPassSaved(true);
    setPasswords({ current: "", next: "", confirm: "" });
    setTimeout(() => setPassSaved(false), 2500);
  };
  const saveNotifs = () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-1">
          Member Portal
        </p>
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Settings
        </h1>
        <p className="mt-1 text-white/50 text-sm">
          Manage your profile, notifications, and account security.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <Section title="Profile Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="First Name"
              value={profile.firstName}
              onChange={(v) => setProfile((p) => ({ ...p, firstName: v }))}
            />
            <Input
              label="Last Name"
              value={profile.lastName}
              onChange={(v) => setProfile((p) => ({ ...p, lastName: v }))}
            />
            <Input
              label="Email Address"
              type="email"
              value={profile.email}
              onChange={(v) => setProfile((p) => ({ ...p, email: v }))}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={profile.phone}
              onChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
            />
            <Input
              label="State of Origin"
              value={profile.state}
              onChange={(v) => setProfile((p) => ({ ...p, state: v }))}
            />
            <Input
              label="LGA"
              value={profile.lga}
              onChange={(v) => setProfile((p) => ({ ...p, lga: v }))}
            />
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/60 mb-1.5 font-medium uppercase tracking-wide">
                Short Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, bio: e.target.value }))
                }
                rows={3}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-[var(--yif-gold)]/50 transition-colors resize-none"
              />
            </div>
          </div>
          <SaveButton
            onClick={saveProfile}
            saved={profileSaved}
            label="Save Profile"
          />
        </Section>

        {/* Notifications */}
        <Section title="Notification Preferences">
          <div className="space-y-3">
            {NOTIF_ITEMS.map((item) => (
              <div
                key={item.key}
                className="flex items-start justify-between gap-4"
              >
                <div>
                  <p className="text-sm text-white/80 font-medium">
                    {item.label}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {item.description}
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={notifs[item.key]}
                  onClick={() =>
                    setNotifs((p) => ({ ...p, [item.key]: !p[item.key] }))
                  }
                  className={`relative shrink-0 mt-0.5 w-11 h-6 rounded-full transition-colors border ${
                    notifs[item.key]
                      ? "bg-[var(--yif-gold)] border-[var(--yif-gold)]"
                      : "bg-white/10 border-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      notifs[item.key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <SaveButton
            onClick={saveNotifs}
            saved={notifSaved}
            label="Save Preferences"
          />
        </Section>

        {/* Password */}
        <Section title="Change Password">
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwords.current}
              onChange={(v) => setPasswords((p) => ({ ...p, current: v }))}
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              type="password"
              value={passwords.next}
              onChange={(v) => setPasswords((p) => ({ ...p, next: v }))}
              placeholder="At least 8 characters"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwords.confirm}
              onChange={(v) => setPasswords((p) => ({ ...p, confirm: v }))}
              placeholder="Repeat new password"
            />
          </div>
          <SaveButton
            onClick={savePass}
            saved={passSaved}
            label="Update Password"
            disabled={
              !passwords.current ||
              !passwords.next ||
              passwords.next !== passwords.confirm
            }
          />
        </Section>

        {/* Danger Zone */}
        <Section title="Danger Zone">
          <div className="rounded-xl bg-[var(--yif-terracotta)]/8 border border-[var(--yif-terracotta)]/20 px-4 py-4">
            <p className="text-sm font-semibold text-[var(--yif-terracotta)] mb-1">
              Delete Account
            </p>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              Permanently remove your membership record, donation history, and
              all associated data. This action cannot be undone. Your membership
              will be cancelled immediately.
            </p>
            <button className="rounded-lg border border-[var(--yif-terracotta)]/40 text-[var(--yif-terracotta)] text-sm px-4 py-2 font-medium hover:bg-[var(--yif-terracotta)]/15 transition-colors">
              Delete my account
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 px-6 py-6">
      <h2 className="font-display text-lg font-semibold text-white mb-5">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-white/60 mb-1.5 font-medium uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-[var(--yif-gold)]/50 transition-colors"
      />
    </div>
  );
}

function SaveButton({
  onClick,
  saved,
  label,
  disabled,
}: {
  onClick: () => void;
  saved: boolean;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-5 flex items-center gap-3">
      <button
        onClick={onClick}
        disabled={disabled}
        className="rounded-lg bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] text-sm px-5 py-2.5 font-semibold hover:bg-[var(--yif-gold-light)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {label}
      </button>
      {saved && (
        <span className="text-sm text-[var(--yif-green)] font-medium animate-fade-in">
          ✓ Saved
        </span>
      )}
    </div>
  );
}
