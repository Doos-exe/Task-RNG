import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleAPIError, requireAuth } from "@/lib/apiUtils";

// GET user progress
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth();

    const { data: progress, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

// PATCH update user progress
export async function PATCH(request: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await request.json();
    const {
      coins,
      skip_cost,
      spin_history,
      task_consecutive_count,
      leisure_consecutive_count,
    } = body;

    const { data: progress, error } = await supabase
      .from("user_progress")
      .update({
        ...(typeof coins === "number" && { coins }),
        ...(typeof skip_cost === "number" && { skip_cost }),
        ...(spin_history && { spin_history }),
        ...(typeof task_consecutive_count === "number" && {
          task_consecutive_count,
        }),
        ...(typeof leisure_consecutive_count === "number" && {
          leisure_consecutive_count,
        }),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}
