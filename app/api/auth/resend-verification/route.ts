import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleAPIError, APIError } from "@/lib/apiUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      throw new APIError(400, "Email is required");
    }

    // Resend signup email with verification link
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      throw new APIError(400, error.message || "Failed to resend verification email");
    }

    return NextResponse.json(
      {
        message: "Verification email sent. Please check your inbox and spam folder.",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
