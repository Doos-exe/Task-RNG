import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleAPIError, requireAuth } from "@/lib/apiUtils";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth();

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("name, theme")
      .eq("id", userId)
      .single();

    if (profileError) {
      throw new Error("Failed to retrieve user profile");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return NextResponse.json(
      {
        user: {
          id: user?.id,
          email: user?.email,
          name: profile?.name,
          theme: profile?.theme || "light",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
