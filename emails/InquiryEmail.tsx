import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
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

export default function InquiryEmail(props: InquiryEmailProps) {
  const {
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
  } = props;

  return (
    <Html>
      <Head />
      <Preview>
        New {type} inquiry for Yoruba World Day 2026 — {organisation}
      </Preview>
      <Body
        style={{
          backgroundColor: "#f6f4ee",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "24px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e8e4d6",
          }}
        >
          <Section style={{ backgroundColor: "#0d1a3a", padding: "24px 32px" }}>
            <Text
              style={{
                color: "#d4af37",
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Yoruba World Day 2026
            </Text>
            <Heading
              style={{ color: "#ffffff", fontSize: "22px", margin: "8px 0 0" }}
            >
              New {type} Inquiry
            </Heading>
          </Section>

          <Section style={{ padding: "24px 32px" }}>
            <Text style={{ fontSize: "14px", color: "#3a3a3a", margin: 0 }}>
              <strong>Organisation:</strong> {organisation}
            </Text>
            <Text
              style={{ fontSize: "14px", color: "#3a3a3a", margin: "8px 0 0" }}
            >
              <strong>Contact:</strong> {contactName}
            </Text>
            <Text
              style={{ fontSize: "14px", color: "#3a3a3a", margin: "8px 0 0" }}
            >
              <strong>Email:</strong> {contactEmail}
            </Text>
            {contactPhone && (
              <Text
                style={{
                  fontSize: "14px",
                  color: "#3a3a3a",
                  margin: "8px 0 0",
                }}
              >
                <strong>Phone:</strong> {contactPhone}
              </Text>
            )}
            {country && (
              <Text
                style={{
                  fontSize: "14px",
                  color: "#3a3a3a",
                  margin: "8px 0 0",
                }}
              >
                <strong>Country:</strong> {country}
              </Text>
            )}
            {tier && (
              <Text
                style={{
                  fontSize: "14px",
                  color: "#3a3a3a",
                  margin: "8px 0 0",
                }}
              >
                <strong>
                  {type === "Sponsorship" ? "Tier of interest" : "Booth tier"}:
                </strong>{" "}
                {tier}
              </Text>
            )}

            {extras?.map((e) => (
              <Text
                key={e.label}
                style={{
                  fontSize: "14px",
                  color: "#3a3a3a",
                  margin: "8px 0 0",
                }}
              >
                <strong>{e.label}:</strong> {e.value}
              </Text>
            ))}

            <Hr style={{ borderColor: "#e8e4d6", margin: "20px 0" }} />

            <Text
              style={{
                fontSize: "12px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#0d1a3a",
                margin: 0,
              }}
            >
              Message
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: "#3a3a3a",
                margin: "6px 0 0",
                whiteSpace: "pre-wrap",
              }}
            >
              {message}
            </Text>

            <Hr style={{ borderColor: "#e8e4d6", margin: "20px 0" }} />
            <Text style={{ fontSize: "12px", color: "#888", margin: 0 }}>
              Submitted at {submittedAt}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
