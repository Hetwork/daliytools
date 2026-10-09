"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import ToolEditorial from "../../_components/tool-editorial";
import { toolEditorialData } from "../../_data/tool-editorial-data";
import {
  CLIPARTS,
  IconConfig,
  IconShape,
  IconEffect,
  renderIcon,
  generateAllAssetsZip,
  generateIcoFile,
} from "./icon-kitchen-canvas";

const COLOR_PRESETS = [
  { name: "Solar Red", c1: "#ec3013", c2: "#9e1906" },
  { name: "Obsidian Ink", c1: "#201e1d", c2: "#11100f" },
  { name: "Electric Indigo", c1: "#4f46e5", c2: "#3730a3" },
  { name: "Ocean Blue", c1: "#0284c7", c2: "#0369a1" },
  { name: "Emerald Mint", c1: "#059669", c2: "#047857" },
  { name: "Neon Amber", c1: "#d97706", c2: "#b45309" },
  { name: "Cyber Purple", c1: "#9333ea", c2: "#6b21a8" },
  { name: "Pure White", c1: "#ffffff", c2: "#e5e5e5" },
];

export default function IconKitchenContent() {
  const [config, setConfig] = useState<IconConfig>({
    foregroundType: "clipart",
    clipartId: "rocket",
    imageSrc: null,
    text: "D",
    fontFamily: "var(--font-archivo), sans-serif",
    isBold: true,
    padding: 24,
    foreColor: "#ffffff",
    useForeTint: false,
    bgType: "solid",
    bgColor1: "#ec3013",
    bgColor2: "#9e1906",
    gradientAngle: 135,
    shape: "squircle",
    cornerRadius: 22,
    effect: "elevate",
    badgeText: "",
    badgeColor: "#201e1d",
  });

  const [activeTab, setActiveTab] = useState<"foreground" | "background" | "shape" | "preview">("foreground");
  const [previewPlatform, setPreviewPlatform] = useState<"android" | "ios" | "web" | "matrix">("android");
  const [downloading, setDownloading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [, startTransition] = useTransition();

  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  // Secondary mockup canvases
  const androidMockupRef = useRef<HTMLCanvasElement>(null);
  const iosMockupRef = useRef<HTMLCanvasElement>(null);
  const webMockupRef = useRef<HTMLCanvasElement>(null);
  const matrix16Ref = useRef<HTMLCanvasElement>(null);
  const matrix32Ref = useRef<HTMLCanvasElement>(null);
  const matrix64Ref = useRef<HTMLCanvasElement>(null);
  const matrix128Ref = useRef<HTMLCanvasElement>(null);
  const matrix512Ref = useRef<HTMLCanvasElement>(null);

  // Load custom image when imageSrc changes
  useEffect(() => {
    if (!config.imageSrc) {
      loadedImageRef.current = null;
      triggerRender();
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      loadedImageRef.current = img;
      triggerRender();
    };
    img.src = config.imageSrc;
  }, [config.imageSrc]);

  // Main canvas render loop
  const triggerRender = () => {
    startTransition(async () => {
      const img = loadedImageRef.current;
      if (mainCanvasRef.current) {
        await renderIcon(mainCanvasRef.current, config, 512, img);
      }
      if (androidMockupRef.current) {
        await renderIcon(androidMockupRef.current, config, 192, img, "circle");
      }
      if (iosMockupRef.current) {
        await renderIcon(iosMockupRef.current, config, 192, img, "squircle");
      }
      if (webMockupRef.current) {
        await renderIcon(webMockupRef.current, config, 64, img, "square");
      }
      // Density matrix
      if (matrix16Ref.current) await renderIcon(matrix16Ref.current, config, 16, img);
      if (matrix32Ref.current) await renderIcon(matrix32Ref.current, config, 32, img);
      if (matrix64Ref.current) await renderIcon(matrix64Ref.current, config, 64, img);
      if (matrix128Ref.current) await renderIcon(matrix128Ref.current, config, 128, img);
      if (matrix512Ref.current) await renderIcon(matrix512Ref.current, config, 512, img);
    });
  };

  useEffect(() => {
    triggerRender();
  }, [config]);

  // Reveal observer
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        setConfig((prev) => ({
          ...prev,
          foregroundType: "image",
          imageSrc: ev.target!.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const downloadZip = async (platform: "all" | "android" | "ios" | "web") => {
    setDownloading(true);
    try {
      const blob = await generateAllAssetsZip(config, loadedImageRef.current, platform);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `icon-kitchen-${platform}-assets.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate zip", err);
    } finally {
      setDownloading(false);
    }
  };

  const downloadSinglePng = () => {
    if (!mainCanvasRef.current) return;
    const a = document.createElement("a");
    a.href = mainCanvasRef.current.toDataURL("image/png");
    a.download = "app-icon-1024.png";
    a.click();
  };

  const downloadFaviconIco = async () => {
    const icoData = await generateIcoFile(config, loadedImageRef.current);
    const blob = new Blob([icoData as Uint8Array<ArrayBuffer>], { type: "image/x-icon" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favicon.ico";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyHtmlTags = () => {
    const snippet = `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${config.bgColor1}">`;
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <main
      className="noise"
      style={{
        background: "var(--bg)",
        color: "var(--ink)",
        fontFamily: "var(--font-archivo), sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <SiteHeader active="Tools" />

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          paddingTop: "clamp(32px, 5vw, 56px)",
          paddingBottom: "clamp(48px, 8vw, 96px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          className="reveal-fast"
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            opacity: 0.45,
            marginBottom: 24,
          }}
        >
          <Link href="/tools" className="ink-hover">
            All Tools
          </Link>{" "}
          / Generators / Icon Kitchen
        </p>

        <div className="reveal">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span
              style={{
                fontSize: "clamp(11px, 1.4vw, 13px)",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "var(--on-solid)",
                background: "var(--red)",
                padding: "6px 14px",
                textTransform: "uppercase",
              }}
            >
              Live
            </span>
            <span style={{ fontSize: "clamp(11px, 1.4vw, 13px)", fontWeight: 500, opacity: 0.5 }}>
              100% Client-side &bull; Zero Server Uploads
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 5.5vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Icon Kitchen
          </h1>
          <p
            style={{
              marginTop: 14,
              fontSize: "clamp(15px, 1.8vw, 19px)",
              lineHeight: 1.6,
              opacity: 0.7,
              maxWidth: 700,
            }}
          >
            Design, preview, and generate production-ready app icons for Android, iOS, and Web Favicons in every
            required density and format with a single click.
          </p>
        </div>

        {/* ── WORKSPACE GRID ── */}
        <div
          style={{
            marginTop: "clamp(36px, 5vw, 56px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 36,
            alignItems: "start",
          }}
        >
          {/* ── LEFT: CONTROLS PANEL ── */}
          <div
            style={{
              border: "2px solid var(--border)",
              background: "var(--surface)",
              boxShadow: "4px 4px 0 var(--border)",
            }}
          >
            {/* Tabs Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                borderBottom: "2px solid var(--border)",
                background: "var(--bg)",
              }}
            >
              {[
                { id: "foreground", label: "1. Graphic" },
                { id: "background", label: "2. Background" },
                { id: "shape", label: "3. Shape & FX" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  style={{
                    padding: "14px 12px",
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    border: "none",
                    borderRight: tab.id !== "shape" ? "2px solid var(--border)" : "none",
                    background: activeTab === tab.id ? "var(--surface)" : "transparent",
                    color: activeTab === tab.id ? "var(--red)" : "var(--ink)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
              {/* TAB 1: FOREGROUND */}
              {activeTab === "foreground" && (
                <>
                  {/* Source Type Selector */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        opacity: 0.5,
                        marginBottom: 8,
                      }}
                    >
                      Foreground Source
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {[
                        { id: "clipart", label: "Clipart" },
                        { id: "image", label: "Custom Image" },
                        { id: "text", label: "Text" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setConfig((p) => ({ ...p, foregroundType: t.id as any }))}
                          style={{
                            padding: "10px",
                            fontWeight: 700,
                            fontSize: 12,
                            border: "2px solid var(--border)",
                            background: config.foregroundType === t.id ? "var(--solid)" : "var(--surface)",
                            color: config.foregroundType === t.id ? "var(--on-solid)" : "var(--ink)",
                            cursor: "pointer",
                          }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode-specific source */}
                  {config.foregroundType === "clipart" && (
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          opacity: 0.5,
                          marginBottom: 8,
                        }}
                      >
                        Choose Clipart Symbol
                      </label>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(5, 1fr)",
                          gap: 8,
                          maxHeight: 180,
                          overflowY: "auto",
                          padding: 4,
                        }}
                      >
                        {CLIPARTS.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setConfig((p) => ({ ...p, clipartId: item.id }))}
                            title={item.name}
                            style={{
                              aspectRatio: "1/1",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "2px solid var(--border)",
                              background: config.clipartId === item.id ? "var(--red)" : "#f8f8f8",
                              color: config.clipartId === item.id ? "var(--on-solid)" : "var(--ink)",
                              cursor: "pointer",
                              padding: 8,
                            }}
                          >
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                              <path d={item.svgPath} />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {config.foregroundType === "image" && (
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          opacity: 0.5,
                          marginBottom: 8,
                        }}
                      >
                        Upload SVG / PNG / JPG
                      </label>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "24px 16px",
                          border: "2px dashed var(--border)",
                          background: "var(--surface-soft)",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: 13, color: "var(--red)" }}>Choose file</span>
                        <span style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>
                          Transparent PNG or SVG recommended
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/svg+xml,image/jpeg,image/webp"
                          onChange={handleFileUpload}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  )}

                  {config.foregroundType === "text" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            opacity: 0.5,
                            marginBottom: 6,
                          }}
                        >
                          Monogram Character(s)
                        </label>
                        <input
                          type="text"
                          maxLength={3}
                          value={config.text}
                          onChange={(e) => setConfig((p) => ({ ...p, text: e.target.value }))}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "2px solid var(--border)",
                            fontWeight: 800,
                            fontSize: 18,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Padding / Scaling Slider */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <label
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          opacity: 0.5,
                        }}
                      >
                        Padding (Safe Zone)
                      </label>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{config.padding}%</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={45}
                      value={config.padding}
                      onChange={(e) => setConfig((p) => ({ ...p, padding: Number(e.target.value) }))}
                      style={{ width: "100%", accentColor: "var(--red)" }}
                    />
                  </div>

                  {/* Foreground Color Tinting */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <label
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          opacity: 0.5,
                        }}
                      >
                        Custom Foreground Color
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={config.useForeTint}
                          onChange={(e) => setConfig((p) => ({ ...p, useForeTint: e.target.checked }))}
                          style={{ accentColor: "var(--red)" }}
                        />
                        Enable Tint
                      </label>
                    </div>
                    {config.useForeTint && (
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input
                          type="color"
                          value={config.foreColor}
                          onChange={(e) => setConfig((p) => ({ ...p, foreColor: e.target.value }))}
                          style={{
                            width: 44,
                            height: 38,
                            border: "2px solid var(--border)",
                            padding: 0,
                            cursor: "pointer",
                          }}
                        />
                        <input
                          type="text"
                          value={config.foreColor}
                          onChange={(e) => setConfig((p) => ({ ...p, foreColor: e.target.value }))}
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            border: "2px solid var(--border)",
                            fontFamily: "monospace",
                            fontWeight: 700,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* TAB 2: BACKGROUND */}
              {activeTab === "background" && (
                <>
                  {/* Background Type */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        opacity: 0.5,
                        marginBottom: 8,
                      }}
                    >
                      Background Style
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {[
                        { id: "solid", label: "Solid" },
                        { id: "gradient", label: "Gradient" },
                        { id: "transparent", label: "None" },
                      ].map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setConfig((p) => ({ ...p, bgType: b.id as any }))}
                          style={{
                            padding: "10px",
                            fontWeight: 700,
                            fontSize: 12,
                            border: "2px solid var(--border)",
                            background: config.bgType === b.id ? "var(--solid)" : "var(--surface)",
                            color: config.bgType === b.id ? "var(--on-solid)" : "var(--ink)",
                            cursor: "pointer",
                          }}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preset Swatches */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        opacity: 0.5,
                        marginBottom: 8,
                      }}
                    >
                      Quick Palette Presets
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() =>
                            setConfig((p) => ({
                              ...p,
                              bgColor1: preset.c1,
                              bgColor2: preset.c2,
                            }))
                          }
                          title={preset.name}
                          style={{
                            height: 38,
                            border: "2px solid var(--border)",
                            background: `linear-gradient(135deg, ${preset.c1}, ${preset.c2})`,
                            cursor: "pointer",
                            position: "relative",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Color pickers */}
                  {config.bgType !== "transparent" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            opacity: 0.5,
                            marginBottom: 6,
                          }}
                        >
                          {config.bgType === "gradient" ? "Start Color" : "Background Color"}
                        </label>
                        <div style={{ display: "flex", gap: 10 }}>
                          <input
                            type="color"
                            value={config.bgColor1}
                            onChange={(e) => setConfig((p) => ({ ...p, bgColor1: e.target.value }))}
                            style={{ width: 44, height: 38, border: "2px solid var(--border)", padding: 0 }}
                          />
                          <input
                            type="text"
                            value={config.bgColor1}
                            onChange={(e) => setConfig((p) => ({ ...p, bgColor1: e.target.value }))}
                            style={{ flex: 1, padding: "8px 12px", border: "2px solid var(--border)", fontFamily: "monospace" }}
                          />
                        </div>
                      </div>

                      {config.bgType === "gradient" && (
                        <>
                          <div>
                            <label
                              style={{
                                display: "block",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                opacity: 0.5,
                                marginBottom: 6,
                              }}
                            >
                              End Color
                            </label>
                            <div style={{ display: "flex", gap: 10 }}>
                              <input
                                type="color"
                                value={config.bgColor2}
                                onChange={(e) => setConfig((p) => ({ ...p, bgColor2: e.target.value }))}
                                style={{ width: 44, height: 38, border: "2px solid var(--border)", padding: 0 }}
                              />
                              <input
                                type="text"
                                value={config.bgColor2}
                                onChange={(e) => setConfig((p) => ({ ...p, bgColor2: e.target.value }))}
                                style={{ flex: 1, padding: "8px 12px", border: "2px solid var(--border)", fontFamily: "monospace" }}
                              />
                            </div>
                          </div>

                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                              <label
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  opacity: 0.5,
                                }}
                              >
                                Gradient Angle
                              </label>
                              <span style={{ fontSize: 12, fontWeight: 700 }}>{config.gradientAngle}&deg;</span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={360}
                              value={config.gradientAngle}
                              onChange={(e) => setConfig((p) => ({ ...p, gradientAngle: Number(e.target.value) }))}
                              style={{ width: "100%", accentColor: "var(--red)" }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* TAB 3: SHAPE & EFFECTS */}
              {activeTab === "shape" && (
                <>
                  {/* Shape Selector */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        opacity: 0.5,
                        marginBottom: 8,
                      }}
                    >
                      Icon Shape
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {[
                        { id: "squircle", label: "Squircle (iOS)" },
                        { id: "circle", label: "Circle" },
                        { id: "rounded-rect", label: "Rounded" },
                        { id: "square", label: "Square" },
                        { id: "teardrop", label: "Teardrop" },
                        { id: "hexagon", label: "Hexagon" },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setConfig((p) => ({ ...p, shape: s.id as IconShape }))}
                          style={{
                            padding: "10px 6px",
                            fontWeight: 700,
                            fontSize: 11,
                            border: "2px solid var(--border)",
                            background: config.shape === s.id ? "var(--solid)" : "var(--surface)",
                            color: config.shape === s.id ? "var(--on-solid)" : "var(--ink)",
                            cursor: "pointer",
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Corner radius for rounded rect */}
                  {config.shape === "rounded-rect" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <label
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            opacity: 0.5,
                          }}
                        >
                          Corner Radius
                        </label>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{config.cornerRadius}%</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={50}
                        value={config.cornerRadius}
                        onChange={(e) => setConfig((p) => ({ ...p, cornerRadius: Number(e.target.value) }))}
                        style={{ width: "100%", accentColor: "var(--red)" }}
                      />
                    </div>
                  )}

                  {/* Visual Effects */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        opacity: 0.5,
                        marginBottom: 8,
                      }}
                    >
                      Visual Effect
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                      {[
                        { id: "none", label: "None" },
                        { id: "elevate", label: "Elevate" },
                        { id: "shadow", label: "Drop Shadow" },
                        { id: "cast-shadow", label: "Cast 45° Shadow" },
                        { id: "score", label: "Score Line" },
                      ].map((eff) => (
                        <button
                          key={eff.id}
                          onClick={() => setConfig((p) => ({ ...p, effect: eff.id as IconEffect }))}
                          style={{
                            padding: "10px",
                            fontWeight: 700,
                            fontSize: 12,
                            border: "2px solid var(--border)",
                            background: config.effect === eff.id ? "var(--solid)" : "var(--surface)",
                            color: config.effect === eff.id ? "var(--on-solid)" : "var(--ink)",
                            cursor: "pointer",
                          }}
                        >
                          {eff.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Corner Badge / Ribbon */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        opacity: 0.5,
                        marginBottom: 6,
                      }}
                    >
                      Corner Ribbon Badge (Optional)
                    </label>
                    <div style={{ display: "flex", gap: 10 }}>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="e.g. BETA, PRO"
                        value={config.badgeText}
                        onChange={(e) => setConfig((p) => ({ ...p, badgeText: e.target.value }))}
                        style={{ flex: 1, padding: "8px 12px", border: "2px solid var(--border)", fontWeight: 700 }}
                      />
                      <input
                        type="color"
                        value={config.badgeColor}
                        onChange={(e) => setConfig((p) => ({ ...p, badgeColor: e.target.value }))}
                        style={{ width: 44, height: 38, border: "2px solid var(--border)", padding: 0 }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── RIGHT: LIVE PREVIEW & DOWNLOADS ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Preview Card */}
            <div
              style={{
                border: "2px solid var(--border)",
                background: "var(--surface)",
                boxShadow: "4px 4px 0 var(--border)",
                padding: 24,
              }}
            >
              {/* Preview Platform Switcher */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  borderBottom: "2px solid var(--surface-soft)",
                  paddingBottom: 16,
                  marginBottom: 20,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { id: "android", label: "Android Mockup" },
                  { id: "ios", label: "iOS Mockup" },
                  { id: "web", label: "Web Favicon" },
                  { id: "matrix", label: "Size Matrix" },
                ].map((plat) => (
                  <button
                    key={plat.id}
                    onClick={() => setPreviewPlatform(plat.id as any)}
                    style={{
                      padding: "8px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      border: "2px solid var(--border)",
                      background: previewPlatform === plat.id ? "var(--solid)" : "var(--surface)",
                      color: previewPlatform === plat.id ? "var(--on-solid)" : "var(--ink)",
                      cursor: "pointer",
                    }}
                  >
                    {plat.label}
                  </button>
                ))}
              </div>

              {/* Mockup Canvas Containers */}
              <div
                style={{
                  minHeight: 280,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    previewPlatform === "ios"
                      ? "linear-gradient(135deg, #1e293b, #0f172a)"
                      : previewPlatform === "android"
                      ? "radial-gradient(circle at center, #334155, #1e293b)"
                      : previewPlatform === "web"
                      ? "#1e293b"
                      : "#f8f8f8",
                  padding: 24,
                  borderRadius: 4,
                  position: "relative",
                }}
              >
                {/* 1. ANDROID MOCKUP — always mounted, hidden when inactive */}
                <div style={{ display: previewPlatform === "android" ? "flex" : "none", gap: 32, alignItems: "center", justifyContent: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: 110,
                        height: 110,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.4))",
                      }}
                    >
                      <canvas ref={androidMockupRef} style={{ width: 100, height: 100 }} />
                    </div>
                    <p style={{ color: "var(--on-solid)", fontSize: 11, fontWeight: 700, marginTop: 10, opacity: 0.8 }}>
                      Round Launcher
                    </p>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: 110,
                        height: 110,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.4))",
                      }}
                    >
                      <canvas ref={mainCanvasRef} style={{ width: 100, height: 100 }} />
                    </div>
                    <p style={{ color: "var(--on-solid)", fontSize: 11, fontWeight: 700, marginTop: 10, opacity: 0.8 }}>
                      Adaptive Standard
                    </p>
                  </div>
                </div>

                {/* 2. IOS MOCKUP — always mounted, hidden when inactive */}
                <div style={{ display: previewPlatform === "ios" ? "block" : "none", textAlign: "center" }}>
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.45))",
                      margin: "0 auto",
                    }}
                  >
                    <canvas ref={iosMockupRef} style={{ width: 110, height: 110 }} />
                  </div>
                  <p style={{ color: "var(--on-solid)", fontSize: 12, fontWeight: 700, marginTop: 12 }}>
                    App Store & Home Screen
                  </p>
                </div>

                {/* 3. WEB FAVICON — always mounted, hidden when inactive */}
                <div style={{ display: previewPlatform === "web" ? "block" : "none", width: "100%", maxWidth: 380 }}>
                  <div
                    style={{
                      background: "#0f172a",
                      borderRadius: "8px 8px 0 0",
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      borderBottom: "1px solid #334155",
                    }}
                  >
                    <canvas ref={webMockupRef} style={{ width: 18, height: 18, borderRadius: 2 }} />
                    <span style={{ color: "var(--on-solid)", fontSize: 12, fontWeight: 600 }}>
                      My Web Application &bull; Tab
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#1e293b",
                      padding: "16px",
                      color: "#94a3b8",
                      fontSize: 11,
                      borderRadius: "0 0 8px 8px",
                      textAlign: "center",
                    }}
                  >
                    Includes `favicon.ico`, `apple-touch-icon`, and `manifest.json`.
                  </div>
                </div>

                {/* 4. SIZE MATRIX — always mounted, hidden when inactive */}
                <div style={{ display: previewPlatform === "matrix" ? "flex" : "none", gap: 20, alignItems: "flex-end", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center" }}>
                    <canvas ref={matrix16Ref} style={{ width: 16, height: 16 }} />
                    <p style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>16px</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <canvas ref={matrix32Ref} style={{ width: 32, height: 32 }} />
                    <p style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>32px</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <canvas ref={matrix64Ref} style={{ width: 64, height: 64 }} />
                    <p style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>64px</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <canvas ref={matrix128Ref} style={{ width: 96, height: 96 }} />
                    <p style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>128px</p>
                  </div>
                </div>
              </div>

              {/* ── EXPORT BUTTONS ── */}
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Full Bundle Download */}
                <button
                  onClick={() => downloadZip("all")}
                  disabled={downloading}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "16px 20px",
                    fontSize: 14,
                  }}
                >
                  {downloading ? "Generating Assets..." : "Download All Icons (.ZIP)"}
                  <span className="btn-arrow">&rarr;</span>
                </button>

                {/* Platform-specific downloads */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  <button
                    onClick={() => downloadZip("android")}
                    disabled={downloading}
                    className="btn"
                    style={{ fontSize: 12, padding: "10px 8px", textAlign: "center" }}
                  >
                    Android ZIP
                  </button>
                  <button
                    onClick={() => downloadZip("ios")}
                    disabled={downloading}
                    className="btn"
                    style={{ fontSize: 12, padding: "10px 8px", textAlign: "center" }}
                  >
                    iOS ZIP
                  </button>
                  <button
                    onClick={() => downloadZip("web")}
                    disabled={downloading}
                    className="btn"
                    style={{ fontSize: 12, padding: "10px 8px", textAlign: "center" }}
                  >
                    Web Favicons
                  </button>
                </div>

                {/* Quick single files */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                  <button
                    onClick={downloadSinglePng}
                    className="btn"
                    style={{ fontSize: 11, padding: "8px", textAlign: "center" }}
                  >
                    Download 1024px PNG
                  </button>
                  <button
                    onClick={downloadFaviconIco}
                    className="btn"
                    style={{ fontSize: 11, padding: "8px", textAlign: "center" }}
                  >
                    Download .ICO File
                  </button>
                </div>
              </div>
            </div>

            {/* HTML Integration Snippet */}
            <div
              style={{
                border: "2px solid var(--border)",
                background: "var(--solid)",
                color: "var(--on-solid)",
                padding: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  HTML Favicon Snippet
                </span>
                <button
                  onClick={copyHtmlTags}
                  style={{
                    background: "var(--red)",
                    color: "var(--on-solid)",
                    border: "none",
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {copiedCode ? "Copied!" : "Copy Tags"}
                </button>
              </div>
              <pre
                style={{
                  margin: 0,
                  fontSize: 11,
                  fontFamily: "monospace",
                  lineHeight: 1.6,
                  color: "#94a3b8",
                  overflowX: "auto",
                }}
              >
{`<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${config.bgColor1}">`}
              </pre>
            </div>
          </div>
        </div>
        <ToolEditorial toolName="Icon Kitchen" {...toolEditorialData["icon-kitchen"]} />
      </section>

      <SiteFooter />
    </main>
  );
}
