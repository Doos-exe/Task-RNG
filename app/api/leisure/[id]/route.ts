import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleAPIError, requireAuth, APIError } from "@/lib/apiUtils";

// PUT update leisure activity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leisureId } = await params;
    const userId = await requireAuth();
    const body = await request.json();
    const { title, emoji } = body;

    // Verify ownership
    const { data: existingLeisure, error: checkError } = await supabase
      .from("leisure_activities")
      .select("id")
      .eq("id", leisureId)
      .eq("user_id", userId)
      .single();

    if (checkError || !existingLeisure) {
      throw new APIError(404, "Leisure activity not found");
    }

    const { data: leisure, error } = await supabase
      .from("leisure_activities")
      .update({
        ...(title && { title }),
        ...(emoji && { emoji }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", leisureId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ leisure }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

// DELETE leisure activity
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leisureId } = await params;
    const userId = await requireAuth();

    // Verify ownership before deleting
    const { data: existingLeisure, error: checkError } = await supabase
      .from("leisure_activities")
      .select("id")
      .eq("id", leisureId)
      .eq("user_id", userId)
      .single();

    if (checkError || !existingLeisure) {
      throw new APIError(404, "Leisure activity not found");
    }

    const { error } = await supabase
      .from("leisure_activities")
      .delete()
      .eq("id", leisureId)
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      { message: "Leisure activity deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
