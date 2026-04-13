import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { handleAPIError, APIError } from "@/lib/apiUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password || !name) {
      throw new APIError(400, "Email, password, and name are required");
    }

    // Email validation (basic but solid)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new APIError(400, "Please enter a valid email address");
    }

    if (password.length < 6) {
      throw new APIError(400, "Password must be at least 6 characters");
    }

    if (name.trim().length === 0) {
      throw new APIError(400, "Name cannot be empty");
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      throw new APIError(400, error.message);
    }

    if (!data.user) {
      throw new APIError(400, "Failed to create user");
    }

    // Create user profile (use admin client to bypass RLS)
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert({
        id: data.user.id,
        name,
        theme: "light",
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      throw new APIError(500, "Failed to create user profile");
    }

    // Create user progress record (use admin client to bypass RLS)
    const { error: progressError } = await supabaseAdmin
      .from("user_progress")
      .insert({
        user_id: data.user.id,
        coins: 0,
        skip_cost: 1,
        spin_history: [],
        task_consecutive_count: 0,
        leisure_consecutive_count: 0,
      });

    if (progressError) {
      console.error("Progress creation error:", progressError);
      throw new APIError(500, "Failed to create user progress");
    }

    return NextResponse.json(
      {
        message: "Sign up successful. Please check your email to verify your account.",
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
