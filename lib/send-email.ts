import { resend, FROM_EMAIL } from "@/lib/resend";
import TicketConfirmationEmail, {
  type TicketConfirmationEmailProps,
} from "@/emails/TicketConfirmationEmail";
import DonationThankYouEmail, {
  type DonationThankYouEmailProps,
} from "@/emails/DonationThankYouEmail";
import MembershipWelcomeEmail, {
  type MembershipWelcomeEmailProps,
} from "@/emails/MembershipWelcomeEmail";
import MembershipInitializationEmail, {
  type MembershipInitializationEmailProps,
} from "@/emails/MembershipInitializationEmail";
import PasswordResetEmail, {
  type PasswordResetEmailProps,
} from "@/emails/PasswordResetEmail";
import { createElement } from "react";

export type TicketEmailData = Omit<TicketConfirmationEmailProps, never>;
export type DonationEmailData = Omit<DonationThankYouEmailProps, never>;

interface EmailResult {
  success: boolean;
  error?: string;
}

export async function sendTicketConfirmation(
  data: TicketEmailData,
): Promise<EmailResult> {
  try {
    const { error } = await resend.emails.send({
      from: `YIF <${FROM_EMAIL}>`,
      to: [data.recipientEmail],
      subject: `Your Ticket for ${data.eventTitle} — Confirmed`,
      react: createElement(TicketConfirmationEmail, data),
    });

    if (error) {
      console.error("[sendTicketConfirmation] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[sendTicketConfirmation] Unexpected error:", message);
    return { success: false, error: message };
  }
}

export async function sendDonationThankYou(
  data: DonationEmailData,
): Promise<EmailResult> {
  try {
    const { error } = await resend.emails.send({
      from: `YIF <${FROM_EMAIL}>`,
      to: [data.recipientEmail],
      subject: `Thank You for Your Donation to YIF`,
      react: createElement(DonationThankYouEmail, data),
    });

    if (error) {
      console.error("[sendDonationThankYou] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[sendDonationThankYou] Unexpected error:", message);
    return { success: false, error: message };
  }
}

export type MembershipEmailData = Omit<MembershipWelcomeEmailProps, never>;

export async function sendMembershipWelcome(
  data: MembershipEmailData,
): Promise<EmailResult> {
  try {
    const { error } = await resend.emails.send({
      from: `YIF <${FROM_EMAIL}>`,
      to: [data.recipientEmail],
      subject: `Welcome to YIF — Your ${data.tierName} Membership is Active`,
      react: createElement(MembershipWelcomeEmail, data),
    });

    if (error) {
      console.error("[sendMembershipWelcome] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[sendMembershipWelcome] Unexpected error:", message);
    return { success: false, error: message };
  }
}

export type MembershipInitializationEmailData = Omit<
  MembershipInitializationEmailProps,
  never
>;

export async function sendMembershipInitialization(
  data: MembershipInitializationEmailData,
): Promise<EmailResult> {
  try {
    const { error } = await resend.emails.send({
      from: `YIF <${FROM_EMAIL}>`,
      to: [data.recipientEmail],
      subject: `Complete Your YIF ${data.tierName} Membership Payment`,
      react: createElement(MembershipInitializationEmail, data),
    });

    if (error) {
      console.error("[sendMembershipInitialization] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[sendMembershipInitialization] Unexpected error:", message);
    return { success: false, error: message };
  }
}

export type PasswordResetEmailData = Omit<PasswordResetEmailProps, never>;

export async function sendPasswordReset(
  data: PasswordResetEmailData,
): Promise<EmailResult> {
  try {
    const { error } = await resend.emails.send({
      from: `YIF <${FROM_EMAIL}>`,
      to: [data.recipientEmail],
      subject: "Reset Your YIF Member Portal Password",
      react: createElement(PasswordResetEmail, data),
    });

    if (error) {
      console.error("[sendPasswordReset] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[sendPasswordReset] Unexpected error:", message);
    return { success: false, error: message };
  }
}
