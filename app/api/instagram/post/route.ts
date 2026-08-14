import { NextRequest, NextResponse } from "next/server";

function extractImageUrls(html: string): string[] {
  const imageUrls: string[] = [];

  // Method 1: display_url (per carousel slide)
  const displayUrlPattern = /"display_url":"([^"]+)"/g;
  let match;
  while ((match = displayUrlPattern.exec(html)) !== null) {
    const url = match[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
    if (url.includes(".jpg") || url.includes(".jpeg")) imageUrls.push(url);
  }

  // Method 2: image_versions2 candidates
  const imageVersionPattern = /"image_versions2":\{"candidates":\[([^\]]+)\]/g;
  while ((match = imageVersionPattern.exec(html)) !== null) {
    const urlMatches = match[1].match(/"url":"([^"]+)"/g);
    if (urlMatches) {
      for (const urlMatch of urlMatches) {
        const url = urlMatch
          .replace(/"url":"/g, "")
          .replace(/"/g, "")
          .replace(/\\u0026/g, "&")
          .replace(/\\\//g, "/");
        if (url.includes(".jpg") || url.includes(".jpeg")) imageUrls.push(url);
      }
    }
  }

  // Method 3: og:image meta tag
  const ogPattern = /<meta\s+property="og:image"\s+content="([^"]+)"/g;
  while ((match = ogPattern.exec(html)) !== null) {
    const url = match[1].replace(/&amp;/g, "&");
    if (url.includes(".jpg") || url.includes(".jpeg")) imageUrls.push(url);
  }

  // Method 4: CDN URLs
  const cdnPattern = /https:\\\/\\\/[^"]+\.cdninstagram\.com[^"]+\.jpg/g;
  const cdnMatches = html.match(cdnPattern);
  if (cdnMatches) {
    for (const u of cdnMatches) {
      imageUrls.push(u.replace(/\\u0026/g, "&").replace(/\\\//g, "/"));
    }
  }

  return Array.from(new Set(imageUrls));
}

function extractMetadata(html: string): { username: string; caption: string; thumbnailUrl: string | null } {
  let username = "";
  let caption = "";
  let thumbnailUrl: string | null = null;

  // Username
  for (const re of [/"owner":\{"username":"([^"]+)"/, /"username":"([^"]+)"/]) {
    const m = html.match(re);
    if (m?.[1] && m[1] !== "reel") { username = `@${m[1]}`; break; }
  }
  if (!username) {
    const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)?.[1];
    const handleMatch = ogTitle?.match(/\(@([^)]+)\)/);
    if (handleMatch) username = `@${handleMatch[1]}`;
  }

  // Caption
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

  // Thumbnail
  for (const re of [
    /"display_url":"([^"]+)"/,
    /"thumbnail_src":"([^"]+)"/,
  ]) {
    const m = html.match(re);
    if (m?.[1]) {
      const url = m[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
      if (url.includes(".jpg") || url.includes("cdninstagram.com")) { thumbnailUrl = url; break; }
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

    const imageUrls = extractImageUrls(html);
    const { username, caption, thumbnailUrl } = extractMetadata(html);

    // Check for video
    const ogVideo =
      html.match(/<meta\s+property="og:video:secure_url"\s+content="([^"]+)"/i)?.[1] ??
      html.match(/<meta\s+property="og:video"\s+content="([^"]+)"/i)?.[1] ??
      null;

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
