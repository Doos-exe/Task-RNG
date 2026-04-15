import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleAPIError, requireAuth, APIError } from "@/lib/apiUtils";

// GET single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const userId = await requireAuth();

    const { data: task, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .eq("user_id", userId)
      .single();

    if (error) {
      throw new APIError(404, "Task not found");
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

// PUT update task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const userId = await requireAuth();
    const body = await request.json();
    const { title, emoji, priority, completed } = body;

    // Verify ownership
    const { data: existingTask, error: checkError } = await supabase
      .from("tasks")
      .select("id")
      .eq("id", taskId)
      .eq("user_id", userId)
      .single();

    if (checkError || !existingTask) {
      throw new APIError(404, "Task not found");
    }

    const { data: task, error } = await supabase
      .from("tasks")
      .update({
        ...(title && { title }),
        ...(emoji && { emoji }),
        ...(priority && { priority }),
        ...(typeof completed === "boolean" && { completed }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

// DELETE task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const userId = await requireAuth();

    // Verify ownership before deleting
    const { data: existingTask, error: checkError } = await supabase
      .from("tasks")
      .select("id")
      .eq("id", taskId)
      .eq("user_id", userId)
      .single();

    if (checkError || !existingTask) {
      throw new APIError(404, "Task not found");
    }

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
