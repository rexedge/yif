import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
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
                terracotta: "#c0553a",
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
        <Body className="bg-cream font-sans py-40">
          <Container className="max-w-600 mx-auto bg-white rounded-16 overflow-hidden">
            {/* Header */}
            <Section className="bg-navy px-40 py-32">
              <Text className="m-0 text-14 font-semibold tracking-widest uppercase text-gold">
                Yoruba Indigenes&apos; Foundation
              </Text>
              <Heading className="m-0 mt-8 text-28 font-bold text-white">
                Thank You ❤️
              </Heading>
              <Text className="m-0 mt-8 text-15 text-white opacity-80">
                Your generosity makes a real difference.
              </Text>
            </Section>

            {/* Gold accent bar */}
            <Section className="bg-gold px-40 py-12">
              <Text className="m-0 text-13 font-semibold text-navy-dark uppercase tracking-wider">
                Donation Received · UN/ECOSOC Consultative Status
              </Text>
            </Section>

            {/* Greeting */}
            <Section className="px-40 py-32">
              <Text className="m-0 text-16 text-charcoal">
                Dear {recipientName},
              </Text>
              <Text className="mt-16 mb-0 text-16 text-charcoal leading-24">
                On behalf of the entire YIF family, thank you for your{" "}
                {isRecurring ? "recurring " : ""}donation to the{" "}
                <strong>{cause}</strong>. Every contribution brings us closer to
                a stronger, more empowered Yoruba community — both at home and
                across the diaspora.
              </Text>
            </Section>

            {/* Impact statement */}
            <Section className="mx-40 my-0 rounded-12 bg-gold-pale px-32 py-24">
              <Text className="m-0 text-12 font-semibold uppercase tracking-widest text-muted mb-8">
                Your Impact
              </Text>
              <Text className="m-0 text-15 text-navy leading-22 italic">
                &ldquo;{impactStatement}&rdquo;
              </Text>
            </Section>

            <Hr className="border-none border-t border-solid border-cream-dark mx-40 my-0 mt-24" />

            {/* Donation summary */}
            <Section className="px-40 py-24">
              <Text className="m-0 mb-16 text-13 font-semibold uppercase tracking-widest text-muted">
                Donation Summary
              </Text>
              <Row className="mb-8">
                <Column>
                  <Text className="m-0 text-14 text-muted">Cause</Text>
                </Column>
                <Column>
                  <Text className="m-0 text-14 font-semibold text-charcoal text-right">
                    {cause}
                  </Text>
                </Column>
              </Row>
              <Row className="mb-8">
                <Column>
                  <Text className="m-0 text-14 text-muted">Frequency</Text>
                </Column>
                <Column>
                  <Text className="m-0 text-14 font-semibold text-charcoal text-right capitalize">
                    {frequency}
                  </Text>
                </Column>
              </Row>
              <Row className="mb-8">
                <Column>
                  <Text className="m-0 text-14 text-muted">Email</Text>
                </Column>
                <Column>
                  <Text className="m-0 text-14 font-semibold text-charcoal text-right">
                    {recipientEmail}
                  </Text>
                </Column>
              </Row>
              <Hr className="border-none border-t border-solid border-cream-dark my-12" />
              <Row>
                <Column>
                  <Text className="m-0 text-15 font-bold text-navy">
                    Amount Donated
                  </Text>
                </Column>
                <Column>
                  <Text className="m-0 text-15 font-bold text-navy text-right">
                    {amountDonated}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-none border-t border-solid border-cream-dark mx-40 my-0" />

            {/* Reference */}
            <Section className="px-40 py-20 bg-cream">
              <Text className="m-0 text-12 font-semibold uppercase tracking-widest text-muted mb-4">
                Transaction Reference
              </Text>
              <Text className="m-0 text-14 font-mono text-navy break-all">
                {reference}
              </Text>
              <Text className="m-0 mt-8 text-12 text-muted">
                Please keep this reference for tax and record purposes.
              </Text>
            </Section>

            {/* Recurring notice */}
            {isRecurring && (
              <Section className="mx-40 my-0 mt-24 rounded-8 border-none border-l border-solid bg-gold-pale px-20 py-16">
                <Text className="m-0 text-13 font-semibold text-navy">
                  Recurring Donation Active
                </Text>
                <Text className="m-0 mt-4 text-13 text-muted">
                  Your {frequency} donation is now active. You can manage or
                  cancel it at any time by contacting us.
                </Text>
              </Section>
            )}

            {/* CTA */}
            <Section className="px-40 py-32 text-center">
              <Text className="m-0 mb-20 text-14 text-muted">
                Want to increase your impact further?
              </Text>
              <Link
                href={donateUrl}
                className="inline-block rounded-8 bg-navy px-32 py-14 text-14 font-semibold text-white no-underline box-border"
              >
                Donate Again
              </Link>
            </Section>

            {/* Footer */}
            <Section className="bg-navy px-40 py-24">
              <Text className="m-0 text-12 text-gold font-semibold">
                Yoruba Indigenes&apos; Foundation
              </Text>
              <Text className="m-0 mt-4 text-11 text-white opacity-70">
                Registration No. IT 28744 · UN/ECOSOC Consultative Status
              </Text>
              <Text className="m-0 mt-12 text-11 text-white opacity-50">
                This is an automated receipt. Please do not reply to this email.
                For enquiries, visit yif.org/contact.
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
