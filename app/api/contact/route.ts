import { NextResponse } from "next/server";

const SHEET_URL = process.env.NEXT_PUBLIC_CONTACT_SHEET_URL || "";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!SHEET_URL) {
      return NextResponse.json(
        { success: false, message: "NEXT_PUBLIC_CONTACT_SHEET_URL is not set." },
        { status: 500 }
      );
    }

    const response = await fetch(SHEET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: text || "Google Sheets request failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Contact saved successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
