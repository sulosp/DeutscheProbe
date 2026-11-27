import type { NextConfig } from "next";

function supabaseConnectSources() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return [];
  try {
    const url = new URL(raw);
    const ws = `${url.protocol === "http:" ? "ws:" : "wss:"}//${url.host}`;
    return [url.origin, ws];
  } catch {
    return [];
  }
}

function contentSecurityPolicy() {
  const isDev = process.env.NODE_ENV !== "production";
  const supabase = supabaseConnectSources();
  const scriptSrc = ["'self'", "'unsafe-inline'", isDev ? "'unsafe-eval'" : "", "https://va.vercel-scripts.com", "https://vercel.live"]
    .filter(Boolean)
    .join(" ");
  const connectSrc = [
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    ...supabase,
    "https://vitals.vercel-insights.com",
    "https://*.vercel-insights.com",
    "https://vercel.live",
    "wss://vercel.live",
    "https://*.pusher.com",
    "wss://*.pusher.com",
  ].join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://*.supabase.co https://vercel.com https://*.vercel.com",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "media-src 'self' blob: data: https://*.supabase.co",
    "worker-src 'self' blob:",
    "frame-src 'self' https://vercel.live",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https://*.supabase.co https://accounts.google.com",
    "object-src 'none'",
    "manifest-src 'self'",
  ].join("; ");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy() },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
