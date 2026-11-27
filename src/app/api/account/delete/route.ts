import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> };

function withCookies(response: NextResponse, cookies: CookieToSet[]) {
  cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  return response;
}

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({
      ok: true,
      demo: true,
      message: "Demo-Modus: es gibt kein Serverkonto. Die Daten in diesem Browser können gelöscht werden.",
    });
  }

  const pendingCookies: CookieToSet[] = [];
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        pendingCookies.push(...cookiesToSet);
      },
    },
  });

  const { data, error: userError } = await supabase.auth.getUser();
  const user = data.user;
  if (userError || !user) {
    return withCookies(
      NextResponse.json({ error: "Bitte melde dich an, um das Konto zu löschen." }, { status: 401 }),
      pendingCookies,
    );
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!serviceKey) {
    return withCookies(
      NextResponse.json(
        { error: "Das Löschen ist noch nicht freigeschaltet. Auf dem Server fehlt der Dienstschlüssel." },
        { status: 503 },
      ),
      pendingCookies,
    );
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const attempts = await admin.from("attempts").delete().eq("user_id", user.id);
  if (attempts.error) {
    return withCookies(
      NextResponse.json({ error: "Die Versuche konnten nicht gelöscht werden." }, { status: 500 }),
      pendingCookies,
    );
  }

  const profile = await admin.from("profiles").delete().eq("id", user.id);
  if (profile.error) {
    return withCookies(
      NextResponse.json({ error: "Das Profil konnte nicht gelöscht werden." }, { status: 500 }),
      pendingCookies,
    );
  }

  const removed = await admin.auth.admin.deleteUser(user.id);
  if (removed.error) {
    return withCookies(
      NextResponse.json(
        { error: "Das Konto konnte nicht gelöscht werden. Die Anmeldung besteht noch." },
        { status: 500 },
      ),
      pendingCookies,
    );
  }

  try {
    await supabase.auth.signOut();
  } catch {
    // The auth user is already gone. Cookies from a successful sign-out are still applied below.
  }
  return withCookies(NextResponse.json({ ok: true }), pendingCookies);
}
