import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | YIF — Yoruba Indigenes' Foundation",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--yif-cream)]">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-2">
          Legal
        </p>
        <h1 className="font-display text-4xl font-semibold text-[var(--yif-navy)] mb-2">
          Terms of Use
        </h1>
        <p className="text-sm text-[var(--yif-navy)]/40 mb-10">
          Last updated: April 2026
        </p>

        <div className="prose prose-slate max-w-none space-y-8 text-[var(--yif-navy)]/70">
          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              1. Organisation
            </h2>
            <p>
              These Terms of Use govern your use of the Yoruba Indigenes&apos;
              Foundation (&quot;YIF&quot;, &quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;) website located at yifworldwide.org. YIF is a
              registered non-governmental organisation with Registration Number{" "}
              <strong>IT 28744</strong>, headquartered at 33A, Bode Thomas
              Street, Surulere, Lagos State, Nigeria.
            </p>
            <p className="mt-2">
              YIF holds <strong>UN/ECOSOC Special Consultative Status</strong>{" "}
              (granted 2019).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              2. Acceptance of Terms
            </h2>
            <p>
              By accessing or using this website, you agree to be bound by these
              Terms of Use and our Privacy Policy. If you do not agree, please
              discontinue use of the site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              3. Membership
            </h2>
            <p>
              Membership in YIF is open to Yoruba indigenes and friends of the
              Yoruba people worldwide. Registration fees are ₦5,000.00 (or
              $14.00 / £11.00) with an annual stipend of ₦2,500.00, $10.00, or
              £10.00 per head. Membership tiers include Gold (₦10,000), Silver
              (₦5,000), Platinum (₦20,000), and Diamond (₦15,000).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              4. User Conduct
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Use the site for any unlawful purpose</li>
              <li>Impersonate any person or entity</li>
              <li>Upload harmful, offensive, or infringing content</li>
              <li>
                Attempt to gain unauthorised access to any part of the platform
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              5. Intellectual Property
            </h2>
            <p>
              All content on this site — including the YIF name, logo, and
              publications — is the property of Yoruba Indigenes&apos;
              Foundation and may not be reproduced without written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              6. Payments
            </h2>
            <p>
              All payments on this platform are processed securely via Paystack.
              YIF does not store your payment card details. Refund requests
              should be directed to info@yifworldwide.org within 14 days of the
              transaction.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              YIF provides this website &quot;as is&quot; without warranties of
              any kind. We shall not be liable for any indirect, incidental, or
              consequential damages arising from your use of the site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              8. Changes to Terms
            </h2>
            <p>
              We reserve the right to update these terms at any time. Continued
              use of the site after changes constitutes your acceptance of the
              revised terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-3">
              9. Contact
            </h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a
                href="mailto:info@yifworldwide.org"
                className="text-[var(--yif-gold)] hover:underline"
              >
                info@yifworldwide.org
              </a>{" "}
              or write to: 33A, Bode Thomas Street, Surulere, Lagos State,
              Nigeria.
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
