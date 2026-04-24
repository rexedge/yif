"use server";

import {
  paystackRequest,
  toKobo,
  type TransactionInitData,
} from "@/lib/paystack";
import { recordTransactionInit } from "@/lib/transactions";
import { prisma } from "@/lib/prisma";

export type CheckoutState = {
  error?: string;
};

export async function checkoutTickets(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const tierId = (formData.get("tierId") as string | null) ?? "";
  const qty = parseInt((formData.get("qty") as string | null) ?? "1", 10);
  const slug = (formData.get("slug") as string | null) ?? "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!name) {
    return { error: "Please enter your full name." };
  }
  if (qty < 1 || qty > 10) {
    return { error: "Quantity must be between 1 and 10." };
  }

  const event = await prisma.event.findUnique({
    where: { slug },
    include: { tiers: true },
  });
  if (!event) return { error: "Event not found." };

  const tier = event.tiers.find((t) => t.id === tierId);
  if (!tier) return { error: "Invalid ticket tier." };

  const totalNaira = Number(tier.price) * qty;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const result = await paystackRequest<TransactionInitData>(
      "/transaction/initialize",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          amount: toKobo(totalNaira).toString(),
          callback_url: `${appUrl}/payment/callback`,
          metadata: {
            cancel_action: `${appUrl}/events/${slug}`,
            custom_fields: [
              {
                display_name: "Full Name",
                variable_name: "full_name",
                value: name,
              },
              {
                display_name: "Event",
                variable_name: "event_title",
                value: event.title,
              },
              {
                display_name: "Ticket Tier",
                variable_name: "tier_name",
                value: tier.name,
              },
              {
                display_name: "Quantity",
                variable_name: "quantity",
                value: qty.toString(),
              },
            ],
          },
        }),
      },
    );

    await recordTransactionInit({
      reference: result.data.reference,
      purpose: "TICKET",
      amountNaira: totalNaira,
      customerEmail: email,
      customerName: name,
      metadata: {
        eventSlug: slug,
        eventTitle: event.title,
        tierId: tier.id,
        tierName: tier.name,
        quantity: qty,
      },
    }).catch((err) =>
      console.error("[checkoutTickets] tx init record failed:", err),
    );

    // Redirect to Paystack authorization URL
    const { redirect } = await import("next/navigation");
    redirect(result.data.authorization_url);
  } catch (err: unknown) {
    if (
      err !== null &&
      typeof err === "object" &&
      "message" in err &&
      typeof (err as { message: unknown }).message === "string" &&
      (err as { message: string }).message.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    const msg =
      err instanceof Error
        ? err.message
        : "Payment initialisation failed. Please try again.";
    return { error: msg };
  }
  // redirect() throws, so this is unreachable — satisfies TypeScript's return-type check
  return {};
}
