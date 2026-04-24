import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ScholarshipApplyPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/dashboard/scholarship");
  } else {
    redirect("/login?redirect=/dashboard/scholarship");
  }
}
