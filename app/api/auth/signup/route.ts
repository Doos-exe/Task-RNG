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

    // Email validation (allow multiple dots in domain)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length === 0) {
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
    let profileCreated = false;
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert({
        id: data.user.id,
        name,
        theme: "light",
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);

      // If it's a foreign key error, log it but continue with signup
      if (profileError.code === "23503") {
        console.warn("Foreign key constraint error on user_profiles. Continuing with signup anyway.");
        // Don't throw error - allow user to proceed
        profileCreated = false;
      } else {
        throw new APIError(500, "Failed to create user profile");
      }
    } else {
      profileCreated = true;
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

      // If it's a foreign key error, log it but continue with signup
      if (progressError.code === "23503") {
        console.warn("Foreign key constraint error on user_progress. Continuing with signup anyway.");
        // Don't throw error - allow user to proceed
      } else {
        throw new APIError(500, "Failed to create user progress");
      }
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
