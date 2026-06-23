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

export interface PasswordResetEmailProps {
  recipientName: string;
  resetUrl: string;
  recipientEmail: string;
}

export default function PasswordResetEmail({
  recipientName,
  resetUrl,
  recipientEmail,
}: PasswordResetEmailProps) {
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
                muted: "#7a7062",
              },
            },
          },
        }}
      >
        <Head />
        <Preview>
          Reset your YIF member portal password — link expires in 1 hour.
        </Preview>
        <Body className="bg-cream font-sans m-0 p-0 py-40">
          <Container className="max-w-600 mx-auto bg-white rounded-16 overflow-hidden">

            {/* Header */}
            <Section className="bg-navy px-40 py-36">
              <Text className="m-0 text-11 font-bold tracking-widest uppercase text-gold">
                Yoruba Indigenes&apos; Foundation
              </Text>
              <Heading className="m-0 mt-10 text-30 font-bold text-white leading-36">
                Password Reset
              </Heading>
              <Text className="m-0 mt-8 text-14 text-gold-pale opacity-80">
                Requested for your member portal account.
              </Text>
            </Section>

            {/* Gold accent bar */}
            <Section className="bg-gold px-40 py-10">
              <Text className="m-0 text-11 font-bold uppercase tracking-widest text-navy-dark">
                Secure Link · Expires in 1 Hour
              </Text>
            </Section>

            {/* Body */}
            <Section className="px-40 py-36">
              <Text className="m-0 text-17 font-semibold text-navy">
                Hi {recipientName || "there"},
              </Text>
              <Text className="m-0 mt-12 text-15 text-muted leading-26">
                We received a request to reset the password on your YIF account
                associated with{" "}
                <strong className="text-navy">{recipientEmail}</strong>. Use
                the button below to choose a new password.
              </Text>
              <Text className="m-0 mt-10 text-14 text-muted leading-22">
                If you did not request this, you can safely ignore this
                email — your password will remain unchanged.
              </Text>
            </Section>

            {/* CTA */}
            <Section className="px-40 pb-36 text-center">
              <Button
                href={resetUrl}
                className="bg-navy text-white text-15 font-bold px-40 py-16 rounded-10 no-underline box-border"
              >
                Reset My Password
              </Button>
            </Section>

            {/* Fallback link box */}
            <Section className="mx-40 mb-36 rounded-10 bg-cream px-24 py-18">
              <Text className="m-0 text-12 font-bold uppercase tracking-widest text-muted mb-8">
                Or copy this link into your browser
              </Text>
              <Text className="m-0 text-12 text-navy break-all leading-18">
                <Link href={resetUrl} className="text-navy underline">
                  {resetUrl}
                </Link>
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-navy-dark px-40 py-28">
              <Text className="m-0 text-12 font-semibold text-gold">
                Yoruba Indigenes&apos; Foundation
              </Text>
              <Text className="m-0 mt-4 text-11 text-gold-pale opacity-60">
                Registration No. IT 28744 · UN/ECOSOC Consultative Status
              </Text>
              <Hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.12)", margin: "16px 0" }} />
              <Text className="m-0 text-11 text-gold-pale opacity-40">
                Sent to {recipientEmail}. For help, contact{" "}
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

PasswordResetEmail.PreviewProps = {
  recipientName: "Adewale Okafor",
  resetUrl: "https://www.yifww.org/reset-password?token=abc123xyz",
  recipientEmail: "adewale@example.com",
} satisfies PasswordResetEmailProps;
