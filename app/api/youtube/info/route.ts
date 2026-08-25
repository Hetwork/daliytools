import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

const YTDLP = process.env.YTDLP_PATH || "yt-dlp";

export const runtime = "nodejs";

const QUALITY_ORDER: Record<string, number> = {
  "2160p": 0, "1440p": 1, "1080p": 2, "720p": 3, "480p": 4, "360p": 5, "240p": 6, "144p": 7,
};

function isValidYouTubeUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?(youtube\.com\/(watch|shorts)|youtu\.be\/)/.test(url);
}

function runYtdlp(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP, args, { windowsHide: true });
    let out = "";
    let err = "";
    proc.on("error", (spawnErr: NodeJS.ErrnoException) => {
      if (spawnErr.code === "ENOENT") {
        reject(new Error("yt-dlp not found. Install yt-dlp and ensure it is available in PATH, or set YTDLP_PATH."));
        return;
      }
      reject(spawnErr);
    });
    proc.stdout.on("data", (d: Buffer) => (out += d.toString()));
    proc.stderr.on("data", (d: Buffer) => (err += d.toString()));
    proc.on("close", (code) => {
      if (code !== 0) reject(new Error(err || `yt-dlp exited ${code}`));
      else resolve(out);
    });
  });
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });
  if (!isValidYouTubeUrl(url)) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });

  try {
    const json = await runYtdlp(["-J", "--no-playlist", url]);
    const data = JSON.parse(json);

    // Keep muxed mp4 formats (have both video and audio already)
    const seen = new Set<string>();
    const formats: { id: string; qualityLabel: string; ext: string; filesize: number | null; type: string }[] = [];

    for (const f of (data.formats as {
      format_id: string; height: number | null; ext: string;
      vcodec: string; acodec: string; filesize: number | null; tbr: number | null;
    }[])) {
      const hasVideo = f.vcodec && f.vcodec !== "none";
      const hasAudio = f.acodec && f.acodec !== "none";
      if (!hasVideo || !hasAudio || f.ext !== "mp4" || !f.height) continue;

      const label = `${f.height}p`;
      if (seen.has(label)) continue;
      seen.add(label);

      formats.push({ id: f.format_id, qualityLabel: label, ext: "mp4", filesize: f.filesize, type: "video" });
    }

    // Sort by quality (highest first)
    formats.sort((a, b) => (QUALITY_ORDER[a.qualityLabel] ?? 9) - (QUALITY_ORDER[b.qualityLabel] ?? 9));

    // Add audio-only option
    const audioFmt = (data.formats as { format_id: string; acodec: string; vcodec: string; ext: string; abr?: number; filesize: number | null }[])
      .filter((f) => f.vcodec === "none" && f.acodec !== "none" && (f.ext === "m4a" || f.ext === "mp4"))
      .sort((a, b) => (b.abr ?? 0) - (a.abr ?? 0))[0];

    if (audioFmt) {
      formats.push({
        id: audioFmt.format_id,
        qualityLabel: "Audio only",
        ext: "m4a",
        filesize: audioFmt.filesize,
        type: "audio",
      });
    }

    const durationSec = Math.round(data.duration ?? 0);
    const duration = `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, "0")}`;

    return NextResponse.json({
      videoId: data.id,
      title: data.title,
      author: data.uploader ?? data.channel ?? "",
      thumbnail: data.thumbnail ?? null,
      duration,
      viewCount: String(data.view_count ?? 0),
      formats,
    });
  } catch (err) {
    console.error("[youtube/info]", err);
    const message = err instanceof Error ? err.message : "Failed to fetch video info.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
