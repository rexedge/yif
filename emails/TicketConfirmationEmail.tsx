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

export interface TicketConfirmationEmailProps {
  recipientName: string;
  eventTitle: string;
  tierName: string;
  quantity: number;
  amountPaid: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  reference: string;
  recipientEmail: string;
  eventsUrl: string;
}

export default function TicketConfirmationEmail({
  recipientName,
  eventTitle,
  tierName,
  quantity,
  amountPaid,
  eventDate,
  eventTime,
  eventLocation,
  reference,
  recipientEmail,
  eventsUrl,
}: TicketConfirmationEmailProps) {
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
          Your ticket for {eventTitle} is confirmed — Ref: {reference}
        </Preview>
        <Body className="bg-cream font-sans py-40">
          <Container className="max-w-600 mx-auto bg-white rounded-16 overflow-hidden">
            {/* Header */}
            <Section className="bg-navy px-40 py-32">
              <Text className="m-0 text-14 font-semibold tracking-widest uppercase text-gold">
                Yoruba Indigenes&apos; Foundation
              </Text>
              <Heading className="m-0 mt-8 text-28 font-bold text-white">
                Ticket Confirmed ✓
              </Heading>
            </Section>

            {/* Gold accent bar */}
            <Section className="bg-gold px-40 py-12">
              <Text className="m-0 text-13 font-semibold text-navy-dark uppercase tracking-wider">
                Payment Successful · UN/ECOSOC Consultative Status
              </Text>
            </Section>

            {/* Body */}
            <Section className="px-40 py-32">
              <Text className="m-0 text-16 text-charcoal">
                Dear {recipientName},
              </Text>
              <Text className="mt-16 mb-0 text-16 text-charcoal leading-24">
                Thank you for registering! Your ticket for{" "}
                <strong>{eventTitle}</strong> has been confirmed. We look
                forward to seeing you there.
              </Text>
            </Section>

            <Hr className="border-none border-t border-solid border-cream-dark mx-40 my-0" />

            {/* Event details */}
            <Section className="px-40 py-24 bg-cream rounded-0">
              <Text className="m-0 mb-16 text-13 font-semibold uppercase tracking-widest text-muted">
                Event Details
              </Text>
              <Row className="mb-12">
                <Column className="w-24 pr-12">
                  <Text className="m-0 text-16">📅</Text>
                </Column>
                <Column>
                  <Text className="m-0 text-15 font-semibold text-navy">
                    {eventDate}
                  </Text>
                  <Text className="m-0 text-13 text-muted">{eventTime}</Text>
                </Column>
              </Row>
              <Row>
                <Column className="w-24 pr-12">
                  <Text className="m-0 text-16">📍</Text>
                </Column>
                <Column>
                  <Text className="m-0 text-15 font-semibold text-navy">
                    {eventLocation}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-none border-t border-solid border-cream-dark mx-40 my-0" />

            {/* Ticket summary */}
            <Section className="px-40 py-24">
              <Text className="m-0 mb-16 text-13 font-semibold uppercase tracking-widest text-muted">
                Booking Summary
              </Text>
              <Row className="mb-8">
                <Column>
                  <Text className="m-0 text-14 text-muted">Ticket Type</Text>
                </Column>
                <Column>
                  <Text className="m-0 text-14 font-semibold text-charcoal text-right">
                    {tierName}
                  </Text>
                </Column>
              </Row>
              <Row className="mb-8">
                <Column>
                  <Text className="m-0 text-14 text-muted">Quantity</Text>
                </Column>
                <Column>
                  <Text className="m-0 text-14 font-semibold text-charcoal text-right">
                    {quantity}
                  </Text>
                </Column>
              </Row>
              <Row className="mb-8">
                <Column>
                  <Text className="m-0 text-14 text-muted">
                    Registered Email
                  </Text>
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
                    Total Paid
                  </Text>
                </Column>
                <Column>
                  <Text className="m-0 text-15 font-bold text-navy text-right">
                    {amountPaid}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-none border-t border-solid border-cream-dark mx-40 my-0" />

            {/* Reference */}
            <Section className="px-40 py-20 bg-gold-pale">
              <Text className="m-0 text-12 font-semibold uppercase tracking-widest text-muted mb-4">
                Reference Number
              </Text>
              <Text className="m-0 text-14 font-mono text-navy break-all">
                {reference}
              </Text>
              <Text className="m-0 mt-8 text-12 text-muted">
                Please save this reference for your records.
              </Text>
            </Section>

            {/* CTA */}
            <Section className="px-40 py-32 text-center">
              <Link
                href={eventsUrl}
                className="inline-block rounded-8 bg-navy px-32 py-14 text-14 font-semibold text-white no-underline box-border"
              >
                View All Events
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
                This is an automated confirmation. Please do not reply to this
                email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

TicketConfirmationEmail.PreviewProps = {
  recipientName: "Adewale Okafor",
  eventTitle: "Karo-Ojire Annual Cultural Festival 2026",
  tierName: "General Admission",
  quantity: 2,
  amountPaid: "NGN 20,000",
  eventDate: "Saturday, 15 August 2026",
  eventTime: "10:00 AM – 6:00 PM WAT",
  eventLocation: "Eko Convention Centre, Lagos",
  reference: "T202608150001",
  recipientEmail: "adewale@example.com",
  eventsUrl: "https://www.yifww.org/events",
} satisfies TicketConfirmationEmailProps;
