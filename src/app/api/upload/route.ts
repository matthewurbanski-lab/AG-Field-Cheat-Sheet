import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/heic"];
const MAX_FILES = 6;
const BUCKET = "lead-photos";

// ---------------------------------------------------------------------------
// POST /api/upload  — Upload photos for a lead
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const leadId = formData.get("leadId") as string | null;

    if (!leadId) {
      return NextResponse.json(
        { error: "leadId is required." },
        { status: 400 }
      );
    }

    const files: File[] = [];
    formData.forEach((value) => {
      if (value instanceof File) {
        files.push(value);
      }
    });

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided." },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} files allowed.` },
        { status: 400 }
      );
    }

    // Validate file types
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Invalid file type: ${file.type}. Accepted: JPEG, PNG, HEIC.`,
          },
          { status: 400 }
        );
      }
    }

    const supabase = getSupabaseAdmin();
    const uploadedPhotos: { id: string; url: string; filename: string }[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const storagePath = `${leadId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        continue; // Skip failed uploads but continue with others
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

      // Insert record into photos table
      const { data: photo, error: dbError } = await supabase
        .from("photos")
        .insert({
          lead_id: leadId,
          url: publicUrl,
          filename: file.name,
          storage_path: storagePath,
        })
        .select()
        .single();

      if (dbError) {
        console.error("Photo record insert error:", dbError);
        continue;
      }

      uploadedPhotos.push({
        id: photo.id,
        url: publicUrl,
        filename: file.name,
      });
    }

    if (uploadedPhotos.length === 0) {
      return NextResponse.json(
        { error: "All uploads failed." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, photos: uploadedPhotos },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/upload error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
