import JSZip from "jszip";

export type IconShape = "squircle" | "circle" | "rounded-rect" | "square" | "teardrop" | "hexagon";
export type IconEffect = "none" | "elevate" | "shadow" | "cast-shadow" | "score";
export type ForegroundType = "clipart" | "image" | "text";

export interface IconConfig {
  foregroundType: ForegroundType;
  clipartId: string;
  imageSrc: string | null;
  text: string;
  fontFamily: string;
  isBold: boolean;
  padding: number; // 0 to 60 percentage
  foreColor: string; // empty or rgba for custom tint
  useForeTint: boolean;
  bgType: "solid" | "gradient" | "transparent";
  bgColor1: string;
  bgColor2: string;
  gradientAngle: number; // in degrees
  shape: IconShape;
  cornerRadius: number; // 0 to 50 percent
  effect: IconEffect;
  badgeText: string;
  badgeColor: string;
}

export const CLIPARTS: { id: string; name: string; svgPath: string }[] = [
  {
    id: "android",
    name: "Android",
    svgPath:
      "M12 2a1 1 0 0 1 .9 1.45L11.5 6h1a8 8 0 0 1 8 8v1a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1v-1a8 8 0 0 1 8-8h1L11.1 3.45A1 1 0 0 1 12 2zm-4 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM4 17h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z",
  },
  {
    id: "apple",
    name: "Apple",
    svgPath:
      "M15.5 2.5a3.5 3.5 0 0 0-2.3 1.2 3.2 3.2 0 0 0-.8 2.3 3 3 0 0 0 2.4-1.2 3.3 3.3 0 0 0 .7-2.3zm2.8 5.3c-1.6-.1-3 1-3.8 1s-2-.9-3.4-.9C9.3 7.9 7.6 9 6.6 10.7c-2 3.5-.5 8.7 1.4 11.5 1 1.4 2.1 2.9 3.6 2.8 1.4-.1 2-.9 3.7-.9s2.2.9 3.7.8c1.5-.1 2.5-1.4 3.4-2.8 1.1-1.6 1.5-3.1 1.6-3.2-.1-.1-3-1.2-3.1-4.7 0-3 2.4-4.4 2.5-4.5-1.4-2.1-3.6-2.4-4.3-2.4z",
  },
  {
    id: "rocket",
    name: "Rocket",
    svgPath:
      "M12 2.5c3.5 0 7.5 4 7.5 9.5 0 3-1.5 5.5-3 7l-1-2.5h-7l-1 2.5c-1.5-1.5-3-4-3-7C4.5 6.5 8.5 2.5 12 2.5zm0 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 19.5l-2.5 2a1 1 0 0 0 .5 1.5l3.5-1-1.5-2.5zm10 0 1.5 2.5 3.5 1a1 1 0 0 0 .5-1.5l-2.5-2z",
  },
  {
    id: "sparkles",
    name: "Sparkles",
    svgPath:
      "M12 2l1.8 5.8L19.6 9l-4.7 4.2 1.4 6.3L12 16.2l-4.3 3.3 1.4-6.3L4.4 9l5.8-1.2L12 2zm7-1l.7 2.3L22 4l-1.8 1.7.5 2.4L19 6.8l-1.7 1.3.5-2.4L16 4l2.3-.7L19 1zM5 16l.7 2.3L8 19l-1.8 1.7.5 2.4L5 21.8l-1.7 1.3.5-2.4L2 19l2.3-.7L5 16z",
  },
  {
    id: "code",
    name: "Code",
    svgPath:
      "M8.5 7.5 4 12l4.5 4.5 1.4-1.4L6.8 12l3.1-3.1L8.5 7.5zm7 0-1.4 1.4 3.1 3.1-3.1 3.1 1.4 1.4 4.5-4.5-4.5-4.5z",
  },
  {
    id: "terminal",
    name: "Terminal",
    svgPath:
      "M3 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H3zm2 4 4 4-4 4-1.4-1.4L6.2 12 3.6 9.4 5 8zm7 7h6v2h-6v-2z",
  },
  {
    id: "heart",
    name: "Heart",
    svgPath:
      "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  },
  {
    id: "star",
    name: "Star",
    svgPath:
      "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  },
  {
    id: "shield",
    name: "Security",
    svgPath:
      "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z",
  },
  {
    id: "flame",
    name: "Flame",
    svgPath:
      "M12 2c-.5 2.5-3 5-3 8 0 1.6.7 3.1 1.8 4.2-1.5-.7-2.3-2.1-2.3-3.7 0-.5.1-1 .2-1.5C6.5 10.7 5 13.2 5 16c0 3.9 3.1 7 7 7s7-3.1 7-7c0-4.5-3.5-7.5-5-10-.6 1.8-1.5 3-2.5 3.8.5-2.3.8-4.8.5-7.8z",
  },
  {
    id: "camera",
    name: "Camera",
    svgPath:
      "M9 3L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
  },
  {
    id: "music",
    name: "Music",
    svgPath:
      "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
  },
  {
    id: "shopping",
    name: "Shop",
    svgPath:
      "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z",
  },
  {
    id: "coffee",
    name: "Coffee",
    svgPath:
      "M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3zM2 21h18v2H2v-2z",
  },
  {
    id: "bolt",
    name: "Lightning",
    svgPath: "M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.08-.14L13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15L11 21z",
  },
];

/**
 * Draws the clipping shape onto canvas context
 */
function applyShapePath(ctx: CanvasRenderingContext2D, size: number, shape: IconShape, cornerRadius: number) {
  ctx.beginPath();
  const s = size;

  if (shape === "circle") {
    ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
  } else if (shape === "squircle") {
    // Apple iOS superellipse continuous curvature curve
    const r = (s * 0.224);
    ctx.moveTo(r, 0);
    ctx.lineTo(s - r, 0);
    ctx.quadraticCurveTo(s, 0, s, r);
    ctx.lineTo(s, s - r);
    ctx.quadraticCurveTo(s, s, s - r, s);
    ctx.lineTo(r, s);
    ctx.quadraticCurveTo(0, s, 0, s - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
  } else if (shape === "rounded-rect") {
    const rad = Math.max(2, (cornerRadius / 100) * (s / 2));
    ctx.roundRect ? ctx.roundRect(0, 0, s, s, rad) : ctx.rect(0, 0, s, s);
  } else if (shape === "teardrop") {
    const r = s / 2;
    ctx.moveTo(r, 0);
    ctx.arcTo(s, 0, s, r, r);
    ctx.arcTo(s, s, r, s, r);
    ctx.arcTo(0, s, 0, r, r);
    ctx.lineTo(0, 0);
    ctx.closePath();
  } else if (shape === "hexagon") {
    const a = s / 2;
    const h = (s * Math.sqrt(3)) / 4;
    ctx.moveTo(s / 2, s / 2 - a);
    ctx.lineTo(s / 2 + h, s / 2 - a / 2);
    ctx.lineTo(s / 2 + h, s / 2 + a / 2);
    ctx.lineTo(s / 2, s / 2 + a);
    ctx.lineTo(s / 2 - h, s / 2 + a / 2);
    ctx.lineTo(s / 2 - h, s / 2 - a / 2);
    ctx.closePath();
  } else {
    // square / full bleed
    ctx.rect(0, 0, s, s);
  }
}

/**
 * Draws background layer
 */
function drawBackground(ctx: CanvasRenderingContext2D, size: number, config: IconConfig) {
  if (config.bgType === "transparent") {
    ctx.clearRect(0, 0, size, size);
    return;
  }

  if (config.bgType === "gradient") {
    const rad = (config.gradientAngle * Math.PI) / 180;
    const x1 = size / 2 - (Math.cos(rad) * size) / 2;
    const y1 = size / 2 - (Math.sin(rad) * size) / 2;
    const x2 = size / 2 + (Math.cos(rad) * size) / 2;
    const y2 = size / 2 + (Math.sin(rad) * size) / 2;
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, config.bgColor1);
    grad.addColorStop(1, config.bgColor2);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = config.bgColor1;
  }
  ctx.fillRect(0, 0, size, size);
}

/**
 * Draws Cast / 45-degree Long Shadow (inspired by Android Asset Studio)
 */
function drawCastShadow(ctx: CanvasRenderingContext2D, fgCanvas: HTMLCanvasElement, size: number) {
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = size;
  shadowCanvas.height = size;
  const sCtx = shadowCanvas.getContext("2d");
  if (!sCtx) return;

  // Render foreground in solid black with opacity
  sCtx.drawImage(fgCanvas, 0, 0);
  sCtx.globalCompositeOperation = "source-in";
  sCtx.fillStyle = "rgba(0, 0, 0, 0.28)";
  sCtx.fillRect(0, 0, size, size);

  // Cast shadow along 45 degree angle
  ctx.save();
  const maxOffset = Math.round(size * 0.7);
  for (let i = 1; i <= maxOffset; i += 2) {
    const alpha = Math.max(0, 0.35 * (1 - i / maxOffset));
    ctx.globalAlpha = alpha;
    ctx.drawImage(shadowCanvas, i, i);
  }
  ctx.restore();
}

/**
 * Draws Score effect (diagonal slice across bottom right)
 */
function drawScore(ctx: CanvasRenderingContext2D, size: number) {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(size, 0);
  ctx.lineTo(size, size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Draws Elevate effect (soft top highlight & subtle inner border)
 */
function drawElevate(ctx: CanvasRenderingContext2D, size: number) {
  ctx.save();
  const topGrad = ctx.createLinearGradient(0, 0, 0, size * 0.4);
  topGrad.addColorStop(0, "rgba(255, 255, 255, 0.22)");
  topGrad.addColorStop(1, "rgba(255, 255, 255, 0.0)");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = Math.max(1, Math.round(size * 0.015));
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws Ribbon / Badge
 */
function drawBadge(ctx: CanvasRenderingContext2D, size: number, text: string, color: string) {
  if (!text.trim()) return;
  ctx.save();
  const ribbonSize = size * 0.35;
  ctx.translate(size - ribbonSize / 2, ribbonSize / 2);
  ctx.rotate(Math.PI / 4);

  ctx.fillStyle = color || "#ec3013";
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = size * 0.02;
  ctx.fillRect(-ribbonSize, -size * 0.045, ribbonSize * 2, size * 0.09);

  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.round(size * 0.04)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.toUpperCase().trim().slice(0, 5), 0, 0);
  ctx.restore();
}

/**
 * Render Foreground Layer onto an isolated canvas
 */
export async function renderForegroundLayer(
  config: IconConfig,
  size: number,
  loadedImg?: HTMLImageElement | null
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const padRatio = (config.padding / 100);
  const targetW = size * (1 - padRatio * 2);
  const targetH = size * (1 - padRatio * 2);
  const targetX = size * padRatio;
  const targetY = size * padRatio;

  if (config.foregroundType === "clipart") {
    const clipart = CLIPARTS.find((c) => c.id === config.clipartId) || CLIPARTS[0];
    const path = new Path2D(clipart.svgPath);
    ctx.save();
    ctx.translate(targetX, targetY);
    const scale = targetW / 24;
    ctx.scale(scale, scale);
    ctx.fillStyle = config.useForeTint && config.foreColor ? config.foreColor : "#ffffff";
    ctx.fill(path);
    ctx.restore();
  } else if (config.foregroundType === "text") {
    ctx.save();
    const fontSize = targetW * 0.65;
    ctx.font = `${config.isBold ? "bold " : ""}${fontSize}px ${config.fontFamily || "sans-serif"}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = config.useForeTint && config.foreColor ? config.foreColor : "#ffffff";
    ctx.fillText(config.text || "A", size / 2, size / 2 + fontSize * 0.04);
    ctx.restore();
  } else if (config.foregroundType === "image" && loadedImg) {
    ctx.save();
    const imgRatio = loadedImg.width / loadedImg.height;
    let dw = targetW;
    let dh = targetH;
    if (imgRatio > 1) {
      dh = targetW / imgRatio;
    } else {
      dw = targetH * imgRatio;
    }
    const dx = size / 2 - dw / 2;
    const dy = size / 2 - dh / 2;

    if (config.useForeTint && config.foreColor) {
      // Draw image to temp canvas to apply color tint mask
      const temp = document.createElement("canvas");
      temp.width = size;
      temp.height = size;
      const tCtx = temp.getContext("2d");
      if (tCtx) {
        tCtx.drawImage(loadedImg, dx, dy, dw, dh);
        tCtx.globalCompositeOperation = "source-in";
        tCtx.fillStyle = config.foreColor;
        tCtx.fillRect(0, 0, size, size);
        ctx.drawImage(temp, 0, 0);
      }
    } else {
      ctx.drawImage(loadedImg, dx, dy, dw, dh);
    }
    ctx.restore();
  }

  return canvas;
}

/**
 * Main function: Renders the complete icon into a target Canvas at any specified size
 */
export async function renderIcon(
  targetCanvas: HTMLCanvasElement,
  config: IconConfig,
  size: number,
  loadedImg?: HTMLImageElement | null,
  overrideShape?: IconShape
): Promise<void> {
  targetCanvas.width = size;
  targetCanvas.height = size;
  const ctx = targetCanvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, size, size);

  const activeShape = overrideShape || config.shape;

  // Clip to shape
  ctx.save();
  applyShapePath(ctx, size, activeShape, config.cornerRadius);
  ctx.clip();

  // Draw Background
  drawBackground(ctx, size, config);

  // Render Foreground
  const fgCanvas = await renderForegroundLayer(config, size, loadedImg);

  // Effects
  if (config.effect === "cast-shadow") {
    drawCastShadow(ctx, fgCanvas, size);
  } else if (config.effect === "score") {
    drawScore(ctx, size);
  }

  if (config.effect === "shadow") {
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = size * 0.04;
    ctx.shadowOffsetY = size * 0.02;
    ctx.drawImage(fgCanvas, 0, 0);
    ctx.restore();
  } else {
    ctx.drawImage(fgCanvas, 0, 0);
  }

  if (config.effect === "elevate") {
    drawElevate(ctx, size);
  }

  // Badge / Ribbon
  if (config.badgeText) {
    drawBadge(ctx, size, config.badgeText, config.badgeColor);
  }

  ctx.restore();
}

/**
 * Generates an ICO binary file containing 16x16, 32x32, and 48x48 PNG frames
 */
export async function generateIcoFile(config: IconConfig, loadedImg?: HTMLImageElement | null): Promise<Uint8Array> {
  const sizes = [16, 32, 48];
  const pngBuffers: Uint8Array[] = [];

  for (const s of sizes) {
    const c = document.createElement("canvas");
    await renderIcon(c, config, s, loadedImg, "square");
    const blob = await new Promise<Blob | null>((resolve) => c.toBlob(resolve, "image/png"));
    if (blob) {
      const buffer = new Uint8Array(await blob.arrayBuffer());
      pngBuffers.push(buffer);
    }
  }

  // ICO header: 6 bytes
  // Header: 0,0 (reserved), 1,0 (type: 1 = ICO), count,0 (number of images)
  const count = pngBuffers.length;
  let headerSize = 6 + count * 16;
  let totalSize = headerSize + pngBuffers.reduce((sum, b) => sum + b.length, 0);

  const ico = new Uint8Array(totalSize);
  const view = new DataView(ico.buffer);

  view.setUint16(0, 0, true); // Reserved
  view.setUint16(2, 1, true); // Type (1 = ICO)
  view.setUint16(4, count, true); // Number of images

  let imageOffset = headerSize;
  for (let i = 0; i < count; i++) {
    const s = sizes[i];
    const b = pngBuffers[i];
    const entryOffset = 6 + i * 16;

    view.setUint8(entryOffset + 0, s === 256 ? 0 : s); // Width
    view.setUint8(entryOffset + 1, s === 256 ? 0 : s); // Height
    view.setUint8(entryOffset + 2, 0); // Palette count
    view.setUint8(entryOffset + 3, 0); // Reserved
    view.setUint16(entryOffset + 4, 1, true); // Color planes
    view.setUint16(entryOffset + 6, 32, true); // Bits per pixel
    view.setUint32(entryOffset + 8, b.length, true); // Image byte length
    view.setUint32(entryOffset + 12, imageOffset, true); // Offset of image data

    ico.set(b, imageOffset);
    imageOffset += b.length;
  }

  return ico;
}

/**
 * Creates comprehensive multi-platform ZIP archive
 */
export async function generateAllAssetsZip(
  config: IconConfig,
  loadedImg?: HTMLImageElement | null,
  platform?: "all" | "android" | "ios" | "web"
): Promise<Blob> {
  const zip = new JSZip();

  // Helper to render and get blob
  async function getPngBlob(size: number, shape?: IconShape): Promise<Blob> {
    const c = document.createElement("canvas");
    await renderIcon(c, config, size, loadedImg, shape);
    return new Promise<Blob>((resolve) => c.toBlob((b) => resolve(b!), "image/png"));
  }

  // --- ANDROID ---
  if (!platform || platform === "all" || platform === "android") {
    const androidFolder = zip.folder("android");
    const resFolder = androidFolder?.folder("res");

    const densities: { name: string; size: number }[] = [
      { name: "mipmap-mdpi", size: 48 },
      { name: "mipmap-hdpi", size: 72 },
      { name: "mipmap-xhdpi", size: 96 },
      { name: "mipmap-xxhdpi", size: 144 },
      { name: "mipmap-xxxhdpi", size: 192 },
    ];

    for (const d of densities) {
      const mipmap = resFolder?.folder(d.name);
      // Legacy square / squircle
      mipmap?.file("ic_launcher.png", await getPngBlob(d.size, config.shape));
      // Round icon
      mipmap?.file("ic_launcher_round.png", await getPngBlob(d.size, "circle"));
      // Foreground only (for adaptive icons)
      const fgCanvas = await renderForegroundLayer(config, d.size * 1.5, loadedImg);
      const fgBlob = await new Promise<Blob>((resolve) => fgCanvas.toBlob((b) => resolve(b!), "image/png"));
      mipmap?.file("ic_launcher_foreground.png", fgBlob);
    }

    // Google Play Store 512x512
    androidFolder?.file("playstore-icon-512.png", await getPngBlob(512, "square"));
  }

  // --- IOS ---
  if (!platform || platform === "all" || platform === "ios") {
    const iosFolder = zip.folder("ios");
    const appIconSet = iosFolder?.folder("AppIcon.appiconset");

    const iosSizes: { name: string; size: number; idiom: string; scale: string }[] = [
      { name: "icon-20@2x.png", size: 40, idiom: "iphone", scale: "2x" },
      { name: "icon-20@3x.png", size: 60, idiom: "iphone", scale: "3x" },
      { name: "icon-29@2x.png", size: 58, idiom: "iphone", scale: "2x" },
      { name: "icon-29@3x.png", size: 87, idiom: "iphone", scale: "3x" },
      { name: "icon-40@2x.png", size: 80, idiom: "iphone", scale: "2x" },
      { name: "icon-40@3x.png", size: 120, idiom: "iphone", scale: "3x" },
      { name: "icon-60@2x.png", size: 120, idiom: "iphone", scale: "2x" },
      { name: "icon-60@3x.png", size: 180, idiom: "iphone", scale: "3x" },
      { name: "icon-1024.png", size: 1024, idiom: "ios-marketing", scale: "1x" },
    ];

    for (const item of iosSizes) {
      appIconSet?.file(item.name, await getPngBlob(item.size, "square")); // iOS expects unclipped square, OS clips it
    }

    const contentsJson = {
      images: iosSizes.map((item) => ({
        size: `${item.size / (item.scale === "3x" ? 3 : item.scale === "2x" ? 2 : 1)}x${
          item.size / (item.scale === "3x" ? 3 : item.scale === "2x" ? 2 : 1)
        }`,
        idiom: item.idiom,
        filename: item.name,
        scale: item.scale,
      })),
      info: { version: 1, author: "daliytools-icon-kitchen" },
    };
    appIconSet?.file("Contents.json", JSON.stringify(contentsJson, null, 2));
  }

  // --- WEB / FAVICONS ---
  if (!platform || platform === "all" || platform === "web") {
    const webFolder = zip.folder("web");

    // Favicon ICO (16, 32, 48)
    const icoData = await generateIcoFile(config, loadedImg);
    webFolder?.file("favicon.ico", icoData);

    // PNG Favicons
    webFolder?.file("favicon-16x16.png", await getPngBlob(16, "square"));
    webFolder?.file("favicon-32x32.png", await getPngBlob(32, "square"));
    webFolder?.file("apple-touch-icon.png", await getPngBlob(180, "square"));
    webFolder?.file("android-chrome-192x192.png", await getPngBlob(192, "square"));
    webFolder?.file("android-chrome-512x512.png", await getPngBlob(512, "square"));

    // site.webmanifest
    const manifest = {
      name: "My App",
      short_name: "App",
      icons: [
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      theme_color: config.bgColor1,
      background_color: config.bgColor1,
      display: "standalone",
    };
    webFolder?.file("site.webmanifest", JSON.stringify(manifest, null, 2));

    // HTML snippet
    const htmlSnippet = `<!-- Favicon & App Icons generated by Daliy.Tools Icon Kitchen -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${config.bgColor1}">
`;
    webFolder?.file("instructions.html", htmlSnippet);
  }

  return zip.generateAsync({ type: "blob" });
}
