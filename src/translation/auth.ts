import type { Payload } from "payload";
import { NextResponse } from "next/server";
import { hasCapability, isAdminUser, type Capability } from "@/utils/access";

export async function authorizeTranslationRequest(
  payload: Payload,
  req: Request,
  capabilities: Capability[] = [],
): Promise<{ error?: NextResponse; user?: any }> {
  try {
    const { user } = await payload.auth({ headers: req.headers });
    if (!isAdminUser(user)) {
      return { error: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
    }
    if (capabilities.length && !capabilities.some((capability) => hasCapability(user, capability))) {
      return { error: NextResponse.json({ error: "Insufficient permission." }, { status: 403 }) };
    }
    return { user };
  } catch {
    return { error: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  }
}
