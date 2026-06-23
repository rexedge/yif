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

export interface MembershipWelcomeEmailProps {
  recipientName: string;
  tierName: string;
  membershipNumber: string;
  amountPaid: string;
  expiresAt: string;
  reference: string;
  recipientEmail: string;
  dashboardUrl: string;
}

export default function MembershipWelcomeEmail({
  recipientName,
  tierName,
  membershipNumber,
  amountPaid,
  expiresAt,
  reference,
  recipientEmail,
  dashboardUrl,
}: MembershipWelcomeEmailProps) {
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
          Welcome to YIF, {recipientName}! Your {tierName} membership is now
          active.
        </Preview>
        <Body className="bg-cream font-sans m-0 p-0 py-40">
          <Container className="max-w-600 mx-auto bg-white rounded-16 overflow-hidden">

            {/* Header */}
            <Section className="bg-navy px-40 py-36">
              <Text className="m-0 text-11 font-bold tracking-widest uppercase text-gold">
                Yoruba Indigenes&apos; Foundation
              </Text>
              <Heading className="m-0 mt-10 text-30 font-bold text-white leading-36">
                Welcome to YIF
              </Heading>
              <Text className="m-0 mt-8 text-14 text-gold-pale opacity-80">
                Your {tierName} membership is now active.
              </Text>
            </Section>

            {/* Gold accent bar */}
            <Section className="bg-gold px-40 py-10">
              <Text className="m-0 text-11 font-bold uppercase tracking-widest text-navy-dark">
                Membership Confirmed · UN/ECOSOC Consultative Status
              </Text>
            </Section>

            {/* Greeting */}
            <Section className="px-40 py-32">
              <Text className="m-0 text-17 font-semibold text-navy">
                Congratulations, {recipientName}!
              </Text>
              <Text className="m-0 mt-12 text-15 text-muted leading-26">
                You are now a <strong className="text-navy">{tierName}</strong>{" "}
                member of the Yoruba Indigenes&apos; Foundation — part of a
                growing community committed to heritage, progress, and unity
                across Nigeria and the diaspora.
              </Text>
            </Section>

            {/* Membership card */}
            <Section className="mx-40 mb-0 rounded-12 bg-navy overflow-hidden">
              <Section className="px-24 py-20">
                <Text className="m-0 text-11 font-bold tracking-widest uppercase text-gold mb-16">
                  Member Card
                </Text>
                <table width="100%" cellPadding={0} cellSpacing={0}>
                  <tbody>
                    <tr>
                      <td className="py-8 text-13 text-gold-pale opacity-70">Membership No.</td>
                      <td className="py-8 text-13 font-bold text-white text-right font-mono">{membershipNumber}</td>
                    </tr>
                    <tr>
                      <td className="py-8 text-13 text-gold-pale opacity-70">Tier</td>
                      <td className="py-8 text-13 font-bold text-white text-right">{tierName}</td>
                    </tr>
                    <tr>
                      <td className="py-8 text-13 text-gold-pale opacity-70">Valid Until</td>
                      <td className="py-8 text-13 font-bold text-white text-right">{expiresAt}</td>
                    </tr>
                    <tr>
                      <td className="py-8 text-13 text-gold-pale opacity-70">Amount Paid</td>
                      <td className="py-8 text-13 font-bold text-gold text-right">{amountPaid}</td>
                    </tr>
                  </tbody>
                </table>
              </Section>
              <Section className="bg-navy-dark px-24 py-12">
                <Text className="m-0 text-11 text-gold-pale opacity-50 font-mono">
                  REF: {reference}
                </Text>
              </Section>
            </Section>

            {/* Benefits */}
            <Section className="px-40 pt-28 pb-8">
              <Text className="m-0 mb-16 text-12 font-bold uppercase tracking-widest text-muted">
                Your member benefits
              </Text>
              <table width="100%" cellPadding={0} cellSpacing={0}>
                <tbody>
                  {[
                    "Access to the YIF member portal and exclusive resources",
                    "Priority registration for events, summits, and programmes",
                    "Networking with Yoruba indigenes across Nigeria and the diaspora",
                    "Updates on scholarships, advocacy efforts, and cultural initiatives",
                  ].map((benefit, i) => (
                    <tr key={i}>
                      <td className="w-20 py-6 align-top text-gold text-15 font-bold">✦</td>
                      <td className="py-6 text-14 text-muted leading-20">{benefit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            {/* CTA */}
            <Section className="px-40 py-32 text-center">
              <Button
                href={dashboardUrl}
                className="bg-navy text-white text-15 font-bold px-40 py-16 rounded-10 no-underline box-border"
              >
                Go to Member Portal
              </Button>
            </Section>

            <Hr
              style={{ borderTopColor: "#ede5d4" }}
              className="my-0 mx-40"
            />

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
                Sent to {recipientEmail}. Questions?{" "}
                <Link href="mailto:info@yifww.org" className="text-gold underline">
                  info@yifww.org
                </Link>
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

MembershipWelcomeEmail.PreviewProps = {
  recipientName: "Adewale Okafor",
  tierName: "Fellow",
  membershipNumber: "YIF-2026-0042",
  amountPaid: "NGN 50,000",
  expiresAt: "23 June 2027",
  reference: "cs_live_a19bvKLf",
  recipientEmail: "adewale@example.com",
  dashboardUrl: "https://www.yifww.org/dashboard",
} satisfies MembershipWelcomeEmailProps;
