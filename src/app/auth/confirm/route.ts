import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      let redirectUrl: string;
      if (next) {
        redirectUrl = next;
      } else {
        redirectUrl = "/login";
      }

      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } else {
      console.error("Auth Error:", error.message);
    }
  }

  return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
}
