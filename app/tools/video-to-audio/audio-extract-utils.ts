import { Mp3Encoder } from "@breezystack/lamejs";

export interface AudioExtractOptions {
  format: "mp3" | "wav";
  kbps: 128 | 192 | 256 | 320;
  channels: 1 | 2; // 1 = mono, 2 = stereo
  gain: number; // e.g. 1.0 = normal, 1.5 = +50%, 0.5 = -50%
  startTime?: number;
  endTime?: number;
  onProgress?: (progress: number, stage: string) => void;
}

export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function clamp(val: number, min: number, max: number): number {
  if (!Number.isFinite(val)) return min;
  return Math.min(Math.max(val, min), max);
}

/**
 * Decodes the audio track from a video file into an AudioBuffer using the Web Audio API.
 */
export async function decodeAudioFromVideo(
  file: File,
  onProgress?: (percent: number, message: string) => void
): Promise<AudioBuffer> {
  onProgress?.(10, "Reading video file into memory...");
  const arrayBuffer = await file.arrayBuffer();

  onProgress?.(30, "Decoding audio track...");
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) {
    throw new Error("Web Audio API is not supported in this browser.");
  }

  const audioContext = new AudioCtx();

  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    if (audioBuffer.length === 0 || audioBuffer.numberOfChannels === 0) {
      throw new Error("No audio channels found in this video.");
    }
    return audioBuffer;
  } catch (decodeErr) {
    // If decodeAudioData failed, attempt video element fallback capture
    onProgress?.(45, "Standard decoder failed; attempting browser video playback demuxer...");
    try {
      const fallbackBuffer = await extractAudioViaVideoElement(file, onProgress);
      return fallbackBuffer;
    } catch (fallbackErr) {
      console.error("Audio extraction error:", decodeErr, fallbackErr);
      throw new Error(
        "Could not extract audio from this video. The file might not contain an audio track or uses an unsupported audio codec."
      );
    }
  } finally {
    try {
      await audioContext.close();
    } catch {
      // ignore
    }
  }
}

/**
 * Fallback: load file into video element and capture stream via OfflineAudioContext or AudioContext.
 */
async function extractAudioViaVideoElement(
  file: File,
  onProgress?: (percent: number, message: string) => void
): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;
    video.muted = false;
    video.playsInline = true;

    const cleanup = () => {
      URL.revokeObjectURL(videoUrl);
      video.remove();
    };

    video.onloadedmetadata = async () => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        cleanup();
        reject(new Error("Invalid video duration."));
        return;
      }

      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const source = ctx.createMediaElementSource(video);
        const destination = ctx.createMediaStreamDestination();
        source.connect(destination);

        const mediaRecorder = new MediaRecorder(destination.stream);
        const recordedChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          try {
            const combinedBlob = new Blob(recordedChunks);
            const recordedArrBuf = await combinedBlob.arrayBuffer();
            const decoded = await ctx.decodeAudioData(recordedArrBuf);
            await ctx.close();
            cleanup();
            resolve(decoded);
          } catch (err) {
            cleanup();
            reject(err);
          }
        };

        mediaRecorder.start(100);
        video.playbackRate = 2.0; // speed up playback to reduce wait time
        await video.play();

        video.ontimeupdate = () => {
          const pct = Math.min(95, 45 + Math.round((video.currentTime / duration) * 50));
          onProgress?.(pct, `Capturing audio stream: ${formatTime(video.currentTime)} / ${formatTime(duration)}`);
        };

        video.onended = () => {
          mediaRecorder.stop();
        };

        video.onerror = () => {
          mediaRecorder.stop();
          cleanup();
          reject(new Error("Video playback error during fallback audio extraction."));
        };
      } catch (e) {
        cleanup();
        reject(e);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Failed to load video element for audio fallback."));
    };
  });
}

/**
 * Creates a standard 16-bit PCM WAV Blob from an AudioBuffer.
 */
export function encodeAudioBufferToWav(
  audioBuffer: AudioBuffer,
  options?: {
    startTime?: number;
    endTime?: number;
    gain?: number;
    channels?: 1 | 2;
  }
): Blob {
  const sampleRate = audioBuffer.sampleRate;
  const originalChannels = audioBuffer.numberOfChannels;
  const targetChannels = options?.channels === 1 ? 1 : Math.min(2, originalChannels);
  const gain = options?.gain ?? 1.0;

  const startSample = Math.max(0, Math.floor((options?.startTime ?? 0) * sampleRate));
  const endSample = Math.min(
    audioBuffer.length,
    Math.floor((options?.endTime ?? audioBuffer.duration) * sampleRate)
  );
  const numSamples = Math.max(1, endSample - startSample);

  const bitsPerSample = 16;
  const blockAlign = targetChannels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  const dataByteLength = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataByteLength);
  const view = new DataView(buffer);

  const writeString = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  // RIFF identifier
  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataByteLength, true);
  writeString(8, "WAVE");

  // fmt subchunk
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, targetChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample

  // data subchunk
  writeString(36, "data");
  view.setUint32(40, dataByteLength, true);

  // Write PCM samples
  const leftSource = audioBuffer.getChannelData(0);
  const rightSource = originalChannels > 1 ? audioBuffer.getChannelData(1) : leftSource;

  let offset = 44;
  for (let i = startSample; i < endSample; i += 1) {
    if (targetChannels === 1) {
      // Mono: average channels if original is stereo
      let sample = originalChannels > 1 ? (leftSource[i] + rightSource[i]) * 0.5 : leftSource[i];
      sample *= gain;
      sample = Math.max(-1, Math.min(1, sample));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    } else {
      // Stereo
      let left = leftSource[i] * gain;
      let right = rightSource[i] * gain;

      left = Math.max(-1, Math.min(1, left));
      right = Math.max(-1, Math.min(1, right));

      const leftInt = left < 0 ? left * 0x8000 : left * 0x7fff;
      const rightInt = right < 0 ? right * 0x8000 : right * 0x7fff;

      view.setInt16(offset, leftInt, true);
      view.setInt16(offset + 2, rightInt, true);
      offset += 4;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}

/**
 * Encodes an AudioBuffer into an MP3 Blob using `@breezystack/lamejs`.
 * Chunked encoding with micro-delays ensures the UI stays responsive and progress updates continuously.
 */
export async function encodeAudioBufferToMp3(
  audioBuffer: AudioBuffer,
  options: {
    kbps?: 128 | 192 | 256 | 320;
    channels?: 1 | 2;
    gain?: number;
    startTime?: number;
    endTime?: number;
    onProgress?: (progress: number) => void;
  }
): Promise<Blob> {
  const sampleRate = audioBuffer.sampleRate;
  const originalChannels = audioBuffer.numberOfChannels;
  const targetChannels = options.channels === 1 ? 1 : Math.min(2, originalChannels);
  const kbps = options.kbps ?? 192;
  const gain = options.gain ?? 1.0;

  const startSample = Math.max(0, Math.floor((options.startTime ?? 0) * sampleRate));
  const endSample = Math.min(
    audioBuffer.length,
    Math.floor((options.endTime ?? audioBuffer.duration) * sampleRate)
  );
  const totalSamples = Math.max(1, endSample - startSample);

  // Convert float samples to 16-bit integers
  const leftSource = audioBuffer.getChannelData(0);
  const rightSource = originalChannels > 1 ? audioBuffer.getChannelData(1) : leftSource;

  const leftInt = new Int16Array(totalSamples);
  const rightInt = targetChannels === 2 ? new Int16Array(totalSamples) : undefined;

  for (let i = 0; i < totalSamples; i += 1) {
    const srcIndex = startSample + i;
    if (targetChannels === 1) {
      let sample = originalChannels > 1 ? (leftSource[srcIndex] + rightSource[srcIndex]) * 0.5 : leftSource[srcIndex];
      sample *= gain;
      sample = Math.max(-1, Math.min(1, sample));
      leftInt[i] = Math.round(sample < 0 ? sample * 32768 : sample * 32767);
    } else {
      let left = leftSource[srcIndex] * gain;
      let right = rightSource[srcIndex] * gain;
      left = Math.max(-1, Math.min(1, left));
      right = Math.max(-1, Math.min(1, right));
      leftInt[i] = Math.round(left < 0 ? left * 32768 : left * 32767);
      if (rightInt) {
        rightInt[i] = Math.round(right < 0 ? right * 32768 : right * 32767);
      }
    }
  }

  const encoder = new Mp3Encoder(targetChannels, sampleRate, kbps);
  const mp3Chunks: Uint8Array[] = [];
  const blockSize = 1152; // LAME standard frame size
  const totalBlocks = Math.ceil(totalSamples / blockSize);

  for (let b = 0; b < totalBlocks; b += 1) {
    const offset = b * blockSize;
    const chunkLeft = leftInt.subarray(offset, offset + blockSize);
    let encodedChunk: Uint8Array;

    if (targetChannels === 2 && rightInt) {
      const chunkRight = rightInt.subarray(offset, offset + blockSize);
      encodedChunk = encoder.encodeBuffer(chunkLeft, chunkRight);
    } else {
      encodedChunk = encoder.encodeBuffer(chunkLeft);
    }

    if (encodedChunk.length > 0) {
      mp3Chunks.push(encodedChunk);
    }

    if (b % 50 === 0 || b === totalBlocks - 1) {
      const percent = Math.min(99, Math.round(((b + 1) / totalBlocks) * 100));
      options.onProgress?.(percent);
      // Give browser event loop a breath
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  const flushed = encoder.flush();
  if (flushed.length > 0) {
    mp3Chunks.push(flushed);
  }

  options.onProgress?.(100);

  // Return Blob
  return new Blob(mp3Chunks as unknown as BlobPart[], { type: "audio/mpeg" });
}
