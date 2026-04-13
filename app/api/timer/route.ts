import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleAPIError, requireAuth, APIError } from "@/lib/apiUtils";

// GET current active timer
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth();

    const { data: timer, error } = await supabase
      .from("active_timers")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ timer }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

// POST create or update active timer
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await request.json();
    const { result, is_task, task_priority, start_time, duration, source } =
      body;

    if (!result || !start_time || !duration) {
      throw new APIError(400, "Missing required fields");
    }

    // Delete existing timer if any
    await supabase.from("active_timers").delete().eq("user_id", userId);

    // Create new timer
    const { data: timer, error } = await supabase
      .from("active_timers")
      .insert({
        user_id: userId,
        result,
        is_task,
        task_priority: task_priority || null,
        start_time,
        duration,
        source,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ timer }, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}

// DELETE active timer
export async function DELETE(request: NextRequest) {
  try {
    const userId = await requireAuth();

    const { error } = await supabase
      .from("active_timers")
      .delete()
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      { message: "Timer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
