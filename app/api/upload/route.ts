import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { dataUri?: string; folder?: string };
  if (!body.dataUri || !body.dataUri.startsWith("data:")) {
    return NextResponse.json({ error: "Invalid data URI" }, { status: 400 });
  }

  const url = await uploadImage(body.dataUri, body.folder ?? "yif/uploads");
  return NextResponse.json({ url });
}
