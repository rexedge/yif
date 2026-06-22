import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function escapeCsv(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function csvRow(values: unknown[]): string {
  return values.map(escapeCsv).join(",");
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") ?? undefined;
  const purpose = searchParams.get("purpose") ?? undefined;
  const currency = searchParams.get("currency") ?? undefined;
  const provider = searchParams.get("provider") ?? undefined;
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined;
  const to = searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined;

  const rows = await prisma.transaction.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(purpose ? { purpose: purpose as never } : {}),
      ...(currency ? { currency } : {}),
      ...(provider ? { provider } : {}),
      ...((from || to) ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    },
    select: {
      id: true,
      reference: true,
      purpose: true,
      status: true,
      amount: true,
      currency: true,
      baseAmount: true,
      fxRate: true,
      provider: true,
      channel: true,
      cardBrand: true,
      cardLast4: true,
      fees: true,
      netAmount: true,
      customerEmail: true,
      customerName: true,
      customerPhone: true,
      gatewayResponse: true,
      notes: true,
      paidAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const HEADERS = [
    "ID", "Reference", "Purpose", "Status", "Amount", "Currency",
    "Amount (NGN equiv)", "FX Rate (NGN per unit)",
    "Provider", "Channel", "Card Brand", "Card Last 4", "Fees", "Net Amount",
    "Customer Email", "Customer Name", "Customer Phone",
    "Gateway Response", "Notes", "Paid At", "Created At",
  ];

  const lines = [
    csvRow(HEADERS),
    ...rows.map((r) =>
      csvRow([
        r.id,
        r.reference,
        r.purpose,
        r.status,
        r.amount,
        r.currency,
        r.baseAmount ?? "",
        r.fxRate ?? "",
        r.provider,
        r.channel,
        r.cardBrand,
        r.cardLast4,
        r.fees,
        r.netAmount,
        r.customerEmail,
        r.customerName,
        r.customerPhone,
        r.gatewayResponse,
        r.notes,
        r.paidAt?.toISOString() ?? "",
        r.createdAt.toISOString(),
      ]),
    ),
  ];

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="yif-transactions-${date}.csv"`,
    },
  });
}
