/**
 * Admin API Authentication Utility
 *
 * Protects internal/admin API routes from unauthorized access.
 * Routes using this guard require a valid ADMIN_API_SECRET header
 * OR an authenticated Payload CMS session cookie.
 *
 * Usage:
 *   import { requireAdminAuth } from '@/utils/adminAuth'
 *   const authError = await requireAdminAuth(req)
 *   if (authError) return authError
 */

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { isAdminApiUser } from "./access";

const ADMIN_SECRET = process.env.ADMIN_API_SECRET || "";

/**
 * Returns a NextResponse error if the request is not authorized.
 * Returns null if authorized — meaning the route should proceed.
 */
export async function requireAdminAuth(req: Request): Promise<NextResponse | null> {
  // Method 1: Check for ADMIN_API_SECRET header (for server-to-server or manual ops)
  const secretHeader = req.headers.get("x-admin-secret");
  if (ADMIN_SECRET && secretHeader === ADMIN_SECRET) {
    return null; // Authorized
  }

  // Method 2: Check the Payload CMS session and its server-side role. A
  // successful login alone is not enough for operational admin endpoints.
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await (payload as any).auth({ headers: req.headers });
    if (isAdminApiUser(result?.user)) {
      return null; // Authorized — user is logged in
    }

    if (result?.user) {
      return NextResponse.json({ error: "Forbidden. Administrator role required." }, { status: 403 });
    }
  } catch {
    // Ignore auth check errors — fall through to unauthorized
  }

  return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
}
