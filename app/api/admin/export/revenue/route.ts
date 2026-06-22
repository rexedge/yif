import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getRevenueSummary, getTopDonationCauses, type Period } from "@/lib/reporting";

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

const VALID_PERIODS = ["7d", "30d", "90d", "1y", "all"] as const;

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const periodRaw = req.nextUrl.searchParams.get("period") ?? "30d";
  const period: Period = VALID_PERIODS.includes(periodRaw as Period)
    ? (periodRaw as Period)
    : "30d";

  const [summary, causes] = await Promise.all([
    getRevenueSummary(period),
    getTopDonationCauses(period),
  ]);

  const lines: string[] = [];

  lines.push(csvRow(["Section", "Category", "Total (USD)", "Count"]));

  for (const p of summary.totalByPurpose) {
    lines.push(csvRow(["Revenue by Purpose", p.purpose, p.total, p.count]));
  }

  lines.push(
    csvRow(["Failed/Abandoned", "All", summary.failedTotal, summary.failedCount]),
  );

  lines.push(csvRow([]));
  lines.push(csvRow(["Top Donation Causes", "Total (USD)", "Transactions"]));
  for (const cause of causes) {
    lines.push(csvRow([cause.cause, cause.total, cause.count]));
  }

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="yif-revenue-summary-${date}.csv"`,
    },
  });
}
