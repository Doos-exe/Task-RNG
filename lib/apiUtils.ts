import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export class APIError extends Error {
  constructor(
    public status: number,
    public message: string
  ) {
    super(message);
  }
}

export async function requireAuth() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    throw new APIError(401, "Unauthorized - Please log in");
  }

  return session.user.id;
}

export function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  if (error instanceof Error) {
    console.error("[API Error]", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Unknown error occurred" },
    { status: 500 }
  );
}
