import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../lib/supabase";
import {
  calculateLeadScore,
  getScoreLabel,
  LeadAnswers,
} from "../../lib/scoring";
import { Resend } from "resend";

// ---------------------------------------------------------------------------
// POST /api/leads  — Create a new lead
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      zip,
      issues,
      answers,
      appointmentDate,
      appointmentTime,
      source,
      notes,
    } = body;

    // --- Validate required fields -------------------------------------------
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "First name, last name, email, and phone are required." },
        { status: 400 }
      );
    }

    // --- Calculate lead score -----------------------------------------------
    const leadAnswers: LeadAnswers = {
      issues: issues ?? [],
      waterEntry: answers?.waterEntry,
      waterFrequency: answers?.waterFrequency,
      visibleMold: answers?.visibleMold,
      crackType: answers?.crackType,
      stickingDoorsWindows: answers?.stickingDoorsWindows,
      wallBowing: answers?.wallBowing,
      priorRepairs: answers?.priorRepairs,
      mustySmell: answers?.mustySmell,
      saggingFloors: answers?.saggingFloors,
      crawlMoisture: answers?.crawlMoisture,
      existingVaporBarrier: answers?.existingVaporBarrier,
      concreteLocation: answers?.concreteLocation,
      affectedArea: answers?.affectedArea,
      tripHazard: answers?.tripHazard,
      timeline: answers?.timeline,
      source: source ?? answers?.source,
      notes: notes ?? answers?.notes,
      photosUploaded: answers?.photosUploaded ?? false,
    };

    const score = calculateLeadScore(leadAnswers);
    const scoreInfo = getScoreLabel(score);

    // --- Insert lead into Supabase ------------------------------------------
    const supabase = getSupabaseAdmin();

    const { data: lead, error: insertError } = await supabase
      .from("leads")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address: address ?? null,
        city: city ?? null,
        zip: zip ?? null,
        issues: issues ?? [],
        answers: answers ?? {},
        appointment_date: appointmentDate ?? null,
        appointment_time: appointmentTime ?? null,
        source: source ?? null,
        notes: notes ?? null,
        score,
        status: "New",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create lead." },
        { status: 500 }
      );
    }

    // --- Book the time slot if appointment provided -------------------------
    if (appointmentDate && appointmentTime) {
      const { error: slotError } = await supabase
        .from("time_slots")
        .update({ is_booked: true })
        .eq("date", appointmentDate)
        .eq("start_time", appointmentTime);

      if (slotError) {
        console.error("Time slot booking error:", slotError);
        // Non-blocking — lead was still created
      }
    }

    // --- Send emails via Resend (non-blocking) ------------------------------
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const fullName = `${firstName} ${lastName}`;
      const formattedDate = appointmentDate
        ? new Date(appointmentDate + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : null;

      // -- Customer confirmation email --
      await resend.emails.send({
        from: "AquaGuard Inspections <noreply@mattataquaguard.com>",
        to: email,
        subject:
          "Your Free Inspection is Confirmed \u2014 Matthew Urbanski | AquaGuard",
        html: buildCustomerEmail({
          fullName,
          appointmentDate: formattedDate,
          appointmentTime,
          address,
          city,
          zip,
          issues,
        }),
      });

      // -- Internal lead alert email to Matt --
      const mapsQuery = encodeURIComponent(
        [address, city, "GA", zip].filter(Boolean).join(", ")
      );
      const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

      await resend.emails.send({
        from: "AquaGuard Lead Alerts <noreply@mattataquaguard.com>",
        to: "matthew.urbanski@AquaGuard.net",
        subject: `${scoreInfo.emoji} New Lead: ${fullName} (Score ${score})`,
        html: buildAlertEmail({
          fullName,
          email,
          phone,
          address,
          city,
          zip,
          issues,
          answers,
          score,
          scoreInfo,
          appointmentDate: formattedDate,
          appointmentTime,
          source,
          notes,
          mapsLink,
        }),
      });
    } catch (emailErr) {
      // Email failures must not block lead creation
      console.error("Resend email error:", emailErr);
    }

    return NextResponse.json(
      { success: true, leadId: lead.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/leads error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET /api/leads  — List leads (admin)
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") ?? "created_at";
    const limit = parseInt(searchParams.get("limit") ?? "50", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("leads")
      .select("*", { count: "exact" })
      .order(sort, { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data: leads, count, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch leads." },
        { status: 500 }
      );
    }

    return NextResponse.json({ leads, count });
  } catch (err) {
    console.error("GET /api/leads error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Email HTML builders
// ---------------------------------------------------------------------------

function buildCustomerEmail(data: {
  fullName: string;
  appointmentDate: string | null;
  appointmentTime: string | null;
  address?: string;
  city?: string;
  zip?: string;
  issues?: string[];
}): string {
  const appointmentBlock = data.appointmentDate
    ? `
      <tr>
        <td style="padding:24px 32px;background:#f0f4fa;border-radius:8px;">
          <p style="margin:0 0 4px;font-size:14px;color:#6b7280;">Your Appointment</p>
          <p style="margin:0;font-size:18px;font-weight:600;color:#1B3A6B;">
            ${data.appointmentDate}${data.appointmentTime ? ` at ${data.appointmentTime}` : ""}
          </p>
          ${data.address ? `<p style="margin:8px 0 0;font-size:14px;color:#4b5563;">${[data.address, data.city, data.zip].filter(Boolean).join(", ")}</p>` : ""}
        </td>
      </tr>
      <tr><td style="height:24px;"></td></tr>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <!-- Header -->
  <tr>
    <td style="background:#1B3A6B;padding:32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.5px;">AquaGuard</h1>
      <p style="margin:4px 0 0;color:#93c5fd;font-size:13px;">Foundation Solutions</p>
    </td>
  </tr>
  <!-- Body -->
  <tr>
    <td style="padding:32px;">
      <h2 style="margin:0 0 16px;color:#1B3A6B;font-size:22px;">Hi ${data.fullName},</h2>
      <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">
        Thank you for scheduling your <strong>free, no-obligation inspection</strong> with AquaGuard Foundation Solutions. I look forward to helping you protect your home.
      </p>
      ${appointmentBlock}
      <tr>
        <td style="padding:0 0 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">What to expect:</p>
          <ul style="margin:0;padding:0 0 0 20px;color:#374151;font-size:15px;line-height:1.8;">
            <li>A thorough, professional inspection of your home</li>
            <li>Detailed explanation of any findings</li>
            <li>Honest recommendations &mdash; no pressure</li>
            <li>A written estimate if work is needed</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 24px;">
          <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
            If you need to reschedule or have questions, feel free to call or text me directly.
          </p>
        </td>
      </tr>
      <!-- CTA -->
      <tr>
        <td align="center" style="padding:8px 0 24px;">
          <a href="tel:4705681681" style="display:inline-block;background:#1B3A6B;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;">
            Call Matt: (470) 568-1681
          </a>
        </td>
      </tr>
    </td>
  </tr>
  <!-- Footer -->
  <tr>
    <td style="background:#f9fafb;padding:24px 32px;border-top:1px solid #e5e7eb;">
      <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#1B3A6B;">Matthew Urbanski</p>
      <p style="margin:0;font-size:13px;color:#6b7280;">Certified Field Inspector | AquaGuard Foundation Solutions</p>
      <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">(470) 568-1681 &bull; mattataquaguard.com</p>
      <p style="margin:12px 0 0;font-size:11px;color:#9ca3af;">BBB A+ Rated Since 1998 &bull; Nationally Backed Transferable Warranties</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildAlertEmail(data: {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  zip?: string;
  issues?: string[];
  answers?: Record<string, unknown>;
  score: number;
  scoreInfo: { label: string; emoji: string };
  appointmentDate: string | null;
  appointmentTime: string | null;
  source?: string;
  notes?: string;
  mapsLink: string;
}): string {
  const issueList = (data.issues ?? [])
    .map((i: string) => `<li>${i}</li>`)
    .join("");

  const answersHtml = data.answers
    ? Object.entries(data.answers)
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 8px;color:#6b7280;font-size:13px;">${k}</td><td style="padding:4px 8px;font-size:13px;">${v}</td></tr>`
        )
        .join("")
    : "";

  const scoreBg =
    data.score >= 70 ? "#fef2f2" : data.score >= 40 ? "#fefce8" : "#f0fdf4";
  const scoreColor =
    data.score >= 70 ? "#dc2626" : data.score >= 40 ? "#ca8a04" : "#16a34a";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <!-- Header -->
  <tr>
    <td style="background:#1B3A6B;padding:24px 32px;">
      <h1 style="margin:0;color:#ffffff;font-size:20px;">${data.scoreInfo.emoji} New Lead Alert</h1>
    </td>
  </tr>
  <!-- Score badge -->
  <tr>
    <td style="padding:24px 32px 0;">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="background:${scoreBg};border-radius:8px;padding:16px 20px;">
            <span style="font-size:28px;font-weight:700;color:${scoreColor};">${data.score}</span>
            <span style="font-size:14px;font-weight:600;color:${scoreColor};margin-left:8px;">${data.scoreInfo.label}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- Contact info -->
  <tr>
    <td style="padding:24px 32px;">
      <h2 style="margin:0 0 16px;color:#1B3A6B;font-size:20px;">${data.fullName}</h2>
      <table cellpadding="0" cellspacing="0" style="font-size:14px;color:#374151;line-height:2;">
        <tr><td style="padding-right:12px;color:#6b7280;">Email</td><td><a href="mailto:${data.email}" style="color:#1B3A6B;">${data.email}</a></td></tr>
        <tr><td style="padding-right:12px;color:#6b7280;">Phone</td><td><a href="tel:${data.phone}" style="color:#1B3A6B;">${data.phone}</a></td></tr>
        ${data.address ? `<tr><td style="padding-right:12px;color:#6b7280;">Address</td><td>${[data.address, data.city, data.zip].filter(Boolean).join(", ")}</td></tr>` : ""}
        ${data.appointmentDate ? `<tr><td style="padding-right:12px;color:#6b7280;">Appt</td><td>${data.appointmentDate}${data.appointmentTime ? ` at ${data.appointmentTime}` : ""}</td></tr>` : ""}
        ${data.source ? `<tr><td style="padding-right:12px;color:#6b7280;">Source</td><td>${data.source}</td></tr>` : ""}
      </table>
      ${data.address ? `<p style="margin:12px 0 0;"><a href="${data.mapsLink}" style="display:inline-block;background:#1B3A6B;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:13px;font-weight:600;">Open in Google Maps &rarr;</a></p>` : ""}
    </td>
  </tr>
  ${
    issueList
      ? `<tr><td style="padding:0 32px 24px;">
          <p style="margin:0 0 8px;font-weight:600;color:#1B3A6B;font-size:14px;">Issues Reported</p>
          <ul style="margin:0;padding:0 0 0 20px;color:#374151;font-size:14px;line-height:1.8;">${issueList}</ul>
        </td></tr>`
      : ""
  }
  ${
    answersHtml
      ? `<tr><td style="padding:0 32px 24px;">
          <p style="margin:0 0 8px;font-weight:600;color:#1B3A6B;font-size:14px;">Form Answers</p>
          <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">${answersHtml}</table>
        </td></tr>`
      : ""
  }
  ${
    data.notes
      ? `<tr><td style="padding:0 32px 24px;">
          <p style="margin:0 0 4px;font-weight:600;color:#1B3A6B;font-size:14px;">Notes</p>
          <p style="margin:0;color:#374151;font-size:14px;background:#f9fafb;padding:12px;border-radius:6px;">${data.notes}</p>
        </td></tr>`
      : ""
  }
  <!-- Footer -->
  <tr>
    <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">AquaGuard Lead System &bull; Auto-generated alert</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
