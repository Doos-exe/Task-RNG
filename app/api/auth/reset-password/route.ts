import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleAPIError, APIError } from "@/lib/apiUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      throw new APIError(400, "Email is required");
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth?resetPassword=true`,
    });

    if (error) {
      throw new APIError(400, error.message);
    }

    return NextResponse.json(
      {
        message:
          "Password reset email sent. Check your inbox for the reset link.",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
