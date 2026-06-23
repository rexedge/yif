import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Link,
  Tailwind,
  pixelBasedPreset,
} from "@react-email/components";

export interface DonationThankYouEmailProps {
  recipientName: string;
  cause: string;
  amountDonated: string;
  frequency: string;
  reference: string;
  recipientEmail: string;
  donateUrl: string;
}

const CAUSE_IMPACT: Record<string, string> = {
  "Scholarship Fund":
    "Your gift directly funds the education of Yoruba indigenes pursuing higher learning across Nigeria and the diaspora.",
  "Karo-Ojire Cultural Fund":
    "Your generosity helps preserve, celebrate, and pass on Yoruba cultural heritage to the next generation.",
  "Youth Empowerment":
    "Your contribution equips young Yoruba leaders with the skills, networks, and opportunities they need to thrive.",
  "General Fund":
    "Your donation empowers YIF to respond where the need is greatest — from education and culture to community advocacy.",
};

export default function DonationThankYouEmail({
  recipientName,
  cause,
  amountDonated,
  frequency,
  reference,
  recipientEmail,
  donateUrl,
}: DonationThankYouEmailProps) {
  const impactStatement =
    CAUSE_IMPACT[cause] ??
    "Your generosity strengthens the Yoruba Indigenes' Foundation's mission to empower communities and preserve our shared heritage.";
  const isRecurring = frequency !== "one-time";

  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                navy: "#1a2744",
                "navy-dark": "#111b33",
                gold: "#c9913d",
                "gold-pale": "#f5e6cb",
                cream: "#f5f0e8",
                "cream-dark": "#ede5d4",
                charcoal: "#2c2c2c",
                muted: "#7a7062",
                green: "#2d6a4f",
              },
            },
          },
        }}
      >
        <Head />
        <Preview>
          Thank you for your donation, {recipientName} — Ref: {reference}
        </Preview>
        <Body className="bg-cream font-sans m-0 p-0 py-40">
          <Container className="max-w-600 mx-auto bg-white rounded-16 overflow-hidden">

            {/* Header */}
            <Section className="bg-navy px-40 py-36">
              <Text className="m-0 text-11 font-bold tracking-widest uppercase text-gold">
                Yoruba Indigenes&apos; Foundation
              </Text>
              <Heading className="m-0 mt-10 text-30 font-bold text-white leading-36">
                Thank You
              </Heading>
              <Text className="m-0 mt-8 text-15 text-gold-pale opacity-90">
                Your generosity makes a real difference.
              </Text>
            </Section>

            {/* Gold accent bar */}
            <Section className="bg-gold px-40 py-10">
              <Text className="m-0 text-11 font-bold uppercase tracking-widest text-navy-dark">
                Donation Received · UN/ECOSOC Consultative Status
              </Text>
            </Section>

            {/* Greeting */}
            <Section className="px-40 py-32">
              <Text className="m-0 text-17 font-semibold text-navy">
                Dear {recipientName},
              </Text>
              <Text className="m-0 mt-12 text-15 text-muted leading-26">
                On behalf of the entire YIF family, thank you for your{" "}
                {isRecurring ? "recurring " : ""}
                donation to the <strong className="text-navy">{cause}</strong>.
                Every contribution brings us closer to a stronger, more
                empowered Yoruba community — at home and across the diaspora.
              </Text>
            </Section>

            {/* Impact statement */}
            <Section className="mx-40 mb-0 rounded-12 bg-gold-pale px-28 py-24">
              <Text className="m-0 text-11 font-bold uppercase tracking-widest text-muted mb-10">
                Your Impact
              </Text>
              <Text className="m-0 text-15 text-navy leading-24 italic">
                &ldquo;{impactStatement}&rdquo;
              </Text>
            </Section>

            <Hr
              style={{ borderTopColor: "#ede5d4" }}
              className="my-0 mt-24 mx-40"
            />

            {/* Donation summary */}
            <Section className="px-40 py-24">
              <Text className="m-0 mb-16 text-12 font-bold uppercase tracking-widest text-muted">
                Donation Summary
              </Text>
              <table width="100%" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td className="py-10 border-b border-solid border-cream-dark text-14 text-muted">Cause</td>
                    <td className="py-10 border-b border-solid border-cream-dark text-14 font-semibold text-charcoal text-right">{cause}</td>
                  </tr>
                  <tr>
                    <td className="py-10 border-b border-solid border-cream-dark text-14 text-muted">Frequency</td>
                    <td className="py-10 border-b border-solid border-cream-dark text-14 font-semibold text-charcoal text-right capitalize">{frequency}</td>
                  </tr>
                  <tr>
                    <td className="py-10 border-b border-solid border-cream-dark text-14 text-muted">Email</td>
                    <td className="py-10 border-b border-solid border-cream-dark text-14 font-semibold text-charcoal text-right">{recipientEmail}</td>
                  </tr>
                  <tr>
                    <td className="py-12 text-15 font-bold text-navy">Amount Donated</td>
                    <td className="py-12 text-15 font-bold text-navy text-right">{amountDonated}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Hr
              style={{ borderTopColor: "#ede5d4" }}
              className="my-0 mx-40"
            />

            {/* Reference */}
            <Section className="px-40 py-20 bg-cream">
              <Text className="m-0 text-11 font-bold uppercase tracking-widest text-muted mb-6">
                Transaction Reference
              </Text>
              <Text className="m-0 text-14 font-mono text-navy break-all">
                {reference}
              </Text>
              <Text className="m-0 mt-6 text-12 text-muted">
                Please keep this reference for tax and record purposes.
              </Text>
            </Section>

            {/* Recurring notice */}
            {isRecurring && (
              <>
                <Hr
                  style={{ borderTopColor: "#ede5d4" }}
                  className="my-0 mx-40"
                />
                <Section className="px-40 py-20">
                  <Section className="rounded-10 bg-gold-pale px-20 py-16">
                    <Text className="m-0 text-13 font-semibold text-navy">
                      Recurring Donation Active
                    </Text>
                    <Text className="m-0 mt-6 text-13 text-muted leading-20">
                      Your {frequency} donation is now active. To manage or
                      cancel at any time, contact us at{" "}
                      <Link href="mailto:info@yifww.org" className="text-navy underline">
                        info@yifww.org
                      </Link>
                      .
                    </Text>
                  </Section>
                </Section>
              </>
            )}

            {/* CTA */}
            <Section className="px-40 py-32 text-center">
              <Text className="m-0 mb-20 text-14 text-muted">
                Want to increase your impact further?
              </Text>
              <Button
                href={donateUrl}
                className="bg-navy text-white text-15 font-bold px-40 py-16 rounded-10 no-underline box-border"
              >
                Donate Again
              </Button>
            </Section>

            {/* Footer */}
            <Section className="bg-navy-dark px-40 py-28">
              <Text className="m-0 text-12 font-semibold text-gold">
                Yoruba Indigenes&apos; Foundation
              </Text>
              <Text className="m-0 mt-4 text-11 text-gold-pale opacity-60">
                Registration No. IT 28744 · UN/ECOSOC Consultative Status
              </Text>
              <Hr
                style={{ borderTopColor: "rgba(255,255,255,0.12)" }}
                className="my-16"
              />
              <Text className="m-0 text-11 text-gold-pale opacity-40">
                This is an automated receipt. For enquiries, visit{" "}
                <Link href="https://www.yifww.org/contact" className="text-gold underline">
                  yifww.org/contact
                </Link>
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

DonationThankYouEmail.PreviewProps = {
  recipientName: "Chiamaka Eze",
  cause: "Scholarship Fund",
  amountDonated: "NGN 25,000",
  frequency: "monthly",
  reference: "D2026042301",
  recipientEmail: "chiamaka@example.com",
  donateUrl: "https://www.yifww.org/donate",
} satisfies DonationThankYouEmailProps;
