import type { Metadata } from "next";
import VideoToAudioContent from "./video-to-audio-content";

export const metadata: Metadata = {
  title: "Video to Audio Converter — Extract MP3 & WAV | Daliy.Tools",
  description:
    "Extract audio from video files online for free. Convert MP4, WebM, and MOV to high-quality MP3 or lossless WAV directly in your browser with zero file uploads.",
  keywords: [
    "video to audio",
    "extract audio from video",
    "video to mp3",
    "convert video to audio",
    "mp4 to mp3 online",
    "video to wav converter",
    "extract sound from video",
    "free audio extractor",
    "daily tools",
    "private audio conversion",
  ],
  alternates: {
    canonical: "https://daliy.tools/tools/video-to-audio",
  },
  openGraph: {
    title: "Video to Audio Converter — Free & Private | Daliy.Tools",
    description:
      "Extract audio from your videos securely in your browser. Convert MP4, WebM, or MOV to MP3 and WAV with no server uploads, no watermarks, completely free.",
    url: "https://daliy.tools/tools/video-to-audio",
    siteName: "Daliy.Tools",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video to Audio Converter — Free & Private | Daliy.Tools",
    description:
      "Extract audio from your videos in seconds. Free, fast, and 100% private in your browser with no server uploads.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Video to Audio Converter - Daliy.Tools",
      "url": "https://daliy.tools/tools/video-to-audio",
      "description":
        "Free online tool to extract MP3 or lossless WAV audio from video files (MP4, WebM, MOV, MKV) directly in the browser.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does extracting audio from video upload my video to a server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. The entire audio extraction and conversion process runs 100% client-side inside your browser using the Web Audio API. Your video files never leave your device.",
          },
        },
        {
          "@type": "Question",
          "name": "What output audio formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can export the extracted audio track as MP3 (with selectable bitrates from 128 kbps up to 320 kbps) or as uncompressed 16-bit PCM WAV for lossless studio quality.",
          },
        },
        {
          "@type": "Question",
          "name": "What video file formats can I upload?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The tool supports all common video containers including MP4, WebM, MOV, MKV, AVI, and M4V. Any video with a valid audio track can be processed.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I extract just a section of the video audio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can use the built-in trim controls to set custom start and end times, allowing you to extract only the clip or soundtrack segment you need.",
          },
        },
        {
          "@type": "Question",
          "name": "Is there a file size limit for video uploads?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Because processing happens directly on your device rather than uploading over a network, you can process large video files without server upload limits or timeout restrictions.",
          },
        },
      ],
    },
  ],
};

export default function VideoToAudioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VideoToAudioContent />
    </>
  );
}
