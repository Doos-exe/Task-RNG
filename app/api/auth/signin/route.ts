import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { handleAPIError, APIError } from "@/lib/apiUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      throw new APIError(400, "Email and password are required");
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new APIError(401, "Invalid email or password");
    }

    if (!data.user || !data.session) {
      throw new APIError(401, "Failed to sign in");
    }

    // Get user profile using admin client
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("name, theme")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
    }

    // Return session tokens and user data
    // The client will use these to restore the session
    const response = NextResponse.json(
      {
        message: "Sign in successful",
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || email,
          theme: profile?.theme || "light",
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      },
      { status: 200 }
    );

    // Set the session cookies for persistence
    response.cookies.set("sb-access-token", data.session.access_token, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    response.cookies.set("sb-refresh-token", data.session.refresh_token, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
  } catch (error) {
    return handleAPIError(error);
  }
}
