import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://koring-launcher-file-api.lenjing.cloud/launcher/beta/version.json"
  );
  if (!res.ok) {
    return NextResponse.json({ error: `HTTP ${res.status}` }, { status: res.status });
  }
  const data = await res.json();
  return NextResponse.json(data);
}
