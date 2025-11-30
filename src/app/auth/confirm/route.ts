import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/login";

  if (token_hash && type) {
    const supabase = await createClient();

    // Verify the OTP directly with Supabase
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // If successful, redirect user to their dashboard/home
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // If verification fails, send them to an error page
  return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
}
