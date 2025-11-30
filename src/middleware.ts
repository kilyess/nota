import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup";

  const isRootRoute = request.nextUrl.pathname === "/";

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/app");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if ((isAuthRoute && user) || (isRootRoute && user)) {
    return NextResponse.redirect(
      new URL("/app", process.env.NEXT_PUBLIC_BASE_URL!),
    );
  }

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(
      new URL("/login", process.env.NEXT_PUBLIC_BASE_URL!),
    );
  }

  return supabaseResponse;
}
