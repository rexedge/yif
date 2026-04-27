"use server";

import { createElement } from "react";
import { resend, FROM_EMAIL } from "@/lib/resend";
import InquiryEmail from "@/emails/InquiryEmail";
import { YWD_INQUIRY_RECIPIENTS, YWD_EVENT } from "@/lib/yoruba-world-day-2026";

export type ExhibitState = { error?: string; ok?: boolean };

export async function submitExhibitorInquiry(
  _prev: ExhibitState,
  formData: FormData,
): Promise<ExhibitState> {
  const organisation =
    (formData.get("organisation") as string | null)?.trim() ?? "";
  const contactName =
    (formData.get("contactName") as string | null)?.trim() ?? "";
  const contactEmail =
    (formData.get("contactEmail") as string | null)?.trim() ?? "";
  const contactPhone =
    (formData.get("contactPhone") as string | null)?.trim() ?? "";
  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const sector = (formData.get("sector") as string | null)?.trim() ?? "";
  const boothSize = (formData.get("boothSize") as string | null)?.trim() ?? "";
  const electricity = formData.get("electricity") ? "Yes" : "No";
  const products = (formData.get("products") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!organisation) return { error: "Please enter your organisation." };
  if (!contactName) return { error: "Please enter a contact name." };
  if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { error: "Please enter a valid email address." };
  }
  if (!products)
    return {
      error: "Please describe the products or services you'll exhibit.",
    };

  try {
    const { error } = await resend.emails.send({
      from: `YIF <${FROM_EMAIL}>`,
      to: [...YWD_INQUIRY_RECIPIENTS],
      replyTo: contactEmail,
      subject: `Exhibitor Inquiry — ${organisation} — ${YWD_EVENT.title}`,
      react: createElement(InquiryEmail, {
        type: "Exhibitor",
        organisation,
        contactName,
        contactEmail,
        contactPhone: contactPhone || undefined,
        country: country || undefined,
        message: message || "(no additional message)",
        extras: [
          { label: "Sector", value: sector || "—" },
          { label: "Booth size preference", value: boothSize || "—" },
          { label: "Electricity required", value: electricity },
          { label: "Products / Services", value: products },
        ],
        submittedAt: new Date().toISOString(),
      }),
    });
    if (error) {
      console.error("[submitExhibitorInquiry] Resend error:", error);
      return { error: "We couldn't send your inquiry. Please try again." };
    }
  } catch (err) {
    console.error("[submitExhibitorInquiry] Unexpected:", err);
    return { error: "Unexpected error. Please email sponsorship@yifww.org." };
  }

  return { ok: true };
}
