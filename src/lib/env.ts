export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const demoMode = supabaseUrl.length === 0 || supabaseAnonKey.length === 0;

/** Hidden until Google is enabled in Supabase and this flag is exactly "true". */
export const googleAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true";
