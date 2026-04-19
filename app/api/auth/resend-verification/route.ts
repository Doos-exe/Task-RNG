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

    // Get redirect URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const redirectUrl = `${protocol}://${host}/auth?verified=true`;

    // Resend signup email with verification link
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error("Resend verification error:", error);
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
