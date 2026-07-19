import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { pushDevSchema } from "@payloadcms/drizzle";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    
    // Check for a basic secret token so random users can't trigger this
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    
    if (token !== "mahaga-sync-2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Force drizzle to push the schema
    await pushDevSchema(payload.db as any);
    
    return NextResponse.json({ 
      success: true, 
      message: "Database schema forced sync successfully!" 
    });
  } catch (err) {
    console.error("Force Sync Error:", err);
    return NextResponse.json({ 
      success: false, 
      error: String(err) 
    }, { status: 500 });
  }
}
