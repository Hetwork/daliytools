import { NextRequest } from "next/server";

const ALLOWED_HOSTS = [
  "cdninstagram.com",
  "instagram.com",
  "fbcdn.net",
  "scontent.instagram.com",
];

function isAllowed(rawUrl: string): boolean {
  try {
    const { hostname } = new URL(rawUrl);
    return ALLOWED_HOSTS.some((h) => hostname === h || hostname.endsWith("." + h));
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const mediaUrl = request.nextUrl.searchParams.get("url");
  const filename = request.nextUrl.searchParams.get("filename") ?? "instagram-media";

  if (!mediaUrl) {
    return new Response("URL required", { status: 400 });
  }

  if (!isAllowed(mediaUrl)) {
    return new Response("Forbidden: not an Instagram CDN URL", { status: 403 });
  }

  try {
    const upstream = await fetch(mediaUrl, {
      headers: {
        Referer: "https://www.instagram.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });

    if (!upstream.ok) {
      return new Response(`Upstream ${upstream.status}`, { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
    const isVideo = contentType.includes("video");
    const ext = isVideo ? "mp4" : contentType.includes("jpeg") ? "jpg" : "png";
    const safeName = filename.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80);

    const body = await upstream.arrayBuffer();

    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${safeName}.${ext}"`,
        "Content-Length": String(body.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[instagram/proxy]", err);
    return new Response("Proxy error", { status: 500 });
  }
}
