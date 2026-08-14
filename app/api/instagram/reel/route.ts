import { NextRequest, NextResponse } from "next/server";

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(`<meta\\s+property="${property}"\\s+content="([^"]+)"`, "i"),
    new RegExp(`<meta\\s+content="([^"]+)"\\s+property="${property}"`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1]);
  }
  return null;
}

function extractVideoUrl(html: string): string | null {
  // Method 1: video_url JSON field variants
  for (const re of [
    /"video_url":"([^"]+)"/,
    /"videoUrl":"([^"]+)"/,
    /video_url":"([^"]+)"/,
  ]) {
    const m = html.match(re);
    if (m) return m[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
  }

  // Method 2: VideoObject JSON-LD
  const jsonLdPattern = /<script type="application\/ld\+json">([^<]+)<\/script>/g;
  let jsonLdMatch;
  while ((jsonLdMatch = jsonLdPattern.exec(html)) !== null) {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      if (data["@type"] === "VideoObject" && data.contentUrl) return data.contentUrl;
    } catch { continue; }
  }

  // Method 3: playback_url
  const playback = html.match(/"playback_url":"([^"]+)"/);
  if (playback) return playback[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/");

  // Method 4: CDN .mp4 URLs
  const cdnPattern = /https:\\\/\\\/[^"]+\.cdninstagram\.com[^"]+\.mp4[^"]*/g;
  const cdnMatches = html.match(cdnPattern);
  if (cdnMatches?.length) {
    const longest = cdnMatches.reduce((a, b) => (a.length > b.length ? a : b));
    return longest.replace(/\\u0026/g, "&").replace(/\\\//g, "/");
  }

  // Method 5: __additionalDataLoaded
  const additionalData = html.match(/"__additionalDataLoaded\('extra',({.+?})\)"/);
  if (additionalData) {
    try {
      const data = JSON.parse(additionalData[1]);
      if (data?.video_url) return data.video_url;
    } catch { /* continue */ }
  }

  // Method 6: scan script tags for .mp4
  const scriptPattern = /<script[^>]*>([^<]+)<\/script>/g;
  let scriptMatch;
  while ((scriptMatch = scriptPattern.exec(html)) !== null) {
    const content = scriptMatch[1];
    if (content.includes("video_url") || content.includes(".mp4")) {
      const m = content.match(/https?:[^"'\s]+\.mp4[^"'\s]*/);
      if (m) return m[0].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
    }
  }

  // Fallback: og:video meta tag
  return (
    extractMeta(html, "og:video:secure_url") ??
    extractMeta(html, "og:video")
  );
}

function extractShortcode(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/);
  return m?.[1] ?? null;
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) return NextResponse.json({ error: "URL required" }, { status: 400 });

  const shortcode = extractShortcode(rawUrl);
  if (!shortcode) return NextResponse.json({ error: "Invalid Instagram reel URL" }, { status: 400 });

  const fetchUrl = rawUrl.includes("/p/")
    ? `https://www.instagram.com/p/${shortcode}/`
    : `https://www.instagram.com/reel/${shortcode}/`;

  try {
    const res = await fetch(fetchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: "https://www.instagram.com/",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      if (res.status === 404) return NextResponse.json({ error: "Reel not found. It may be deleted or private." }, { status: 404 });
      if (res.status === 429) return NextResponse.json({ error: "Rate limited. Please try again in a few minutes." }, { status: 429 });
      return NextResponse.json({ error: `Instagram returned status ${res.status}` }, { status: 502 });
    }

    const html = await res.text();

    if (!html.includes("og:video") && (html.includes("accounts/login") || html.includes("Log in to Instagram"))) {
      return NextResponse.json(
        { error: "This reel requires login to view. Only public reels can be downloaded." },
        { status: 403 }
      );
    }

    const videoUrl = extractVideoUrl(html);

    if (!videoUrl) {
      return NextResponse.json(
        { error: "No video found. The reel may be private or the URL is invalid." },
        { status: 404 }
      );
    }

    const ogImage = extractMeta(html, "og:image");
    const ogTitle = extractMeta(html, "og:title");
    const ogDescription = extractMeta(html, "og:description");

    const durationMeta = extractMeta(html, "og:video:duration");
    const durationSec = durationMeta ? parseInt(durationMeta, 10) : null;
    const duration =
      durationSec != null
        ? `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, "0")}`
        : null;

    // Username: prefer JSON field, fallback to og:title
    let username = "";
    const ownerMatch = html.match(/"owner":\{"username":"([^"]+)"/);
    if (ownerMatch?.[1]) {
      username = `@${ownerMatch[1]}`;
    } else {
      const handleMatch = ogTitle?.match(/\(@([^)]+)\)/);
      if (handleMatch) username = `@${handleMatch[1]}`;
    }

    // Caption: prefer JSON field, fallback to og:description
    let caption = "";
    for (const re of [
      /"edge_media_to_caption":\{"edges":\[\{"node":\{"text":"([^"]+)"/,
      /"caption":"([^"]+)"/,
    ]) {
      const m = html.match(re);
      if (m?.[1]) { caption = m[1].replace(/\\n/g, "\n").substring(0, 300); break; }
    }
    if (!caption) caption = ogDescription?.split("\n")[0]?.trim() ?? "";

    const audioMatch = ogDescription?.match(/♪\s*(.+)/);
    const audio = audioMatch?.[1]?.trim() ?? null;

    return NextResponse.json({
      shortcode,
      videoUrl,
      thumbnail: ogImage ?? null,
      username,
      caption,
      audio,
      duration,
    });
  } catch (err) {
    console.error("[instagram/reel]", err);
    return NextResponse.json({ error: "Failed to reach Instagram" }, { status: 500 });
  }
}
