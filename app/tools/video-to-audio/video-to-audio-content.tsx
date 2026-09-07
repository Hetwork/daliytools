"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";
import {
  decodeAudioFromVideo,
  encodeAudioBufferToMp3,
  encodeAudioBufferToWav,
  formatFileSize,
  formatTime,
  clamp,
} from "./audio-extract-utils";

interface VideoMetadata {
  file: File;
  url: string;
  duration: number;
  width: number;
  height: number;
}

interface ExtractedAudioResult {
  blob: Blob;
  url: string;
  format: "mp3" | "wav";
  duration: number;
  size: number;
  fileName: string;
}

function triggerBrowserDownload(url: string, fileName: string) {
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = fileName;
  a.setAttribute("download", fileName);
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    try {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    } catch {}
  }, 1000);
}

export default function VideoToAudioContent() {
  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState("");

  // Extraction options
  const [format, setFormat] = useState<"mp3" | "wav">("mp3");
  const [kbps, setKbps] = useState<128 | 192 | 256 | 320>(192);
  const [channels, setChannels] = useState<1 | 2>(2);
  const [gain, setGain] = useState<number>(1.0);
  const [isTrimming, setIsTrimming] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  // Result state
  const [result, setResult] = useState<ExtractedAudioResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const audioPreviewRef = useRef<HTMLAudioElement>(null);

  // Reveal animation on scroll
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

  // Cleanup object URLs on unmount or file reset
  useEffect(() => {
    return () => {
      if (video) URL.revokeObjectURL(video.url);
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [video, result]);

  const handleVideoFile = (file: File | null) => {
    if (!file) return;

    // Check if it's a video file
    if (!file.type.startsWith("video/") && !/\.(mp4|webm|mov|mkv|avi|m4v|wmv|flv)$/i.test(file.name)) {
      setError("Please select a valid video file (MP4, WebM, MOV, MKV, AVI, etc.).");
      return;
    }

    setError("");
    if (video) URL.revokeObjectURL(video.url);
    if (result) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }

    const url = URL.createObjectURL(file);
    const tempVideo = document.createElement("video");
    tempVideo.src = url;
    tempVideo.preload = "metadata";

    tempVideo.onloadedmetadata = () => {
      const duration = tempVideo.duration || 0;
      setVideo({
        file,
        url,
        duration,
        width: tempVideo.videoWidth,
        height: tempVideo.videoHeight,
      });
      setStartTime(0);
      setEndTime(Math.max(0.1, duration));
      setIsTrimming(false);
    };

    tempVideo.onerror = () => {
      setError("Unable to open this video format in your browser. Please try another file.");
      URL.revokeObjectURL(url);
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleVideoFile(droppedFile);
    }
  };

  const handleExtractAudio = async () => {
    if (!video) return;

    setIsProcessing(true);
    setError("");
    setProgress(5);
    setProgressStage("Initializing audio decoder...");

    try {
      const audioBuffer = await decodeAudioFromVideo(video.file, (pct, stage) => {
        setProgress(pct);
        setProgressStage(stage);
      });

      const effectiveStart = isTrimming ? clamp(startTime, 0, audioBuffer.duration) : 0;
      const effectiveEnd = isTrimming
        ? clamp(endTime, effectiveStart + 0.1, audioBuffer.duration)
        : audioBuffer.duration;

      let outputBlob: Blob;
      const rawName = video.file.name;
      const lastDot = rawName.lastIndexOf(".");
      const baseName = (lastDot > 0 ? rawName.substring(0, lastDot) : rawName).trim() || "extracted-audio";
      let outputFileName = "";

      if (format === "mp3") {
        setProgressStage(`Encoding to MP3 (${kbps} kbps)...`);
        outputBlob = await encodeAudioBufferToMp3(audioBuffer, {
          kbps,
          channels,
          gain,
          startTime: effectiveStart,
          endTime: effectiveEnd,
          onProgress: (p) => {
            setProgress(p);
          },
        });
        outputFileName = `${baseName}.mp3`;
      } else {
        setProgress(85);
        setProgressStage("Packaging uncompressed 16-bit WAV PCM...");
        outputBlob = encodeAudioBufferToWav(audioBuffer, {
          channels,
          gain,
          startTime: effectiveStart,
          endTime: effectiveEnd,
        });
        setProgress(100);
        outputFileName = `${baseName}.wav`;
      }

      const resultUrl = URL.createObjectURL(outputBlob);
      const outputDuration = Math.max(0, effectiveEnd - effectiveStart);

      // Automatically trigger browser download right away
      triggerBrowserDownload(resultUrl, outputFileName);

      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return {
          blob: outputBlob,
          url: resultUrl,
          format,
          duration: outputDuration,
          size: outputBlob.size,
          fileName: outputFileName,
        };
      });

      setProgress(100);
      setProgressStage("Extraction complete! File downloaded.");
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to extract audio from video.";
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleAudioPlay = () => {
    if (!audioPreviewRef.current) return;
    if (isPlayingAudio) {
      audioPreviewRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPreviewRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    triggerBrowserDownload(result.url, result.fileName);
  };

  const resetAll = () => {
    if (video) URL.revokeObjectURL(video.url);
    if (result) URL.revokeObjectURL(result.url);
    setVideo(null);
    setResult(null);
    setError("");
    setProgress(0);
    setProgressStage("");
    setIsPlayingAudio(false);
  };

  return (
    <main
      className="noise"
      style={{
        background: "#f3f2f2",
        color: "#201e1d",
        fontFamily: "var(--font-archivo), sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <SiteHeader active="Tools" />

      <section
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "0 32px",
          paddingTop: "clamp(32px, 6vw, 64px)",
          paddingBottom: "clamp(48px, 8vw, 96px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Breadcrumb */}
        <p
          className="reveal-fast"
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            opacity: 0.45,
            marginBottom: 28,
          }}
        >
          <Link href="/tools" className="ink-hover">
            All Tools
          </Link>{" "}
          / Media Tools / Video to Audio
        </p>

        {/* Header Title Section */}
        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span
              style={{
                fontSize: "clamp(11px, 1.4vw, 13px)",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#f3f2f2",
                background: "#ec3013",
                padding: "6px 14px",
                textTransform: "uppercase",
              }}
            >
              Live
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.5,
              }}
            >
              Client-Side &amp; 100% Private
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 5.5vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              fontWeight: 900,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Video to Audio
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 2vw, 19px)",
              lineHeight: 1.5,
              maxWidth: 720,
              opacity: 0.72,
              marginBottom: 40,
            }}
          >
            Extract crystal-clear audio from any video in seconds. Convert MP4, WebM, MOV, or MKV files
            to MP3 or lossless WAV. Runs completely inside your web browser with zero server uploads.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            className="reveal-fast"
            style={{
              background: "#ffebe8",
              border: "1px solid #ec3013",
              color: "#ec3013",
              padding: "16px 20px",
              marginBottom: 28,
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                color: "#ec3013",
                fontSize: 16,
              }}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Work Area */}
        {!video ? (
          /* Upload State */
          <div
            className="reveal"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: isDragging ? "#e9e7e7" : "#ffffff",
              border: isDragging ? "2px dashed #ec3013" : "2px dashed rgba(0, 0, 0, 0.18)",
              padding: "clamp(48px, 8vw, 80px) 24px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v"
              style={{ display: "none" }}
              onChange={(e) => handleVideoFile(e.target.files?.[0] ?? null)}
            />

            {/* Video icon */}
            <div
              style={{
                width: 72,
                height: 72,
                margin: "0 auto 24px",
                background: "#f3f2f2",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#201e1d",
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2.18" />
                <line x1="7" y1="4" x2="7" y2="20" />
                <line x1="17" y1="4" x2="17" y2="20" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="2" y1="8" x2="7" y2="8" />
                <line x1="2" y1="16" x2="7" y2="16" />
                <line x1="17" y1="8" x2="22" y2="8" />
                <line x1="17" y1="16" x2="22" y2="16" />
              </svg>
            </div>

            <h2
              style={{
                fontSize: "clamp(20px, 3vw, 26px)",
                fontWeight: 800,
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
              }}
            >
              Choose or Drag a Video File Here
            </h2>

            <p style={{ fontSize: 14, opacity: 0.6, maxWidth: 440, margin: "0 auto 28px", lineHeight: 1.6 }}>
              Supports MP4, WebM, MOV, MKV, AVI, and other standard video formats. Files are processed locally on your
              device.
            </p>

            <span
              style={{
                display: "inline-block",
                background: "#201e1d",
                color: "#f3f2f2",
                padding: "12px 28px",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Select Video from Device
            </span>

            <div
              style={{
                marginTop: 32,
                display: "flex",
                justifyContent: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {["MP4", "WEBM", "MOV", "MKV", "AVI"].map((ext) => (
                <span
                  key={ext}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    padding: "4px 8px",
                    background: "#f3f2f2",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* Video Selected & Extraction Configuration State */
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Video Preview & Details Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                padding: 24,
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 16,
                  marginBottom: 20,
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  paddingBottom: 16,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#ec3013",
                    }}
                  >
                    Uploaded Video
                  </span>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      marginTop: 4,
                      wordBreak: "break-all",
                    }}
                  >
                    {video.file.name}
                  </h3>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(0,0,0,0.2)",
                      padding: "8px 16px",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                    }}
                  >
                    Change Video
                  </button>
                  <button
                    onClick={resetAll}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(0,0,0,0.2)",
                      padding: "8px 16px",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                      color: "#ec3013",
                    }}
                  >
                    Reset
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v"
                    style={{ display: "none" }}
                    onChange={(e) => handleVideoFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>

              {/* Grid: Video Player + Metadata badges */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 24,
                  alignItems: "center",
                }}
              >
                <div>
                  <video
                    ref={videoPreviewRef}
                    src={video.url}
                    controls
                    playsInline
                    style={{
                      width: "100%",
                      maxHeight: 240,
                      background: "#000",
                      borderRadius: 4,
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: "#f8f8f8",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ opacity: 0.6 }}>Video Duration</span>
                    <strong style={{ fontWeight: 700 }}>{formatTime(video.duration)}</strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: "#f8f8f8",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ opacity: 0.6 }}>File Size</span>
                    <strong style={{ fontWeight: 700 }}>{formatFileSize(video.file.size)}</strong>
                  </div>

                  {video.width > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        background: "#f8f8f8",
                        fontSize: 13,
                      }}
                    >
                      <span style={{ opacity: 0.6 }}>Resolution</span>
                      <strong style={{ fontWeight: 700 }}>
                        {video.width} × {video.height}
                      </strong>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: "#f8f8f8",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ opacity: 0.6 }}>Privacy</span>
                    <span style={{ color: "#008a00", fontWeight: 700 }}>100% Local / In-Browser</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Settings Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                padding: 28,
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 24,
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  paddingBottom: 12,
                }}
              >
                Extraction Settings
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
                {/* Format selection */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 8,
                      opacity: 0.7,
                    }}
                  >
                    Output Audio Format
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setFormat("mp3")}
                      style={{
                        padding: "12px 16px",
                        background: format === "mp3" ? "#201e1d" : "#f8f8f8",
                        color: format === "mp3" ? "#f3f2f2" : "#201e1d",
                        border: format === "mp3" ? "1px solid #201e1d" : "1px solid rgba(0,0,0,0.12)",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      MP3
                      <span style={{ display: "block", fontSize: 10, opacity: 0.7, marginTop: 2 }}>
                        Universal / Compact
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormat("wav")}
                      style={{
                        padding: "12px 16px",
                        background: format === "wav" ? "#201e1d" : "#f8f8f8",
                        color: format === "wav" ? "#f3f2f2" : "#201e1d",
                        border: format === "wav" ? "1px solid #201e1d" : "1px solid rgba(0,0,0,0.12)",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      WAV
                      <span style={{ display: "block", fontSize: 10, opacity: 0.7, marginTop: 2 }}>
                        Lossless Studio PCM
                      </span>
                    </button>
                  </div>
                </div>

                {/* MP3 Bitrate (only shown if mp3) */}
                {format === "mp3" ? (
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 8,
                        opacity: 0.7,
                      }}
                    >
                      Audio Bitrate
                    </label>
                    <select
                      value={kbps}
                      onChange={(e) => setKbps(Number(e.target.value) as 128 | 192 | 256 | 320)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        background: "#f8f8f8",
                        border: "1px solid rgba(0,0,0,0.16)",
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      <option value={128}>128 kbps (Standard Quality / Smallest Size)</option>
                      <option value={192}>192 kbps (High Quality — Recommended)</option>
                      <option value={256}>256 kbps (Very High Quality)</option>
                      <option value={320}>320 kbps (Maximum Fidelity / Studio)</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 8,
                        opacity: 0.7,
                      }}
                    >
                      Audio Bit Depth
                    </label>
                    <div
                      style={{
                        padding: "12px 14px",
                        background: "#f8f8f8",
                        border: "1px solid rgba(0,0,0,0.12)",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      16-bit PCM Linear (Lossless Uncompressed)
                    </div>
                  </div>
                )}

                {/* Audio Channels */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 8,
                      opacity: 0.7,
                    }}
                  >
                    Audio Channels
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setChannels(2)}
                      style={{
                        padding: "10px 14px",
                        background: channels === 2 ? "#201e1d" : "#f8f8f8",
                        color: channels === 2 ? "#f3f2f2" : "#201e1d",
                        border: channels === 2 ? "1px solid #201e1d" : "1px solid rgba(0,0,0,0.12)",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      Stereo (2 Ch)
                    </button>
                    <button
                      type="button"
                      onClick={() => setChannels(1)}
                      style={{
                        padding: "10px 14px",
                        background: channels === 1 ? "#201e1d" : "#f8f8f8",
                        color: channels === 1 ? "#f3f2f2" : "#201e1d",
                        border: channels === 1 ? "1px solid #201e1d" : "1px solid rgba(0,0,0,0.12)",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      Mono (1 Ch)
                    </button>
                  </div>
                </div>

                {/* Volume Boost / Gain */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 8,
                      opacity: 0.7,
                    }}
                  >
                    Volume Level: {Math.round(gain * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={gain}
                    onChange={(e) => setGain(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "#ec3013" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.5, marginTop: 4 }}>
                    <span>50% (Quiet)</span>
                    <span>100% (Original)</span>
                    <span>200% (Boost)</span>
                  </div>
                </div>
              </div>

              {/* Trimming Section */}
              <div
                style={{
                  marginTop: 28,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <strong style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Audio Trimming
                    </strong>
                    <p style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>
                      Extract the complete audio track or select a custom segment.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsTrimming(!isTrimming)}
                    style={{
                      background: isTrimming ? "#ec3013" : "#f8f8f8",
                      color: isTrimming ? "#ffffff" : "#201e1d",
                      border: isTrimming ? "1px solid #ec3013" : "1px solid rgba(0,0,0,0.18)",
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                    }}
                  >
                    {isTrimming ? "Trim Mode Active" : "Enable Trim"}
                  </button>
                </div>

                {isTrimming && (
                  <div
                    style={{
                      background: "#f8f8f8",
                      padding: 16,
                      border: "1px solid rgba(0,0,0,0.08)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                          Start Time: {formatTime(startTime)}
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={Math.max(0, endTime - 0.1)}
                          step={0.1}
                          value={startTime}
                          onChange={(e) => setStartTime(parseFloat(e.target.value))}
                          style={{ width: "100%", accentColor: "#ec3013" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                          End Time: {formatTime(endTime)}
                        </label>
                        <input
                          type="range"
                          min={Math.min(video.duration, startTime + 0.1)}
                          max={video.duration}
                          step={0.1}
                          value={endTime}
                          onChange={(e) => setEndTime(parseFloat(e.target.value))}
                          style={{ width: "100%", accentColor: "#ec3013" }}
                        />
                      </div>
                    </div>

                    <div style={{ fontSize: 12, opacity: 0.7, display: "flex", justifyContent: "space-between" }}>
                      <span>Selected Segment Duration: <strong>{formatTime(Math.max(0, endTime - startTime))}</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          setStartTime(0);
                          setEndTime(video.duration);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ec3013",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Reset Range to Full Video
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Extract Action Button */}
              <div style={{ marginTop: 32 }}>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleExtractAudio}
                  style={{
                    width: "100%",
                    background: isProcessing ? "#555" : "#ec3013",
                    color: "#ffffff",
                    border: "none",
                    padding: "18px 24px",
                    fontSize: 15,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 14px rgba(236, 48, 19, 0.3)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {isProcessing ? "Extracting Audio..." : `Extract ${format.toUpperCase()} Audio`}
                </button>
              </div>

              {/* Processing Progress Bar */}
              {isProcessing && (
                <div style={{ marginTop: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    <span>{progressStage}</span>
                    <span>{progress}%</span>
                  </div>
                  <div style={{ height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${progress}%`,
                        background: "#ec3013",
                        transition: "width 0.2s ease",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Extracted Audio Result Card */}
            {result && (
              <div
                className="reveal-fast"
                style={{
                  background: "#ffffff",
                  border: "2px solid #201e1d",
                  padding: 32,
                  boxShadow: "0 12px 36px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      background: "#008a00",
                      color: "#ffffff",
                      fontSize: 11,
                      fontWeight: 800,
                      padding: "4px 10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Downloaded
                  </span>
                  <div>
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Audio Successfully Extracted &amp; Downloaded!
                    </h3>
                    <p style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
                      Your browser download has started automatically. You can also listen to the preview below or click Download again.
                    </p>
                  </div>
                </div>

                {/* Audio File Info Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                    background: "#f8f8f8",
                    padding: 16,
                    marginBottom: 24,
                    fontSize: 13,
                  }}
                >
                  <div>
                    <span style={{ opacity: 0.6, display: "block" }}>File Name</span>
                    <strong style={{ wordBreak: "break-all" }}>{result.fileName}</strong>
                  </div>
                  <div>
                    <span style={{ opacity: 0.6, display: "block" }}>Format</span>
                    <strong>{result.format.toUpperCase()}</strong>
                  </div>
                  <div>
                    <span style={{ opacity: 0.6, display: "block" }}>Audio Length</span>
                    <strong>{formatTime(result.duration)}</strong>
                  </div>
                  <div>
                    <span style={{ opacity: 0.6, display: "block" }}>File Size</span>
                    <strong>{formatFileSize(result.size)}</strong>
                  </div>
                </div>

                {/* Audio Player Preview */}
                <div
                  style={{
                    background: "#201e1d",
                    color: "#f3f2f2",
                    padding: "16px 20px",
                    marginBottom: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <audio
                    ref={audioPreviewRef}
                    src={result.url}
                    onTimeUpdate={() => {
                      if (audioPreviewRef.current) {
                        setAudioCurrentTime(audioPreviewRef.current.currentTime);
                      }
                    }}
                    onEnded={() => setIsPlayingAudio(false)}
                    onPlay={() => setIsPlayingAudio(true)}
                    onPause={() => setIsPlayingAudio(false)}
                  />

                  <button
                    type="button"
                    onClick={toggleAudioPlay}
                    style={{
                      background: "#ec3013",
                      border: "none",
                      color: "#ffffff",
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                    aria-label={isPlayingAudio ? "Pause" : "Play"}
                  >
                    {isPlayingAudio ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4, opacity: 0.8 }}>
                      <span>{formatTime(audioCurrentTime)}</span>
                      <span>{formatTime(result.duration)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={result.duration || 1}
                      step={0.1}
                      value={audioCurrentTime}
                      onChange={(e) => {
                        const nextTime = parseFloat(e.target.value);
                        setAudioCurrentTime(nextTime);
                        if (audioPreviewRef.current) {
                          audioPreviewRef.current.currentTime = nextTime;
                        }
                      }}
                      style={{ width: "100%", accentColor: "#ec3013" }}
                    />
                  </div>
                </div>

                {/* Download and Share Buttons */}
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={handleDownload}
                    style={{
                      flex: 1,
                      minWidth: 240,
                      background: "#201e1d",
                      color: "#f3f2f2",
                      border: "none",
                      padding: "16px 28px",
                      fontSize: 14,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download {result.fileName}
                  </button>

                  <button
                    type="button"
                    onClick={resetAll}
                    style={{
                      background: "transparent",
                      color: "#201e1d",
                      border: "1px solid rgba(0,0,0,0.2)",
                      padding: "16px 24px",
                      fontSize: 13,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                    }}
                  >
                    Convert Another Video
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Editorial Section (AdSense & SEO compliance) */}
        <div style={{ marginTop: 64 }}>
          <ToolEditorial toolName="Video to Audio" {...toolEditorialData["video-to-audio"]} />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
