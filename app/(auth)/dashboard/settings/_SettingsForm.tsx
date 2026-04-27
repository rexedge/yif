"use client";

import { useEffect, useState, useTransition } from "react";
import { updateProfile, updateNotifications } from "./actions";

type CountryOption = { name: string; continent: string };

type NotifKey =
  | "notifEventInvites"
  | "notifNewsletter"
  | "notifDonationReceipts"
  | "notifMemberUpdates"
  | "notifScholarshipNews";

const NOTIF_ITEMS: {
  key: NotifKey;
  label: string;
  description: string;
}[] = [
  {
    key: "notifEventInvites",
    label: "Event Invitations",
    description:
      "Receive invites to YIF events, galas, and cultural gatherings.",
  },
  {
    key: "notifNewsletter",
    label: "Monthly Newsletter",
    description:
      "Monthly digest of YIF news, Programs, and community highlights.",
  },
  {
    key: "notifDonationReceipts",
    label: "Donation Receipts",
    description: "Email confirmation whenever a donation is processed.",
  },
  {
    key: "notifMemberUpdates",
    label: "Membership Reminders",
    description:
      "Reminders about upcoming membership renewals and tier changes.",
  },
  {
    key: "notifScholarshipNews",
    label: "Scholarship Announcements",
    description:
      "Updates on scholarship cycles, deadlines, and award announcements.",
  },
];

export type SettingsUser = {
  name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  continent: string | null;
  country: string | null;
  stateProvince: string | null;
  cityDistrict: string | null;
  bio: string | null;
  notifEventInvites: boolean;
  notifNewsletter: boolean;
  notifDonationReceipts: boolean;
  notifMemberUpdates: boolean;
  notifScholarshipNews: boolean;
};

export function SettingsForm({ user }: { user: SettingsUser }) {
  const [profile, setProfile] = useState({
    name: user.name ?? "",
    email: user.email,
    phone: user.phone ?? "",
    gender: user.gender ?? "",
    continent: user.continent ?? "",
    country: user.country ?? "",
    stateProvince: user.stateProvince ?? "",
    cityDistrict: user.cityDistrict ?? "",
    bio: user.bio ?? "",
  });

  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>({
    notifEventInvites: user.notifEventInvites,
    notifNewsletter: user.notifNewsletter,
    notifDonationReceipts: user.notifDonationReceipts,
    notifMemberUpdates: user.notifMemberUpdates,
    notifScholarshipNews: user.notifScholarshipNews,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [profileMsg, setProfileMsg] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);
  const [notifMsg, setNotifMsg] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const [isPendingProfile, startProfile] = useTransition();
  const [isPendingNotif, startNotif] = useTransition();

  // Cascading location dropdowns (sourced from /api/locations/*)
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [countryContinent, setCountryContinent] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/locations/countries")
      .then((r) => r.json())
      .then((list: CountryOption[]) => {
        if (cancelled) return;
        setCountries(list);
        setCountryContinent(
          Object.fromEntries(list.map((c) => [c.name, c.continent])),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!profile.country) {
      setStates([]);
      return;
    }
    let cancelled = false;
    fetch(
      `/api/locations/states?country=${encodeURIComponent(profile.country)}`,
    )
      .then((r) => r.json())
      .then((list: string[]) => {
        if (!cancelled) setStates(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [profile.country]);

  useEffect(() => {
    if (!profile.country || !profile.stateProvince) {
      setCities([]);
      return;
    }
    let cancelled = false;
    fetch(
      `/api/locations/cities?country=${encodeURIComponent(profile.country)}&state=${encodeURIComponent(profile.stateProvince)}`,
    )
      .then((r) => r.json())
      .then((list: string[]) => {
        if (!cancelled) setCities(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [profile.country, profile.stateProvince]);

  const saveProfile = () => {
    startProfile(async () => {
      const res = await updateProfile({
        name: profile.name,
        phone: profile.phone,
        gender: profile.gender,
        continent: profile.continent,
        country: profile.country,
        stateProvince: profile.stateProvince,
        cityDistrict: profile.cityDistrict,
        bio: profile.bio,
      });
      setProfileMsg(
        res.success
          ? { ok: true, text: "Profile saved" }
          : { ok: false, text: res.error ?? "Failed to save" },
      );
      setTimeout(() => setProfileMsg(null), 3000);
    });
  };

  const saveNotifs = () => {
    startNotif(async () => {
      const res = await updateNotifications(notifs);
      setNotifMsg(
        res.success
          ? { ok: true, text: "Preferences saved" }
          : { ok: false, text: res.error ?? "Failed to save" },
      );
      setTimeout(() => setNotifMsg(null), 3000);
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile */}
      <Section title="Profile Information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            value={profile.name}
            onChange={(v) => setProfile((p) => ({ ...p, name: v }))}
          />
          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            onChange={() => {}}
            disabled
          />
          <Input
            label="Phone Number"
            type="tel"
            value={profile.phone}
            onChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
            placeholder="+1 234 567 8901"
          />
          <div>
            <label className="block text-xs text-white/60 mb-1.5 font-medium uppercase tracking-wide">
              Gender
            </label>
            <select
              value={profile.gender}
              onChange={(e) =>
                setProfile((p) => ({ ...p, gender: e.target.value }))
              }
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--yif-gold)]/50 transition-colors"
            >
              <option value="" className="bg-[var(--yif-navy-dark)]">
                Select gender
              </option>
              {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
                <option key={g} value={g} className="bg-[var(--yif-navy-dark)]">
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5 font-medium uppercase tracking-wide">
              Country
            </label>
            <select
              value={profile.country}
              onChange={(e) => {
                const country = e.target.value;
                const continent = countryContinent[country] ?? "";
                setProfile((p) => ({
                  ...p,
                  country,
                  continent,
                  stateProvince: "",
                  cityDistrict: "",
                }));
              }}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--yif-gold)]/50 transition-colors"
            >
              <option value="" className="bg-[var(--yif-navy-dark)]">
                {countries.length === 0 ? "Loading…" : "Select country"}
              </option>
              {countries.map((c) => (
                <option
                  key={c.name}
                  value={c.name}
                  className="bg-[var(--yif-navy-dark)]"
                >
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5 font-medium uppercase tracking-wide">
              Continent
            </label>
            <div className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white/50 min-h-[42px]">
              {profile.continent || (
                <span className="text-white/25">Auto-filled from country</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5 font-medium uppercase tracking-wide">
              State / Province
            </label>
            <select
              value={profile.stateProvince}
              disabled={!profile.country || states.length === 0}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  stateProvince: e.target.value,
                  cityDistrict: "",
                }))
              }
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--yif-gold)]/50 transition-colors disabled:opacity-50"
            >
              <option value="" className="bg-[var(--yif-navy-dark)]">
                {!profile.country
                  ? "Select country first"
                  : states.length === 0
                    ? "No states available"
                    : "Select state / province"}
              </option>
              {states.map((s) => (
                <option key={s} value={s} className="bg-[var(--yif-navy-dark)]">
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5 font-medium uppercase tracking-wide">
              City / District
            </label>
            <select
              value={profile.cityDistrict}
              disabled={!profile.stateProvince || cities.length === 0}
              onChange={(e) =>
                setProfile((p) => ({ ...p, cityDistrict: e.target.value }))
              }
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--yif-gold)]/50 transition-colors disabled:opacity-50"
            >
              <option value="" className="bg-[var(--yif-navy-dark)]">
                {!profile.stateProvince
                  ? "Select state first"
                  : cities.length === 0
                    ? "No cities available"
                    : "Select city / district"}
              </option>
              {cities.map((c) => (
                <option key={c} value={c} className="bg-[var(--yif-navy-dark)]">
                  {c}
                </option>
              ))}
            </select>
          </div>
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
              maxLength={500}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-[var(--yif-gold)]/50 transition-colors resize-none"
            />
          </div>
        </div>
        <StatusButton
          onClick={saveProfile}
          loading={isPendingProfile}
          message={profileMsg}
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
        <StatusButton
          onClick={saveNotifs}
          loading={isPendingNotif}
          message={notifMsg}
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
        <div className="mt-5">
          <button
            disabled={
              !passwords.current ||
              !passwords.next ||
              passwords.next !== passwords.confirm
            }
            className="rounded-lg bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] text-sm px-5 py-2.5 font-semibold hover:bg-[var(--yif-gold-light)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Update Password
          </button>
        </div>
      </Section>

      {/* Danger Zone */}
      <Section title="Danger Zone">
        <div className="rounded-xl bg-[var(--yif-terracotta)]/8 border border-[var(--yif-terracotta)]/20 px-4 py-4">
          <p className="text-sm font-semibold text-[var(--yif-terracotta)] mb-1">
            Delete Account
          </p>
          <p className="text-xs text-white/50 leading-relaxed mb-4">
            Permanently remove your membership record, donation history, and all
            associated data. This action cannot be undone.
          </p>
          <button className="rounded-lg border border-[var(--yif-terracotta)]/40 text-[var(--yif-terracotta)] text-sm px-4 py-2 font-medium hover:bg-[var(--yif-terracotta)]/15 transition-colors">
            Delete my account
          </button>
        </div>
      </Section>
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
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
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
        disabled={disabled}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-[var(--yif-gold)]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function StatusButton({
  onClick,
  loading,
  message,
  label,
}: {
  onClick: () => void;
  loading: boolean;
  message: { ok: boolean; text: string } | null;
  label: string;
}) {
  return (
    <div className="mt-5 flex items-center gap-3">
      <button
        onClick={onClick}
        disabled={loading}
        className="rounded-lg bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] text-sm px-5 py-2.5 font-semibold hover:bg-[var(--yif-gold-light)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Saving…" : label}
      </button>
      {message && (
        <span
          className={`text-sm font-medium ${message.ok ? "text-[var(--yif-green)]" : "text-[var(--yif-terracotta)]"}`}
        >
          {message.ok ? "✓" : "✗"} {message.text}
        </span>
      )}
    </div>
  );
}
