import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    tokenPrefix: process.env.BLOB_READ_WRITE_TOKEN ? process.env.BLOB_READ_WRITE_TOKEN.substring(0, 5) : null,
    vercelEnv: process.env.VERCEL_ENV,
  })
}
