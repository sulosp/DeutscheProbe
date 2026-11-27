import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/safe-next";

function loginRedirect(origin: string, message: string) {
  const url = new URL("/anmelden", origin);
  url.searchParams.set("fehler", message);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const authError =
    requestUrl.searchParams.get("error") ||
    requestUrl.searchParams.get("error_code") ||
    requestUrl.searchParams.get("error_description");
  const nextPath = safeNextPath(requestUrl.searchParams.get("next"));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (authError) {
    return loginRedirect(requestUrl.origin, "Die Anmeldung wurde abgebrochen oder vom Anbieter abgelehnt.");
  }
  if (!url || !key) {
    return loginRedirect(requestUrl.origin, "Die Anmeldung ist auf diesem Server nicht eingerichtet.");
  }
  if (!code) {
    return loginRedirect(requestUrl.origin, "Der Anmeldelink enthält keinen gültigen Code. Bitte melde dich erneut an.");
  }

  const redirect = NextResponse.redirect(new URL(nextPath, requestUrl.origin));
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) => redirect.cookies.set(name, value, options));
      },
    },
  });

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.session) {
      return loginRedirect(requestUrl.origin, "Die Anmeldung ist fehlgeschlagen. Der Link ist ungültig oder abgelaufen.");
    }
  } catch {
    return loginRedirect(requestUrl.origin, "Die Anmeldung ist fehlgeschlagen. Der Link ist ungültig oder abgelaufen.");
  }

  return redirect;
}
