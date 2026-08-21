"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import { clampRange, formatTime } from "./audio-utils";

interface AudioFileData {
  file: File;
  url: string;
  duration: number;
}

function createWavBlob(audioBuffer: AudioBuffer): Blob {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const bitsPerSample = 16;
  const blockAlign = numberOfChannels * (bitsPerSample / 8);
  const dataLength = audioBuffer.length * blockAlign;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, dataLength, true);

  let offset = 44;
  const channelData = Array.from({ length: numberOfChannels }, (_, index) =>
    audioBuffer.getChannelData(index)
  );

  for (let i = 0; i < audioBuffer.length; i += 1) {
    for (let ch = 0; ch < numberOfChannels; ch += 1) {
      const sample = clampRange(channelData[ch][i] ?? 0, -1, 1);
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export default function AudioCutterContent() {
  const [audioFile, setAudioFile] = useState<AudioFileData | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

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
      if (audioFile) URL.revokeObjectURL(audioFile.url);
      if (trimmedUrl) URL.revokeObjectURL(trimmedUrl);
    };
  }, [audioFile, trimmedUrl]);

  const handleFile = (input: File | null) => {
    if (!input || !input.type.startsWith("audio/")) {
      setError("Please choose a valid audio file.");
      return;
    }

    const url = URL.createObjectURL(input);
    const tempAudio = new Audio(url);
    tempAudio.preload = "metadata";

    tempAudio.onloadedmetadata = () => {
      setAudioFile({ file: input, url, duration: tempAudio.duration || 0 });
      setStartTime(0);
      setEndTime(tempAudio.duration || 0);
      setTrimmedUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
      setError("");
    };

    tempAudio.onerror = () => {
      setError("That audio file could not be loaded. Please try a different file.");
      URL.revokeObjectURL(url);
    };
  };

  const resetSelection = () => {
    if (!audioFile) return;
    setStartTime(0);
    setEndTime(audioFile.duration);
    setTrimmedUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
  };

  const handleStartChange = (value: number) => {
    if (!audioFile) return;
    const nextStart = clampRange(value, 0, endTime - 0.05);
    setStartTime(nextStart);
    if (audioRef.current) audioRef.current.currentTime = nextStart;
  };

  const handleEndChange = (value: number) => {
    if (!audioFile) return;
    const nextEnd = clampRange(value, startTime + 0.05, audioFile.duration);
    setEndTime(nextEnd);
    if (audioRef.current) audioRef.current.currentTime = nextEnd;
  };

  const previewSelection = () => {
    if (!audioFile || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = audioFile.url;
    audio.currentTime = startTime;
    audio.play();

    const stopAtEnd = () => {
      if (audio.currentTime >= endTime) {
        audio.pause();
        audio.currentTime = startTime;
        audio.removeEventListener("timeupdate", stopAtEnd);
      }
    };

    audio.addEventListener("timeupdate", stopAtEnd);
  };

  const downloadTrimmed = () => {
    if (!audioFile) return;
    const anchor = document.createElement("a");
    anchor.href = trimmedUrl ?? "";
    anchor.download = `${audioFile.file.name.replace(/\.[^/.]+$/, "") || "audio"}-trimmed.wav`;
    anchor.click();
  };

  async function exportTrimmedAudio() {
    if (!audioFile) return;

    setIsProcessing(true);
    setError("");

    try {
      const arrayBuffer = await audioFile.file.arrayBuffer();
      const audioContext = new AudioContext();
      const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
      const startSample = Math.max(0, Math.floor(startTime * decoded.sampleRate));
      const endSample = Math.min(decoded.length, Math.floor(endTime * decoded.sampleRate));
      const sliceLength = Math.max(1, endSample - startSample);

      const outputBuffer = new AudioBuffer({
        length: sliceLength,
        numberOfChannels: decoded.numberOfChannels,
        sampleRate: decoded.sampleRate,
      });

      for (let channel = 0; channel < decoded.numberOfChannels; channel += 1) {
        const sourceData = decoded.getChannelData(channel).subarray(startSample, endSample);
        outputBuffer.copyToChannel(sourceData, channel);
      }

      const blob = createWavBlob(outputBuffer);
      const nextUrl = URL.createObjectURL(blob);
      setTrimmedUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return nextUrl;
      });

      const anchor = document.createElement("a");
      anchor.href = nextUrl;
      anchor.download = `${audioFile.file.name.replace(/\.[^/.]+$/, "") || "audio"}-trimmed.wav`;
      anchor.click();

      await audioContext.close();
    } catch (loadError) {
      console.error(loadError);
      setError("The browser couldn’t process this audio file. Try a smaller or more common format like MP3 or WAV.");
    } finally {
      setIsProcessing(false);
    }
  }

  const selectionLength = Math.max(0, endTime - startTime);

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
        <p className="reveal-fast" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.45, marginBottom: 28 }}>
          <Link href="/tools" className="ink-hover">All Tools</Link> / Media Tools / Audio Cutter
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 700, letterSpacing: "0.18em", color: "#f3f2f2", background: "#ec3013", padding: "6px 14px", textTransform: "uppercase" }}>Live</span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>Runs completely in your browser</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Audio Cutter</h1>
          <p style={{ marginTop: 18, fontSize: "clamp(15px, 1.8vw, 19px)", lineHeight: 1.7, opacity: 0.7, maxWidth: 610 }}>
            Upload any audio file, drag the selection handles, preview the exact slice, and export the trimmed clip as a WAV file.
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px, 6vw, 64px)" }}>
          {!audioFile ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click();
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFile(event.dataTransfer.files?.[0] ?? null);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
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
              <div style={{ width: 56, height: 56, border: "2px solid #201e1d", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>A</div>
              <p style={{ fontSize: "clamp(17px, 2.2vw, 22px)", fontWeight: 700, marginBottom: 8 }}>Drop your audio file here</p>
              <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", opacity: 0.55 }}>MP3, WAV, OGG, M4A, AAC</p>
              <input ref={fileInputRef} type="file" accept="audio/*" hidden onChange={(event) => handleFile(event.target.files?.[0] ?? null)} />
            </div>
          ) : (
            <div className="fade-in-up" style={{ border: "2px solid #201e1d", padding: "clamp(20px, 3vw, 28px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
                <div style={{ width: 48, height: 48, border: "2px solid #201e1d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>A</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 16 }}>{audioFile.file.name}</p>
                  <p style={{ opacity: 0.5, fontSize: 13 }}>Duration: {formatTime(audioFile.duration)}</p>
                </div>
                <button type="button" onClick={() => { if (audioFile) URL.revokeObjectURL(audioFile.url); setAudioFile(null); setTrimmedUrl((current) => { if (current) URL.revokeObjectURL(current); return null; }); }} className="ink-hover" style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.45, fontFamily: "inherit" }}>Remove</button>
              </div>

              <audio ref={audioRef} src={audioFile.url} controls style={{ width: "100%", marginBottom: 16 }} />

              <div style={{ display: "grid", gap: 20 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, gap: 12, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45 }}>
                    <span>Start</span>
                    <span>{formatTime(startTime)}</span>
                  </div>
                  <input type="range" min={0} max={Math.max(0, audioFile.duration)} step={0.01} value={startTime} onChange={(event) => handleStartChange(Number(event.target.value))} style={{ width: "100%", accentColor: "#ec3013" }} />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, gap: 12, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.45 }}>
                    <span>End</span>
                    <span>{formatTime(endTime)}</span>
                  </div>
                  <input type="range" min={0} max={Math.max(0, audioFile.duration)} step={0.01} value={endTime} onChange={(event) => handleEndChange(Number(event.target.value))} style={{ width: "100%", accentColor: "#ec3013" }} />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 22 }}>
                <button type="button" onClick={previewSelection} className="btn btn-primary" style={{ padding: "12px 20px", fontSize: 13 }}>
                  Preview selection
                </button>
                <button type="button" onClick={resetSelection} className="ink-hover" style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, opacity: 0.5, fontFamily: "inherit", cursor: "pointer" }}>Reset</button>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, fontSize: 13, fontWeight: 700 }}>
                  <span style={{ opacity: 0.5 }}>Selected</span>
                  <span style={{ color: "#ec3013" }}>{formatTime(selectionLength)}</span>
                </div>
              </div>

              {error && (
                <p style={{ marginTop: 18, color: "#ec3013", fontWeight: 600 }}>{error}</p>
              )}

              <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <button type="button" onClick={exportTrimmedAudio} disabled={isProcessing || selectionLength <= 0} className="btn btn-primary" style={{ padding: "14px 26px" }}>
                  {isProcessing ? "Processing…" : "Export trimmed WAV"}
                </button>
                {trimmedUrl && (
                  <button type="button" onClick={downloadTrimmed} className="btn" style={{ padding: "14px 26px" }}>
                    Download output
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="reveal" style={{ marginTop: "clamp(56px, 8vw, 88px)", borderTop: "2px solid #201e1d", paddingTop: 32 }}>
          <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 16 }}>How It Works</p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", lineHeight: 1.75, opacity: 0.75, maxWidth: 700 }}>
            The tool decodes the uploaded audio in the browser, slices the waveform to the chosen start and end times, and re-encodes it as a WAV with the original sample rate intact. No server uploads, no cloud processing, and no storage beyond your browser session.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
