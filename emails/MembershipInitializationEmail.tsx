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

export interface MembershipInitializationEmailProps {
  recipientName: string;
  tierName: string;
  amountNaira: string;
  reference: string;
  paymentUrl: string;
  recipientEmail: string;
}

export default function MembershipInitializationEmail({
  recipientName,
  tierName,
  amountNaira,
  reference,
  paymentUrl,
  recipientEmail,
}: MembershipInitializationEmailProps) {
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
              },
            },
          },
        }}
      >
        <Head />
        <Preview>
          One step left — complete your {tierName} membership payment to join
          YIF.
        </Preview>
        <Body className="bg-cream font-sans m-0 p-0 py-40">
          <Container className="max-w-600 mx-auto bg-white rounded-16 overflow-hidden">

            {/* Header */}
            <Section className="bg-navy px-40 py-36">
              <Text className="m-0 text-11 font-bold tracking-widest uppercase text-gold">
                Yoruba Indigenes&apos; Foundation
              </Text>
              <Heading className="m-0 mt-10 text-30 font-bold text-white leading-36">
                Complete Your Membership
              </Heading>
              <Text className="m-0 mt-8 text-14 text-gold-pale opacity-80">
                Your application has been received.
              </Text>
            </Section>

            {/* Gold accent bar */}
            <Section className="bg-gold px-40 py-10">
              <Text className="m-0 text-11 font-bold uppercase tracking-widest text-navy-dark">
                Action Required · Secure Payment
              </Text>
            </Section>

            {/* Greeting */}
            <Section className="px-40 py-32">
              <Text className="m-0 text-17 font-semibold text-navy">
                Hi {recipientName},
              </Text>
              <Text className="m-0 mt-12 text-15 text-muted leading-26">
                Your <strong className="text-navy">{tierName}</strong>{" "}
                membership application is ready. Finalise your payment of{" "}
                <strong className="text-navy">{amountNaira}</strong> to gain
                full access to the YIF member portal and community.
              </Text>
            </Section>

            {/* Application summary card */}
            <Section className="mx-40 mb-0 rounded-12 bg-cream overflow-hidden">
              <table width="100%" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td className="px-24 py-12 border-b border-solid border-cream-dark text-13 text-muted">
                      Membership Tier
                    </td>
                    <td className="px-24 py-12 border-b border-solid border-cream-dark text-13 font-bold text-navy text-right">
                      {tierName}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-24 py-12 border-b border-solid border-cream-dark text-13 text-muted">
                      Amount Due
                    </td>
                    <td className="px-24 py-12 border-b border-solid border-cream-dark text-13 font-bold text-navy text-right">
                      {amountNaira}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-24 py-12 border-b border-solid border-cream-dark text-13 text-muted">
                      Reference
                    </td>
                    <td className="px-24 py-12 border-b border-solid border-cream-dark text-12 font-mono text-navy text-right">
                      {reference}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-24 py-12 text-13 text-muted">
                      Status
                    </td>
                    <td className="px-24 py-12 text-13 font-bold text-gold text-right">
                      Pending Payment
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* CTA */}
            <Section className="px-40 py-36 text-center">
              <Button
                href={paymentUrl}
                className="bg-gold text-navy-dark text-15 font-bold px-40 py-16 rounded-10 no-underline box-border"
              >
                Complete Payment Now
              </Button>
              <Text className="m-0 mt-14 text-12 text-muted">
                Secure payment · Your details are encrypted
              </Text>
            </Section>

            <Hr
              style={{ borderTopColor: "#ede5d4" }}
              className="my-0 mx-40"
            />

            {/* What happens next */}
            <Section className="px-40 py-28">
              <Text className="m-0 mb-16 text-12 font-bold uppercase tracking-widest text-muted">
                What happens next
              </Text>
              <table width="100%" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td className="w-28 py-8 align-top text-13 font-bold text-gold">1.</td>
                    <td className="py-8 text-13 text-muted leading-20">Complete your payment on the secure checkout page.</td>
                  </tr>
                  <tr>
                    <td className="w-28 py-8 align-top text-13 font-bold text-gold">2.</td>
                    <td className="py-8 text-13 text-muted leading-20">Your membership activates automatically within seconds.</td>
                  </tr>
                  <tr>
                    <td className="w-28 py-8 align-top text-13 font-bold text-gold">3.</td>
                    <td className="py-8 text-13 text-muted leading-20">You&apos;ll receive a welcome email with your membership card and portal access.</td>
                  </tr>
                </tbody>
              </table>
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
                Sent to {recipientEmail}. Did not apply?{" "}
                <Link href="mailto:info@yifww.org" className="text-gold underline">
                  Contact us
                </Link>
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

MembershipInitializationEmail.PreviewProps = {
  recipientName: "Chiamaka Eze",
  tierName: "Fellow",
  amountNaira: "NGN 50,000",
  reference: "YIF-MEM-2026-004821",
  paymentUrl: "https://www.yifww.org/membership/pay?ref=YIF-MEM-2026-004821",
  recipientEmail: "chiamaka@example.com",
} satisfies MembershipInitializationEmailProps;
