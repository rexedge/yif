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
                charcoal: "#2c2c2c",
                muted: "#7a7062",
              },
            },
          },
        }}
      >
        <Head />
        <Preview>Reset your YIF member portal password.</Preview>
        <Body className="bg-cream font-sans m-0 p-0">
          <Container className="max-w-[600px] mx-auto py-10 px-4">
            <Section className="bg-navy rounded-t-2xl px-8 py-8 text-center">
              <Heading className="text-white font-serif text-3xl font-bold m-0 leading-tight">
                Yoruba Indigenes&apos; Foundation
              </Heading>
              <Text className="text-gold-pale text-sm m-0 mt-1 tracking-widest uppercase">
                Password Reset
              </Text>
            </Section>

            <Section className="bg-white px-8 py-8">
              <Text className="text-navy text-lg font-semibold m-0 mb-2">
                Hi {recipientName || "there"},
              </Text>
              <Text className="text-muted text-sm leading-relaxed m-0 mb-6">
                We received a request to reset the password for the YIF member
                portal account associated with <strong>{recipientEmail}</strong>
                . Click the button below to choose a new password. This link
                will expire in 1 hour.
              </Text>

              <Section className="text-center my-8">
                <Button
                  href={resetUrl}
                  className="bg-gold text-navy-dark font-bold text-sm px-8 py-4 rounded-xl no-underline"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-muted text-xs leading-relaxed m-0 mb-2">
                Or copy and paste this URL into your browser:
              </Text>
              <Text className="text-navy text-xs break-all m-0 mb-6">
                <Link href={resetUrl} className="text-navy underline">
                  {resetUrl}
                </Link>
              </Text>

              <Hr className="border-cream my-6" />

              <Text className="text-muted text-xs leading-relaxed m-0">
                If you didn&apos;t request a password reset, you can safely
                ignore this email — your password won&apos;t change.
              </Text>
            </Section>

            <Section className="bg-navy-dark rounded-b-2xl px-8 py-6 text-center">
              <Text className="text-gold-pale text-xs m-0">
                Yoruba Indigenes&apos; Foundation · UN/ECOSOC Consultative
                Status · CAC IT 28744
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
