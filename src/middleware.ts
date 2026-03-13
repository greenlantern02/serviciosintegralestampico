import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const CF_TEAM_DOMAIN = process.env.CF_TEAM_DOMAIN;
const CF_ACCESS_AUD = process.env.CF_ACCESS_AUD;

let JWKS: ReturnType<typeof jose.createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!CF_TEAM_DOMAIN) return null;
  if (!JWKS) {
    JWKS = jose.createRemoteJWKSet(
      new URL(`https://${CF_TEAM_DOMAIN}/cdn-cgi/access/certs`)
    );
  }
  return JWKS;
}

export const config = {
  // Exclude login page from session checks
  matcher: ["/admin/((?!login$|login/).*)"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Cloudflare Access (optional outer layer) ─────────────────────────────
  if (CF_TEAM_DOMAIN && CF_ACCESS_AUD && process.env.NODE_ENV !== "development") {
    const cfToken = req.headers.get("CF-Access-Jwt-Assertion");
    if (!cfToken) {
      return new NextResponse("Acceso denegado. Se requiere Cloudflare Access.", { status: 403 });
    }
    try {
      const jwks = getJWKS();
      if (jwks) {
        await jose.jwtVerify(cfToken, jwks, {
          issuer: `https://${CF_TEAM_DOMAIN}`,
          audience: CF_ACCESS_AUD,
        });
      }
    } catch {
      return new NextResponse("Token de Cloudflare Access inválido.", { status: 403 });
    }
  }

  // ── Custom session cookie (inner layer — always active) ───────────────────
  // API routes under /admin handle their own session check in the route handler
  if (pathname.startsWith("/api/")) return NextResponse.next();

  const sessionCookie = req.cookies.get("admin_session")?.value;
  if (!sessionCookie) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? "dev-secret");
    await jose.jwtVerify(sessionCookie, secret);
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}
