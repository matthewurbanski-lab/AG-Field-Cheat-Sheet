import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../lib/supabase";

// ---------------------------------------------------------------------------
// GET /api/settings  — Get admin settings
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      // Return defaults if table doesn't exist or is empty
      return NextResponse.json({ settings: null });
    }

    return NextResponse.json({ settings: data });
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json({ settings: null });
  }
}

// ---------------------------------------------------------------------------
// PUT /api/settings  — Update admin settings
// ---------------------------------------------------------------------------
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: "Settings object is required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Try to update the existing row first
    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .limit(1)
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from("settings")
        .update(settings)
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("settings")
        .insert(settings)
        .select()
        .single();
    }

    if (result.error) {
      console.error("Supabase settings error:", result.error);
      return NextResponse.json(
        { error: "Failed to save settings." },
        { status: 500 }
      );
    }

    return NextResponse.json({ settings: result.data });
  } catch (err) {
    console.error("PUT /api/settings error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
