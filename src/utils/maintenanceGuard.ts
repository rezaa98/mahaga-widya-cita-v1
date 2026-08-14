import { NextResponse } from "next/server";

export function denyProductionMaintenance() {
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_PRODUCTION_MAINTENANCE !== "true") {
    return NextResponse.json({ error: "Maintenance operation is disabled in production." }, { status: 404 });
  }
  return null;
}
