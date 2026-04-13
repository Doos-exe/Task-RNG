import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleAPIError, requireAuth, APIError } from "@/lib/apiUtils";

// GET all tasks for current user
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth();

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

// POST create new task
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await request.json();
    const { title, emoji, priority } = body;

    if (!title) {
      throw new APIError(400, "Title is required");
    }

    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        title,
        emoji: emoji || "📝",
        priority: priority || "medium",
        completed: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
