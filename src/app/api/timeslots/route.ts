import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// GET /api/timeslots  — Get available time slots
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("time_slots")
      .select("*")
      .eq("is_available", true)
      .eq("is_booked", false)
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });

    if (startDate) {
      query = query.gte("date", startDate);
    }
    if (endDate) {
      query = query.lte("date", endDate);
    }

    const { data: slots, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch time slots." },
        { status: 500 }
      );
    }

    return NextResponse.json({ slots });
  } catch (err) {
    console.error("GET /api/timeslots error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/timeslots  — Create time slots (admin, supports bulk)
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, dates, startTime, endTime } = body;

    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: "startTime and endTime are required." },
        { status: 400 }
      );
    }

    const datesToInsert: string[] = dates ?? (date ? [date] : []);

    if (datesToInsert.length === 0) {
      return NextResponse.json(
        { error: "At least one date is required (date or dates[])." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const rows = datesToInsert.map((d: string) => ({
      date: d,
      start_time: startTime,
      end_time: endTime,
      is_available: true,
      is_booked: false,
    }));

    const { data: slots, error } = await supabase
      .from("time_slots")
      .insert(rows)
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create time slots." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, slots }, { status: 201 });
  } catch (err) {
    console.error("POST /api/timeslots error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
