import { NextRequest } from "next/server";
import { spawn } from "child_process";

const YTDLP = process.env.YTDLP_PATH || "yt-dlp";

export const runtime = "nodejs";

function isValidYouTubeUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?(youtube\.com\/(watch|shorts)|youtu\.be\/)/.test(url);
}

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const formatId = request.nextUrl.searchParams.get("formatId");
  const ext = request.nextUrl.searchParams.get("ext") ?? "mp4";
  const filename = request.nextUrl.searchParams.get("filename") ?? "youtube-video";

  if (!url || !formatId) return new Response("URL and formatId required", { status: 400 });
  if (!isValidYouTubeUrl(url)) return new Response("Invalid YouTube URL", { status: 400 });

  const safeName = filename.replace(/[^a-zA-Z0-9_\-. ]/g, "_").slice(0, 80);
  const isAudio = ext === "m4a";
  const contentType = isAudio ? "audio/mp4" : "video/mp4";

  const proc = spawn(YTDLP, [
    "-f", formatId,
    "--no-playlist",
    "-o", "-",
    url,
  ], { windowsHide: true });

  const readable = new ReadableStream({
    start(controller) {
      proc.on("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "ENOENT") {
          controller.error(new Error("yt-dlp not found. Install yt-dlp and ensure it is available in PATH, or set YTDLP_PATH."));
          return;
        }
        controller.error(err);
      });
      proc.stdout.on("data", (chunk: Buffer) => controller.enqueue(chunk));
      proc.stdout.on("end", () => controller.close());
      proc.stdout.on("error", (err: Error) => controller.error(err));
      proc.stderr.on("data", (d: Buffer) => console.error("[yt-dlp]", d.toString()));
      proc.on("error", (err: Error) => controller.error(err));
    },
    cancel() {
      proc.kill("SIGTERM");
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${safeName}.${ext}"`,
      "Cache-Control": "no-store",
      "Transfer-Encoding": "chunked",
    },
  });
}
