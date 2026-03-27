import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase";

// ---------------------------------------------------------------------------
// GET /api/leads/[id]  — Get a single lead with photos
// ---------------------------------------------------------------------------
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = getSupabaseAdmin();

    const { data: lead, error } = await supabase
      .from("leads")
      .select("*, photos(*)")
      .eq("id", id)
      .single();

    if (error || !lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (err) {
    console.error("GET /api/leads/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/leads/[id]  — Update a lead (status, notes, etc.)
// ---------------------------------------------------------------------------
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No fields provided to update." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Map camelCase body keys to snake_case column names
    const fieldMap: Record<string, string> = {
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      phone: "phone",
      address: "address",
      city: "city",
      zip: "zip",
      status: "status",
      notes: "notes",
      score: "score",
      issues: "issues",
      answers: "answers",
      appointmentDate: "appointment_date",
      appointmentTime: "appointment_time",
      source: "source",
    };

    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      const col = fieldMap[key] ?? key;
      updates[col] = value;
    }

    const { data: lead, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: "Failed to update lead." },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead });
  } catch (err) {
    console.error("PATCH /api/leads/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
