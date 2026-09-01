"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

interface ExtractedFrame { url: string; timestamp: number; index: number }
interface VideoFile { file: File; url: string; duration: number }

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function VideoToFramesContent() {
  const [video, setVideo] = useState<VideoFile | null>(null);
  const [frames, setFrames] = useState<ExtractedFrame[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [interval, setIntervalVal] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-fast").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (video) URL.revokeObjectURL(video.url);
      frames.forEach((f) => URL.revokeObjectURL(f.url));
    };
  }, []);

  function handleFile(file: File | null) {
    if (!file || !file.type.startsWith("video/")) return;
    if (video) URL.revokeObjectURL(video.url);
    frames.forEach((f) => URL.revokeObjectURL(f.url));
    setFrames([]);
    const url = URL.createObjectURL(file);
    const vid = document.createElement("video");
    vid.src = url;
    vid.onloadedmetadata = () => {
      setVideo({ file, url, duration: vid.duration });
    };
  }

  async function seekVideoToTime(videoEl: HTMLVideoElement, targetTime: number): Promise<void> {
    if (!Number.isFinite(targetTime)) return;
    if (Math.abs(videoEl.currentTime - targetTime) < 0.05) return;

    await new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        videoEl.removeEventListener("seeked", onSeeked);
        videoEl.removeEventListener("error", onError);
      };
      const onSeeked = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error("Video seek failed"));
      };

      videoEl.addEventListener("seeked", onSeeked, { once: true });
      videoEl.addEventListener("error", onError, { once: true });
      videoEl.currentTime = targetTime;
    });
  }

  async function extractFrames() {
    if (!video || !videoRef.current || !canvasRef.current) return;
    setIsExtracting(true);
    setProgress(0);
    setErrorMsg("");
    frames.forEach((f) => URL.revokeObjectURL(f.url));
    setFrames([]);

    const vid = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    vid.muted = true;
    vid.playsInline = true;
    vid.pause();

    const timestamps: number[] = [];
    for (let t = 0; t <= video.duration; t += interval) timestamps.push(t);
    if (timestamps.length === 0 || timestamps[timestamps.length - 1] < video.duration - 0.1) timestamps.push(video.duration);

    const extracted: ExtractedFrame[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      const t = timestamps[i];
      try {
        await seekVideoToTime(vid, t);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        canvas.width = vid.videoWidth;
        canvas.height = vid.videoHeight;
        ctx.drawImage(vid, 0, 0);
        const blob = await new Promise<Blob | null>((res) => {
          canvas.toBlob((nextBlob) => res(nextBlob), "image/jpeg", 0.92);
        });
        if (blob) {
          extracted.push({ url: URL.createObjectURL(blob), timestamp: t, index: i });
        }
      } catch {
        setErrorMsg("Frame extraction was interrupted. Please try a smaller interval or a different video.");
        setIsExtracting(false);
        return;
      }
      setProgress(Math.round(((i + 1) / timestamps.length) * 100));
    }
    setFrames(extracted);
    setIsExtracting(false);
  }

  async function downloadAll() {
    if (frames.length === 0) return;
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (const frame of frames) {
      const res = await fetch(frame.url);
      const blob = await res.blob();
      zip.file(`frame_${String(frame.index + 1).padStart(4, "0")}_${formatTime(frame.timestamp).replace(":", "m")}s.jpg`, blob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `frames_${video?.file.name ?? "video"}.zip`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadFrame(frame: ExtractedFrame) {
    const link = document.createElement("a");
    link.href = frame.url;
    link.download = `frame_${String(frame.index + 1).padStart(4, "0")}_${formatTime(frame.timestamp).replace(":", "m")}s.jpg`;
    link.click();
  }

  const estimatedFrames = video ? Math.ceil(video.duration / interval) + 1 : 0;

  return (
    <main
      className="noise"
      style={{ background: "#f3f2f2", color: "#201e1d", fontFamily: "var(--font-archivo), sans-serif", minHeight: "100vh", position: "relative" }}
    >
      <SiteHeader active="Tools" />
      <video ref={videoRef} src={video?.url} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <section
        style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", paddingTop: "clamp(32px, 6vw, 64px)", paddingBottom: "clamp(48px, 8vw, 96px)", position: "relative", zIndex: 1 }}
      >
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Image Tools / Video to Frames
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs entirely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Video to Frames</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 560 }}>
            Upload a video, set the frame extraction interval, then download all frames as individual images or a ZIP archive.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          {!video && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files?.[0] ?? null); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              className="fade-in-up"
              style={{
                border: `2px dashed ${isDragging ? "#ec3013" : "#201e1d"}`,
                background: isDragging ? "rgba(236,48,19,0.05)" : "transparent",
                padding: "clamp(48px, 8vw, 80px) 24px",
                textAlign: "center",
                transition: "border-color 0.25s ease, background 0.25s ease",
              }}
            >
              <div style={{ width: 56, height: 56, border: "2px solid #201e1d", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>VID</div>
              <p style={{ fontSize: "clamp(17px, 2.2vw, 22px)", fontWeight: 700, marginBottom: 8 }}>Drag & drop your video here</p>
              <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", opacity: 0.55 }}>or click to browse — MP4, WebM, MOV</p>
              <input ref={fileInputRef} type="file" accept="video/*" hidden onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            </div>
          )}

          {video && (
            <div className="fade-in-up">
              {/* Settings */}
              <div style={{ border: "2px solid #201e1d", padding: "clamp(20px, 3vw, 28px)", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, border: "2px solid #201e1d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>VID</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 16 }}>{video.file.name}</p>
                    <p style={{ opacity: 0.5, fontSize: 13 }}>Duration: {formatTime(video.duration)}</p>
                  </div>
                  <button type="button" onClick={() => { if (video) URL.revokeObjectURL(video.url); setVideo(null); setFrames([]); }} className="ink-hover" style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.45, fontFamily: "inherit" }}>Remove</button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45 }}>Extract every</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#ec3013" }}>{interval}s · ~{estimatedFrames} frames</p>
                    </div>
                    <input type="range" min={0.5} max={10} step={0.5} value={interval} onChange={(e) => setIntervalVal(Number(e.target.value))} style={{ width: "100%", accentColor: "#ec3013" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.4, marginTop: 4 }}>
                      <span>0.5s (more frames)</span>
                      <span>10s (fewer frames)</span>
                    </div>
                  </div>
                  <button type="button" onClick={extractFrames} disabled={isExtracting} className="btn btn-primary">
                    {isExtracting ? "Extracting…" : "Extract Frames"}
                  </button>
                </div>

                {isExtracting && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, opacity: 0.6, marginBottom: 8 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="pulse-dot" /> Extracting frames&hellip;
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div style={{ height: 8, background: "#e2e0e0" }}>
                      <div style={{ height: "100%", background: "#ec3013", width: `${progress}%`, transition: "width 0.2s ease" }} />
                    </div>
                  </div>
                )}
              </div>

              {frames.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{frames.length} frames extracted</p>
                    <button type="button" onClick={downloadAll} className="btn btn-primary">
                      Download all as ZIP <span className="btn-arrow">&darr;</span>
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
                    {frames.map((frame) => (
                      <div key={frame.index} style={{ border: "2px solid #201e1d", position: "relative", cursor: "pointer" }} onClick={() => downloadFrame(frame)}>
                        <img src={frame.url} alt={`Frame ${frame.index + 1}`} style={{ display: "block", width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(32,30,29,0.75)", color: "#f3f2f2", fontSize: 10, fontWeight: 700, padding: "3px 6px", textAlign: "center" }}>
                          {formatTime(frame.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, opacity: 0.4, marginTop: 10 }}>Click any frame to download it individually</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 640 }}>
            The video is seeked to each timestamp using the browser&apos;s video API. At every stop, the current frame is
            drawn onto a hidden canvas and exported as a JPEG. All frames are collected in memory and can be downloaded
            individually or bundled into a ZIP using JSZip — no server involved.
          </p>
        </div>
        <ToolEditorial toolName="Video to Frames" {...toolEditorialData["video-to-frames"]} />
      </section>

      <SiteFooter />
    </main>
  );
}
