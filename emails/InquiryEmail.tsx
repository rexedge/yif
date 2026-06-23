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

export interface InquiryEmailProps {
  type: "Sponsorship" | "Exhibitor";
  organisation: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  country?: string;
  tier?: string;
  message: string;
  /** Extra rows for exhibitor-specific data (booth size, electricity, etc.) */
  extras?: Array<{ label: string; value: string }>;
  submittedAt: string;
}

export default function InquiryEmail({
  type,
  organisation,
  contactName,
  contactEmail,
  contactPhone,
  country,
  tier,
  message,
  extras,
  submittedAt,
}: InquiryEmailProps) {
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
          New {type} inquiry — {organisation} · Yoruba World Day 2026
        </Preview>
        <Body className="bg-cream font-sans m-0 p-0 py-40">
          <Container className="max-w-600 mx-auto bg-white rounded-16 overflow-hidden">

            {/* Header */}
            <Section className="bg-navy px-40 py-32">
              <Text className="m-0 text-11 font-bold tracking-widest uppercase text-gold">
                Yoruba World Day 2026 · Internal Notification
              </Text>
              <Heading className="m-0 mt-10 text-26 font-bold text-white leading-32">
                New {type} Inquiry
              </Heading>
              <Text className="m-0 mt-6 text-14 text-gold-pale opacity-80">
                {organisation}
              </Text>
            </Section>

            {/* Gold accent bar */}
            <Section className="bg-gold px-40 py-10">
              <Text className="m-0 text-11 font-bold uppercase tracking-widest text-navy-dark">
                Submitted {submittedAt}
              </Text>
            </Section>

            {/* Contact details */}
            <Section className="px-40 py-28">
              <Text className="m-0 mb-16 text-12 font-bold uppercase tracking-widest text-muted">
                Contact Details
              </Text>
              <table width="100%" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td className="py-10 border-b border-solid border-cream-dark text-13 text-muted w-160">Organisation</td>
                    <td className="py-10 border-b border-solid border-cream-dark text-13 font-semibold text-navy">{organisation}</td>
                  </tr>
                  <tr>
                    <td className="py-10 border-b border-solid border-cream-dark text-13 text-muted">Contact Name</td>
                    <td className="py-10 border-b border-solid border-cream-dark text-13 font-semibold text-navy">{contactName}</td>
                  </tr>
                  <tr>
                    <td className="py-10 border-b border-solid border-cream-dark text-13 text-muted">Email</td>
                    <td className="py-10 border-b border-solid border-cream-dark text-13 font-semibold text-navy">
                      <Link href={`mailto:${contactEmail}`} className="text-navy underline">
                        {contactEmail}
                      </Link>
                    </td>
                  </tr>
                  {contactPhone && (
                    <tr>
                      <td className="py-10 border-b border-solid border-cream-dark text-13 text-muted">Phone</td>
                      <td className="py-10 border-b border-solid border-cream-dark text-13 font-semibold text-navy">{contactPhone}</td>
                    </tr>
                  )}
                  {country && (
                    <tr>
                      <td className="py-10 border-b border-solid border-cream-dark text-13 text-muted">Country</td>
                      <td className="py-10 border-b border-solid border-cream-dark text-13 font-semibold text-navy">{country}</td>
                    </tr>
                  )}
                  {tier && (
                    <tr>
                      <td className="py-10 border-b border-solid border-cream-dark text-13 text-muted">
                        {type === "Sponsorship" ? "Tier of Interest" : "Booth Tier"}
                      </td>
                      <td className="py-10 border-b border-solid border-cream-dark text-13 font-semibold text-gold">{tier}</td>
                    </tr>
                  )}
                  {extras?.map((e) => (
                    <tr key={e.label}>
                      <td className="py-10 border-b border-solid border-cream-dark text-13 text-muted">{e.label}</td>
                      <td className="py-10 border-b border-solid border-cream-dark text-13 font-semibold text-navy">{e.value}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-10 text-13 text-muted">Inquiry Type</td>
                    <td className="py-10 text-13 font-bold text-navy">{type}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Hr
              style={{ borderTopColor: "#ede5d4" }}
              className="my-0 mx-40"
            />

            {/* Message */}
            <Section className="px-40 py-28">
              <Text className="m-0 mb-12 text-12 font-bold uppercase tracking-widest text-muted">
                Message
              </Text>
              <Section className="rounded-10 bg-cream px-24 py-20">
                <Text className="m-0 text-14 text-charcoal leading-24">
                  {message}
                </Text>
              </Section>
            </Section>

            {/* Reply CTA */}
            <Section className="px-40 pb-32 text-center">
              <Button
                href={`mailto:${contactEmail}?subject=Re: ${type} Inquiry — Yoruba World Day 2026`}
                className="bg-navy text-white text-14 font-bold px-36 py-14 rounded-10 no-underline box-border"
              >
                Reply to {contactName}
              </Button>
            </Section>

            {/* Footer */}
            <Section className="bg-navy-dark px-40 py-24">
              <Text className="m-0 text-12 font-semibold text-gold">
                Yoruba Indigenes&apos; Foundation
              </Text>
              <Text className="m-0 mt-4 text-11 text-gold-pale opacity-60">
                Internal notification · Yoruba World Day 2026
              </Text>
              <Hr
                style={{ borderTopColor: "rgba(255,255,255,0.12)" }}
                className="my-16"
              />
              <Text className="m-0 text-11 text-gold-pale opacity-40">
                Submitted at {submittedAt} via yifww.org
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

InquiryEmail.PreviewProps = {
  type: "Sponsorship",
  organisation: "Lagos Heritage Partners",
  contactName: "Babatunde Fashola",
  contactEmail: "btunde@lagosheritage.ng",
  contactPhone: "+234 801 234 5678",
  country: "Nigeria",
  tier: "Gold Sponsor",
  message:
    "We are deeply interested in sponsoring the Yoruba World Day 2026 event at the Gold tier level. Our organisation has a strong commitment to cultural preservation and we believe this partnership aligns perfectly with our CSR objectives. Please let us know the next steps to formalise our sponsorship agreement.",
  extras: [],
  submittedAt: "23 Jun 2026, 11:42 AM",
} satisfies InquiryEmailProps;
