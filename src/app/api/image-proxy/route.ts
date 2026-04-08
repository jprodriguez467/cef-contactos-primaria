import { NextResponse } from "next/server";

const ALLOWED_HOSTNAMES = [
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
];

function validarUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url query parameter" }, { status: 400 });
  }

  const parsedUrl = validarUrl(url);
  if (!parsedUrl) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!ALLOWED_HOSTNAMES.includes(parsedUrl.hostname)) {
    return NextResponse.json({ error: "URL hostname not allowed" }, { status: 403 });
  }

  const response = await fetch(url);
  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch image", status: response.status },
      { status: response.status }
    );
  }

  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  headers.set("Content-Type", response.headers.get("Content-Type") ?? "application/octet-stream");

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

export async function HEAD(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url query parameter" }, { status: 400 });
  }

  const parsedUrl = validarUrl(url);
  if (!parsedUrl || !ALLOWED_HOSTNAMES.includes(parsedUrl.hostname)) {
    return NextResponse.json({ error: "Invalid or disallowed url" }, { status: 400 });
  }

  const response = await fetch(url, { method: "HEAD" });
  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch image", status: response.status },
      { status: response.status }
    );
  }

  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  return new Response(null, {
    status: response.status,
    headers,
  });
}
