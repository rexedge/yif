import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | YIF — Yoruba Indigenes' Foundation",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--yif-cream)]">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-2">
          Legal
        </p>
        <h1 className="font-display text-4xl font-semibold text-[var(--yif-navy)] mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-[var(--yif-navy)]/40 mb-10">
          Last updated: April 2026
        </p>

        <div className="prose prose-slate max-w-none space-y-8 text-[var(--yif-navy)]/70">
          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              1. Who We Are
            </h2>
            <p>
              Yoruba Indigenes&apos; Foundation (&quot;YIF&quot;) is a
              registered NGO (Reg. No. <strong>IT 28744</strong>) at 33A, Bode
              Thomas Street, Surulere, Lagos, Nigeria. This Privacy Policy
              explains how we collect, use, and protect your personal
              information when you use yifworldwide.org.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>
                <strong>Account data:</strong> name, email address, phone
                number, country, state of origin when you register.
              </li>
              <li>
                <strong>Payment data:</strong> transaction reference numbers
                processed via Paystack. We do not store card numbers.
              </li>
              <li>
                <strong>Usage data:</strong> pages visited, browser type, IP
                address (anonymised where possible).
              </li>
              <li>
                <strong>Membership data:</strong> tier, join date, scholarship
                applications submitted.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>
                To manage your membership and provide access to YIF services
              </li>
              <li>
                To process payments via Paystack in compliance with their
                privacy policy
              </li>
              <li>
                To send transactional emails (e.g., receipts, invitations) via
                Resend
              </li>
              <li>To communicate Program updates and event invitations</li>
              <li>
                To comply with legal obligations under Nigerian law and NDPR
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              4. Paystack Data Handling
            </h2>
            <p>
              Payments are processed by Paystack Technology Limited. When you
              make a payment, you are subject to{" "}
              <a
                href="https://paystack.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--yif-gold)] hover:underline"
              >
                Paystack&apos;s Privacy Policy
              </a>
              . YIF receives only a transaction reference and status — never
              your card details.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              5. Your Rights (GDPR &amp; NDPR)
            </h2>
            <p>Under GDPR and Nigeria&apos;s NDPR, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>
                <strong>Access:</strong> request a copy of your personal data
              </li>
              <li>
                <strong>Rectification:</strong> correct inaccurate personal data
              </li>
              <li>
                <strong>Erasure:</strong> request deletion of your data
                (&quot;right to be forgotten&quot;)
              </li>
              <li>
                <strong>Portability:</strong> receive your data in a portable
                format
              </li>
              <li>
                <strong>Objection:</strong> object to processing for direct
                marketing
              </li>
              <li>
                <strong>Withdraw consent:</strong> at any time, where processing
                is consent-based
              </li>
            </ul>
            <p className="mt-3">
              To exercise any right, email us at{" "}
              <a
                href="mailto:info@yifworldwide.org"
                className="text-[var(--yif-gold)] hover:underline"
              >
                info@yifworldwide.org
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              6. Data Retention
            </h2>
            <p>
              We retain your personal data for as long as your membership is
              active, plus a further 5 years for legal and audit purposes. You
              may request earlier deletion subject to our legal obligations.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              7. Cookies
            </h2>
            <p>
              We use strictly necessary cookies for authentication (session
              tokens). We do not use third-party advertising cookies. You may
              disable cookies in your browser settings, though this may affect
              site functionality.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              8. Contact
            </h2>
            <p>
              Data Controller: Yoruba Indigenes&apos; Foundation
              <br />
              33A, Bode Thomas Street, Surulere, Lagos, Nigeria
              <br />
              Email:{" "}
              <a
                href="mailto:info@yifworldwide.org"
                className="text-[var(--yif-gold)] hover:underline"
              >
                info@yifworldwide.org
              </a>
            </p>
          </section>
        </div>

        <p className="text-xs text-[var(--yif-navy)]/25 mt-12">
          Registration No. IT 28744 · UN/ECOSOC Special Consultative Status
          (2019)
        </p>
      </div>
    </div>
  );
}
