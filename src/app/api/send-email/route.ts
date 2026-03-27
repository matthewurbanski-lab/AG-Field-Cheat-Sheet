import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// ---------------------------------------------------------------------------
// POST /api/send-email  — Send a follow-up email to a lead
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, message } = body;

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "to, subject, and message are required." },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Convert plain text message to simple HTML
    const htmlMessage = message
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br/>");

    await resend.emails.send({
      from: "AquaGuard Inspections <noreply@mattataquaguard.com>",
      to,
      subject,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <tr>
    <td style="background:#1B3A6B;padding:24px 32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">AquaGuard</h1>
      <p style="margin:4px 0 0;color:#93c5fd;font-size:12px;">Foundation Solutions</p>
    </td>
  </tr>
  <tr>
    <td style="padding:32px;">
      <p style="margin:0;color:#374151;font-size:15px;line-height:1.7;">${htmlMessage}</p>
    </td>
  </tr>
  <tr>
    <td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;">
      <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#1B3A6B;">Matthew Urbanski</p>
      <p style="margin:0;font-size:13px;color:#6b7280;">Certified Field Inspector | AquaGuard Foundation Solutions</p>
      <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">(470) 568-1681 &bull; mattataquaguard.com</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/send-email error:", err);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
