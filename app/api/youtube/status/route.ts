import { NextResponse } from "next/server";
import { spawn } from "child_process";

const YTDLP = process.env.YTDLP_PATH || "yt-dlp";

export const runtime = "nodejs";

function checkYtdlp(): Promise<{ ok: true; version: string } | { ok: false; error: string }> {
  return new Promise((resolve) => {
    const proc = spawn(YTDLP, ["--version"], { windowsHide: true });

    let out = "";
    let err = "";

    const timer = setTimeout(() => {
      proc.kill();
      resolve({ ok: false, error: "yt-dlp check timed out." });
    }, 5000);

    proc.on("error", (spawnErr: NodeJS.ErrnoException) => {
      clearTimeout(timer);
      if (spawnErr.code === "ENOENT") {
        resolve({ ok: false, error: "yt-dlp is not installed or not available in PATH." });
        return;
      }
      resolve({ ok: false, error: spawnErr.message || "Failed to start yt-dlp." });
    });

    proc.stdout.on("data", (chunk: Buffer) => {
      out += chunk.toString();
    });

    proc.stderr.on("data", (chunk: Buffer) => {
      err += chunk.toString();
    });

    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve({ ok: true, version: out.trim() || "unknown" });
        return;
      }

      resolve({ ok: false, error: err.trim() || `yt-dlp exited with code ${code}` });
    });
  });
}

export async function GET() {
  const result = await checkYtdlp();

  if (result.ok) {
    return NextResponse.json({
      ok: true,
      version: result.version,
      executable: YTDLP,
    });
  }

  return NextResponse.json(
    {
      ok: false,
      error: result.error,
      executable: YTDLP,
      installHint: "Install yt-dlp and add it to PATH, or set YTDLP_PATH.",
      windowsHint: "On Windows you can run: winget install yt-dlp.yt-dlp",
    },
    { status: 503 }
  );
}
