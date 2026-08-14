import { NextRequest, NextResponse } from "next/server";

function extractImageUrls(html: string): string[] {
  const imageUrls: string[] = [];

  // Method 1: display_url — one per carousel slide, already full quality
  const displayUrlPattern = /"display_url":"([^"]+)"/g;
  let match;
  while ((match = displayUrlPattern.exec(html)) !== null) {
    const url = match[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
    if (url.includes(".jpg") || url.includes(".jpeg")) imageUrls.push(url);
  }

  // Method 2: image_versions2 — only take the FIRST candidate (highest res) per block
  if (imageUrls.length === 0) {
    const blockPattern = /"image_versions2":\{"candidates":\[([^\]]+)\]/g;
    while ((match = blockPattern.exec(html)) !== null) {
      const firstUrl = match[1].match(/"url":"([^"]+)"/);
      if (firstUrl?.[1]) {
        const url = firstUrl[1]
          .replace(/\\u0026/g, "&")
          .replace(/\\\//g, "/");
        if (url.includes(".jpg") || url.includes(".jpeg")) imageUrls.push(url);
      }
    }
  }

  // Method 3: og:image meta tag (single image fallback)
  if (imageUrls.length === 0) {
    const ogPattern = /<meta\s+property="og:image"\s+content="([^"]+)"/gi;
    while ((match = ogPattern.exec(html)) !== null) {
      const url = match[1].replace(/&amp;/g, "&");
      if (url.includes(".jpg") || url.includes(".jpeg") || url.includes("cdninstagram")) {
        imageUrls.push(url);
      }
    }
  }

  // Method 4: CDN URLs as last resort
  if (imageUrls.length === 0) {
    const cdnPattern = /https:\\\/\\\/[^"]+\.cdninstagram\.com[^"]+\.jpg/g;
    const cdnMatches = html.match(cdnPattern);
    if (cdnMatches) {
      for (const u of cdnMatches) {
        imageUrls.push(u.replace(/\\u0026/g, "&").replace(/\\\//g, "/"));
      }
    }
  }

  // Deduplicate by URL path (strip query string for comparison)
  const seen = new Set<string>();
  return imageUrls.filter((url) => {
    const key = url.split("?")[0];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractMetadata(html: string): { username: string; caption: string; thumbnailUrl: string | null } {
  let username = "";
  let caption = "";
  let thumbnailUrl: string | null = null;

  for (const re of [/"owner":\{"username":"([^"]+)"/, /"username":"([^"]+)"/]) {
    const m = html.match(re);
    if (m?.[1] && m[1] !== "reel") { username = `@${m[1]}`; break; }
  }
  if (!username) {
    const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)?.[1];
    const handleMatch = ogTitle?.match(/\(@([^)]+)\)/);
    if (handleMatch) username = `@${handleMatch[1]}`;
  }

  for (const re of [
    /"edge_media_to_caption":\{"edges":\[\{"node":\{"text":"([^"]+)"/,
    /"caption":"([^"]+)"/,
  ]) {
    const m = html.match(re);
    if (m?.[1]) { caption = m[1].replace(/\\n/g, "\n").substring(0, 300); break; }
  }
  if (!caption) {
    const ogDesc = html.match(/<meta\s+(?:property|name)="og:description"\s+content="([^"]+)"/i)?.[1];
    if (ogDesc) caption = ogDesc.replace(/&amp;/g, "&").split("\n")[0].trim();
  }

  const thumbPatterns = [/"display_url":"([^"]+)"/, /"thumbnail_src":"([^"]+)"/];
  for (const re of thumbPatterns) {
    const m = html.match(re);
    if (m?.[1]) {
      const url = m[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
      if (url.includes(".jpg") || url.includes("cdninstagram")) { thumbnailUrl = url; break; }
    }
  }
  if (!thumbnailUrl) {
    const ogImg = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1];
    if (ogImg) thumbnailUrl = ogImg.replace(/&amp;/g, "&");
  }

  return { username, caption, thumbnailUrl };
}

function extractShortcode(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return m?.[1] ?? null;
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) return NextResponse.json({ error: "URL required" }, { status: 400 });

  const shortcode = extractShortcode(rawUrl);
  if (!shortcode) return NextResponse.json({ error: "Invalid Instagram post URL" }, { status: 400 });

  const isReel = rawUrl.includes("/reel/") || rawUrl.includes("/tv/");
  const fetchUrl = isReel
    ? `https://www.instagram.com/reel/${shortcode}/`
    : `https://www.instagram.com/p/${shortcode}/`;

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
      if (res.status === 404) return NextResponse.json({ error: "Post not found. It may be deleted or private." }, { status: 404 });
      if (res.status === 429) return NextResponse.json({ error: "Rate limited. Please try again in a few minutes." }, { status: 429 });
      return NextResponse.json({ error: `Instagram returned status ${res.status}` }, { status: 502 });
    }

    const html = await res.text();

    if (!html.includes("og:image") && (html.includes("accounts/login") || html.includes("Log in to Instagram"))) {
      return NextResponse.json(
        { error: "This post requires login to view. Only public posts can be downloaded." },
        { status: 403 }
      );
    }

    const ogVideo =
      html.match(/<meta\s+property="og:video:secure_url"\s+content="([^"]+)"/i)?.[1] ??
      html.match(/<meta\s+property="og:video"\s+content="([^"]+)"/i)?.[1] ??
      null;

    const { username, caption, thumbnailUrl } = extractMetadata(html);

    if (ogVideo) {
      return NextResponse.json({
        shortcode,
        type: "video",
        imageUrls: thumbnailUrl ? [thumbnailUrl] : [],
        imageCount: 1,
        isCarousel: false,
        mediaUrl: ogVideo,
        thumbnail: thumbnailUrl,
        username,
        caption,
      });
    }

    const imageUrls = extractImageUrls(html);

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { error: "No media found. The post may be private or the URL is invalid." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      shortcode,
      type: "image",
      imageUrls,
      imageCount: imageUrls.length,
      isCarousel: imageUrls.length > 1,
      mediaUrl: imageUrls[0],
      thumbnail: thumbnailUrl ?? imageUrls[0],
      username,
      caption,
    });
  } catch (err) {
    console.error("[instagram/post]", err);
    return NextResponse.json({ error: "Failed to reach Instagram" }, { status: 500 });
  }
}
