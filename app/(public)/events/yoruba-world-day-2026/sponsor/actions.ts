"use server";

import { createElement } from "react";
import { resend, FROM_EMAIL } from "@/lib/resend";
import InquiryEmail from "@/emails/InquiryEmail";
import {
  YWD_INQUIRY_RECIPIENTS,
  YWD_SPONSORSHIP_TIERS,
  YWD_EVENT,
} from "@/lib/yoruba-world-day-2026";

export type SponsorState = { error?: string; ok?: boolean };

export async function submitSponsorshipInquiry(
  _prev: SponsorState,
  formData: FormData,
): Promise<SponsorState> {
  const organisation =
    (formData.get("organisation") as string | null)?.trim() ?? "";
  const contactName =
    (formData.get("contactName") as string | null)?.trim() ?? "";
  const contactEmail =
    (formData.get("contactEmail") as string | null)?.trim() ?? "";
  const contactPhone =
    (formData.get("contactPhone") as string | null)?.trim() ?? "";
  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const tier = (formData.get("tier") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!organisation) return { error: "Please enter your organisation." };
  if (!contactName) return { error: "Please enter a contact name." };
  if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { error: "Please enter a valid email address." };
  }
  if (!message) return { error: "Please add a short message." };
  if (tier && !YWD_SPONSORSHIP_TIERS.some((t) => t.name === tier)) {
    return { error: "Please choose a valid sponsorship tier." };
  }

  try {
    const { error } = await resend.emails.send({
      from: `YIF <${FROM_EMAIL}>`,
      to: [...YWD_INQUIRY_RECIPIENTS],
      replyTo: contactEmail,
      subject: `Sponsorship Inquiry — ${organisation} — ${YWD_EVENT.title}`,
      react: createElement(InquiryEmail, {
        type: "Sponsorship",
        organisation,
        contactName,
        contactEmail,
        contactPhone: contactPhone || undefined,
        country: country || undefined,
        tier: tier || undefined,
        message,
        submittedAt: new Date().toISOString(),
      }),
    });
    if (error) {
      console.error("[submitSponsorshipInquiry] Resend error:", error);
      return { error: "We couldn't send your inquiry. Please try again." };
    }
  } catch (err) {
    console.error("[submitSponsorshipInquiry] Unexpected:", err);
    return { error: "Unexpected error. Please email sponsorship@yifww.org." };
  }

  return { ok: true };
}
