import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleAPIError, requireAuth, APIError } from "@/lib/apiUtils";

// GET all leisure activities for current user
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth();

    const { data: leisures, error } = await supabase
      .from("leisure_activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ leisures }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

// POST create new leisure activity
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await request.json();
    const { title, emoji } = body;

    if (!title) {
      throw new APIError(400, "Title is required");
    }

    const { data: leisure, error } = await supabase
      .from("leisure_activities")
      .insert({
        user_id: userId,
        title,
        emoji: emoji || "🎮",
        is_default: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ leisure }, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
