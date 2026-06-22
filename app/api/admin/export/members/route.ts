import { NextResponse } from "next/server";
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

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await prisma.member.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true, country: true } },
      tier: { select: { name: true } },
    },
    orderBy: { joinedAt: "desc" },
  });

  const HEADERS = [
    "Membership No.", "Full Name", "Email", "Phone", "Country",
    "Tier", "Status", "Joined", "Expires",
  ];

  const lines = [
    csvRow(HEADERS),
    ...members.map((m) =>
      csvRow([
        m.membershipNumber ?? "",
        m.user.name ?? "",
        m.user.email,
        m.user.phone ?? "",
        m.user.country ?? "",
        m.tier.name,
        m.status,
        m.joinedAt.toISOString().slice(0, 10),
        m.expiresAt?.toISOString().slice(0, 10) ?? "",
      ]),
    ),
  ];

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="yif-members-${date}.csv"`,
    },
  });
}
