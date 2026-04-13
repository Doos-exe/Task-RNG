import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { handleAPIError, requireAuth } from "@/lib/apiUtils";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth();

    const { data: profile, error } = await supabaseAdmin
      .from("user_profiles")
      .select("name, theme")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Profile fetch error:", error);
      return NextResponse.json(
        {
          name: null,
          theme: "light",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ ...profile }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}
