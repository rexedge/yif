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
        <Body className="bg-cream font-sans m-0 p-0 py-40">
          <Container className="max-w-600 mx-auto bg-white rounded-16 overflow-hidden">

            {/* Header */}
            <Section className="bg-navy px-40 py-36">
              <Text className="m-0 text-11 font-bold tracking-widest uppercase text-gold">
                Yoruba Indigenes&apos; Foundation
              </Text>
              <Heading className="m-0 mt-10 text-30 font-bold text-white leading-36">
                Ticket Confirmed
              </Heading>
              <Text className="m-0 mt-8 text-14 text-gold-pale opacity-80">
                {eventTitle}
              </Text>
            </Section>

            {/* Gold accent bar */}
            <Section className="bg-gold px-40 py-10">
              <Text className="m-0 text-11 font-bold uppercase tracking-widest text-navy-dark">
                Payment Successful · UN/ECOSOC Consultative Status
              </Text>
            </Section>

            {/* Greeting */}
            <Section className="px-40 py-32">
              <Text className="m-0 text-17 font-semibold text-navy">
                Dear {recipientName},
              </Text>
              <Text className="m-0 mt-12 text-15 text-muted leading-26">
                Your registration for{" "}
                <strong className="text-navy">{eventTitle}</strong> is
                confirmed. We look forward to seeing you there.
              </Text>
            </Section>

            {/* Event details card */}
            <Section className="mx-40 mb-0 rounded-12 bg-navy overflow-hidden">
              <Section className="px-28 py-24">
                <Text className="m-0 text-11 font-bold tracking-widest uppercase text-gold mb-16">
                  Event Details
                </Text>
                <table width="100%" cellPadding={0} cellSpacing={0}>
                  <tbody>
                    <tr>
                      <td className="w-28 py-10 align-top text-18">📅</td>
                      <td className="py-10 pl-12">
                        <Text className="m-0 text-15 font-semibold text-white">{eventDate}</Text>
                        <Text className="m-0 mt-2 text-13 text-gold-pale opacity-70">{eventTime}</Text>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-28 py-10 align-top text-18">📍</td>
                      <td className="py-10 pl-12">
                        <Text className="m-0 text-15 font-semibold text-white">{eventLocation}</Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>
            </Section>

            <Hr
              style={{ borderTopColor: "#ede5d4" }}
              className="my-0 mt-24 mx-40"
            />

            {/* Booking summary */}
            <Section className="px-40 py-24">
              <Text className="m-0 mb-16 text-12 font-bold uppercase tracking-widest text-muted">
                Booking Summary
              </Text>
              <table width="100%" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td className="py-10 border-b border-solid border-cream-dark text-14 text-muted">Ticket Type</td>
                    <td className="py-10 border-b border-solid border-cream-dark text-14 font-semibold text-charcoal text-right">{tierName}</td>
                  </tr>
                  <tr>
                    <td className="py-10 border-b border-solid border-cream-dark text-14 text-muted">Quantity</td>
                    <td className="py-10 border-b border-solid border-cream-dark text-14 font-semibold text-charcoal text-right">{quantity}</td>
                  </tr>
                  <tr>
                    <td className="py-10 border-b border-solid border-cream-dark text-14 text-muted">Registered Email</td>
                    <td className="py-10 border-b border-solid border-cream-dark text-14 font-semibold text-charcoal text-right">{recipientEmail}</td>
                  </tr>
                  <tr>
                    <td className="py-12 text-15 font-bold text-navy">Total Paid</td>
                    <td className="py-12 text-15 font-bold text-navy text-right">{amountPaid}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Hr
              style={{ borderTopColor: "#ede5d4" }}
              className="my-0 mx-40"
            />

            {/* Reference */}
            <Section className="px-40 py-20 bg-gold-pale">
              <Text className="m-0 text-11 font-bold uppercase tracking-widest text-muted mb-6">
                Reference Number
              </Text>
              <Text className="m-0 text-14 font-mono text-navy break-all">
                {reference}
              </Text>
              <Text className="m-0 mt-6 text-12 text-muted">
                Please save this reference for entry and records.
              </Text>
            </Section>

            {/* CTA */}
            <Section className="px-40 py-32 text-center">
              <Button
                href={eventsUrl}
                className="bg-navy text-white text-15 font-bold px-40 py-16 rounded-10 no-underline box-border"
              >
                View All Events
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
                This is an automated confirmation. For enquiries, contact{" "}
                <Link href="mailto:events@yifww.org" className="text-gold underline">
                  events@yifww.org
                </Link>
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
