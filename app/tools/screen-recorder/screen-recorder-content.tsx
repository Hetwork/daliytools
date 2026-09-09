"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolAdRail from "../../_components/tool-ad-rail";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";

type OutputFormat = "webm" | "mp4";

interface AudioMixResult {
  track: MediaStreamTrack | null;
  cleanup: () => void;
}

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function getSupportedMimeTypes(format: OutputFormat): string[] {
  if (format === "mp4") {
    return [
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
      "video/mp4;codecs=h264,aac",
      "video/mp4",
    ];
  }

  return [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
}

function getPreferredMimeType(format: OutputFormat): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  const candidates = getSupportedMimeTypes(format);
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? null;
}

function createMixedAudioTrack(displayStream: MediaStream, micStream: MediaStream | null): AudioMixResult {
  const inputTracks: MediaStreamTrack[] = [
    ...displayStream.getAudioTracks(),
    ...(micStream ? micStream.getAudioTracks() : []),
  ];

  if (inputTracks.length === 0) {
    return { track: null, cleanup: () => {} };
  }

  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();
  const nodes: MediaStreamAudioSourceNode[] = [];

  inputTracks.forEach((track) => {
    const sourceStream = new MediaStream([track]);
    const source = audioContext.createMediaStreamSource(sourceStream);
    source.connect(destination);
    nodes.push(source);
  });

  const mixedTrack = destination.stream.getAudioTracks()[0] ?? null;

  return {
    track: mixedTrack,
    cleanup: () => {
      nodes.forEach((node) => node.disconnect());
      void audioContext.close();
    },
  };
}

export default function ScreenRecorderContent() {
  const [includeMic, setIncludeMic] = useState(false);
  const [format, setFormat] = useState<OutputFormat>("webm");
  const [isStarting, setIsStarting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordedType, setRecordedType] = useState("");
  const [recordedBytes, setRecordedBytes] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const previewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const displayStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const outputStreamRef = useRef<MediaStream | null>(null);
  const audioCleanupRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);

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
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
      stopStreams();
    };
  }, [recordedUrl]);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    preview.srcObject = previewStream;
    if (previewStream) {
      preview.muted = true;
      void preview.play().catch(() => undefined);
    }
  }, [previewStream]);

  const mp4Supported = getPreferredMimeType("mp4") !== null;

  function stopStreams() {
    mediaRecorderRef.current = null;

    if (previewRef.current) {
      previewRef.current.srcObject = null;
    }
    setPreviewStream(null);

    outputStreamRef.current?.getTracks().forEach((track) => track.stop());
    outputStreamRef.current = null;

    displayStreamRef.current?.getTracks().forEach((track) => track.stop());
    displayStreamRef.current = null;

    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    micStreamRef.current = null;

    audioCleanupRef.current?.();
    audioCleanupRef.current = null;
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      stopStreams();
    }

    setIsRecording(false);
  }

  async function startRecording() {
    if (isRecording || isStarting) return;

    setError(null);
    setInfo(null);
    setIsStarting(true);

    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(null);
      setRecordedType("");
      setRecordedBytes(0);
    }

    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getDisplayMedia) {
        throw new Error("This browser does not support screen recording.");
      }

      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { ideal: 30, max: 60 },
        },
        audio: true,
      });
      displayStreamRef.current = displayStream;

      let micStream: MediaStream | null = null;
      if (includeMic) {
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          micStreamRef.current = micStream;
        } catch {
          setInfo("Microphone permission was denied. Recording will continue with screen audio only.");
        }
      }

      const composedStream = new MediaStream();
      displayStream.getVideoTracks().forEach((track) => composedStream.addTrack(track));

      const audioMix = createMixedAudioTrack(displayStream, micStream);
      audioCleanupRef.current = audioMix.cleanup;
      if (audioMix.track) composedStream.addTrack(audioMix.track);

      outputStreamRef.current = composedStream;
      setPreviewStream(composedStream);

      const preferredType = getPreferredMimeType(format);
      const recorder = preferredType
        ? new MediaRecorder(composedStream, { mimeType: preferredType })
        : new MediaRecorder(composedStream);

      mediaRecorderRef.current = recorder;
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = () => {
        const actualType = recorder.mimeType || preferredType || "video/webm";
        const blob = new Blob(chunks, { type: actualType });
        const url = URL.createObjectURL(blob);

        setRecordedUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          return url;
        });
        setRecordedType(actualType);
        setRecordedBytes(blob.size);

        stopStreams();
      };

      recorder.onerror = () => {
        setError("Recording failed due to a browser media error. Please try again.");
        stopRecording();
      };

      displayStream.getVideoTracks()[0]?.addEventListener("ended", () => {
        stopRecording();
      });

      recorder.start(1000);
      startedAtRef.current = Date.now();
      setElapsedSeconds(0);
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }, 250);

      setIsRecording(true);
    } catch (startError) {
      console.error(startError);
      setError("Could not start recording. Please allow screen access and try again.");
      stopStreams();
    } finally {
      setIsStarting(false);
    }
  }

  function downloadRecording() {
    if (!recordedUrl) return;
    const extension = recordedType.includes("mp4") ? "mp4" : "webm";
    const anchor = document.createElement("a");
    anchor.href = recordedUrl;
    anchor.download = `screen-recording-${new Date().toISOString().replace(/[:.]/g, "-")}.${extension}`;
    anchor.click();
  }

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

      <div className="tool-ad-layout">
        <ToolAdRail />

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
        <p
          className="reveal-fast"
          style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}
        >
          <Link href="/tools" className="ink-hover">All Tools</Link> / Media Tools / Screen Recorder
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>No uploads. Everything stays in your browser.</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Screen & Audio Recorder</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 680 }}>
            Record your full screen, a window, or a tab in one click. Optionally include microphone audio and download instantly as WebM or MP4 depending on browser support.
          </p>
        </div>

        <div className="fade-in-up" style={{ marginTop: "clamp(36px, 6vw, 56px)", border: "2px solid #201e1d", padding: "clamp(20px, 3vw, 30px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={includeMic}
                onChange={(event) => setIncludeMic(event.target.checked)}
                disabled={isRecording || isStarting}
                style={{ width: 16, height: 16, accentColor: "#ec3013" }}
              />
              Include microphone
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600 }}>
              <span>Output format</span>
              <select
                value={format}
                onChange={(event) => setFormat(event.target.value as OutputFormat)}
                disabled={isRecording || isStarting}
                style={{
                  border: "2px solid #201e1d",
                  background: "transparent",
                  color: "#201e1d",
                  padding: "8px 10px",
                  fontFamily: "inherit",
                  fontWeight: 600,
                }}
              >
                <option value="webm">WebM (best support)</option>
                <option value="mp4" disabled={!mp4Supported}>MP4 {mp4Supported ? "" : "(unsupported in this browser)"}</option>
              </select>
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            {!isRecording ? (
              <button type="button" onClick={startRecording} disabled={isStarting} className="btn btn-primary">
                {isStarting ? "Starting…" : "Start recording"}
              </button>
            ) : (
              <button type="button" onClick={stopRecording} className="btn btn-primary" style={{ background: "#201e1d", color: "#f3f2f2" }}>
                Stop recording
              </button>
            )}

            <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.65 }}>
              {isRecording ? `Recording: ${formatDuration(elapsedSeconds)}` : "Ready"}
            </span>

            {isRecording && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#ec3013" }}>
                <span className="pulse-dot" /> Live capture
              </span>
            )}
          </div>

          {format === "mp4" && !mp4Supported && (
            <p style={{ marginTop: 14, fontSize: 13, color: "#ec3013", fontWeight: 600 }}>
              MP4 recording is not available in this browser. Use WebM or try Safari for MP4 support.
            </p>
          )}

          {error && (
            <p style={{ marginTop: 14, fontSize: 13, color: "#ec3013", fontWeight: 600 }}>{error}</p>
          )}

          {info && (
            <p style={{ marginTop: 14, fontSize: 13, opacity: 0.7, fontWeight: 600 }}>{info}</p>
          )}
        </div>

        <div className="fade-in-up" style={{ marginTop: 20, border: "2px solid #201e1d", background: "#201e1d", minHeight: 280, position: "relative", display: "grid", placeItems: "center" }}>
          <video ref={previewRef} autoPlay playsInline muted style={{ width: "100%", maxHeight: 520, objectFit: "contain", visibility: previewStream ? "visible" : "hidden" }} />
          {!previewStream && (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", color: "#f3f2f2", padding: "24px" }}>
              <div>
                <p style={{ fontSize: "clamp(17px, 2.4vw, 22px)", fontWeight: 700, marginBottom: 8 }}>Live preview appears here</p>
                <p style={{ opacity: 0.7, fontSize: 14 }}>After you click start, pick a screen, tab, or window in the browser chooser.</p>
              </div>
            </div>
          )}
        </div>

        {recordedUrl && (
          <div className="fade-in-up" style={{ marginTop: 22, border: "2px solid #201e1d", padding: "clamp(20px, 3vw, 28px)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
              <h2 style={{ fontSize: "clamp(20px, 2.8vw, 28px)", fontWeight: 800, letterSpacing: "-0.01em" }}>Recording Ready</h2>
              <button type="button" onClick={downloadRecording} className="btn btn-primary">
                Download recording <span className="btn-arrow">&darr;</span>
              </button>
            </div>

            <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 14 }}>
              {recordedType || "video/webm"} &middot; {formatFileSize(recordedBytes)}
            </p>

            <video src={recordedUrl} controls playsInline style={{ width: "100%", border: "2px solid #201e1d" }} />
          </div>
        )}

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 760 }}>
            This tool uses getDisplayMedia to capture your chosen screen source and MediaRecorder to encode the stream locally in your browser. If microphone is enabled, mic and system audio are mixed in memory and stored only in your active session.
          </p>
        </div>
        <ToolEditorial toolName="Screen Recorder" {...toolEditorialData["screen-recorder"]} />
      </section>

              <ToolAdRail />
      </div>

      <SiteFooter />
    </main>
  );
}
