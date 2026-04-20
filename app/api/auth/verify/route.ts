import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleAPIError, APIError } from "@/lib/apiUtils";

/**
 * Handles email verification callback from Supabase
 * This endpoint processes the verification token from the email link
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, type } = body;

    if (!token || !type) {
      throw new APIError(400, "Token and type are required");
    }

    // Verify the token with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as "signup" | "recovery" | "invite" | "magiclink" | "email_change",
    });

    if (error) {
      console.error("Email verification error:", error);
      throw new APIError(400, error.message || "Failed to verify email");
    }

    if (!data.user) {
      throw new APIError(400, "Email verification failed");
    }

    return NextResponse.json(
      {
        message: "Email verified successfully!",
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
