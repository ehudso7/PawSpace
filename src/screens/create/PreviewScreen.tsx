import React, { useMemo, useRef, useState } from "react";
import { suggestHashtags, extractHashtagsFromCaption } from "../../utils/hashtags";
import { PrivacySetting, ServiceTag, VideoParams } from "../../types/media";

// NOTE: This is a placeholder web React implementation. Replace video element/UI primitives with
// React Native (expo-av, react-native-bottom-sheet) as needed in your app.

interface PreviewScreenProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  initialCaption?: string;
  serviceTag?: ServiceTag; // if provider: link to service
  onBack: () => void;
  onPosted?: (postId: string) => void;
}

const DEFAULT_VIDEO_DURATION = 6; // seconds

export default function PreviewScreen(props: PreviewScreenProps) {
  const { beforeImageUrl, afterImageUrl, initialCaption, serviceTag, onBack, onPosted } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loop, setLoop] = useState(true);
  const [muted, setMuted] = useState(true);
  const [caption, setCaption] = useState(initialCaption ?? "");
  const [privacy, setPrivacy] = useState<PrivacySetting>("public");
  const [posting, setPosting] = useState(false);

  const hashtagSuggestions = useMemo(() => suggestHashtags(), []);
  const selectedHashtags = useMemo(() => extractHashtagsFromCaption(caption), [caption]);

  async function generateVideo() {
    setIsGenerating(true);
    try {
      const params: VideoParams = {
        beforeImageUrl,
        afterImageUrl,
        transition: "fade",
        duration: DEFAULT_VIDEO_DURATION,
        textOverlays: [],
        fps: 30,
        folder: "transformations",
      };

      const response = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to generate video");
      setVideoUrl(data.url || null);
    } catch (e: any) {
      console.error(e);
      alert(e.message ?? "Video generation failed");
    } finally {
      setIsGenerating(false);
    }
  }

  async function saveToDevice() {
    if (!videoUrl) return;
    try {
      const res = await fetch(videoUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transformation.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to save video");
    }
  }

  async function shareGeneric() {
    if (!videoUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: "PawSpace Transformation", url: videoUrl });
      } else {
        await navigator.clipboard.writeText(videoUrl);
        alert("Link copied to clipboard");
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function postToPawSpace() {
    if (!videoUrl) return;
    setPosting(true);
    try {
      const payload = {
        caption,
        serviceTag,
        hashtags: selectedHashtags,
        privacy,
        videoUrl,
      };
      const res = await fetch("/api/pawspace/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to post");
      onPosted?.(data.id!);
      alert("Posted to PawSpace!");
    } catch (e: any) {
      console.error(e);
      alert(e.message ?? "Failed to post");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", padding: 12, gap: 8 }}>
        <button onClick={onBack}>Back to editor</button>
        <div style={{ flex: 1 }} />
        <button onClick={() => shareGeneric()}>Share preview</button>
      </div>

      {/* Player */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#111" }}>
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            loop={loop}
            muted={muted}
            style={{ maxHeight: "100%", maxWidth: "100%", background: "black" }}
          />
        ) : (
          <div style={{ color: "#ccc", textAlign: "center" }}>
            <p>No video generated yet.</p>
            <button disabled={isGenerating} onClick={generateVideo}>
              {isGenerating ? "Generating..." : "Generate Preview"}
            </button>
          </div>
        )}
      </div>

      {/* Bottom sheet */}
      <div style={{ borderTop: "1px solid #333", padding: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <label>
            <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} /> Loop
          </label>
          <label>
            <input type="checkbox" checked={muted} onChange={(e) => setMuted(e.target.checked)} /> Mute
          </label>
          <div style={{ flex: 1 }} />
          <button onClick={generateVideo} disabled={isGenerating}>
            {isGenerating ? "Regenerating..." : videoUrl ? "Regenerate" : "Generate"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label>Caption</label>
          <textarea
            value={caption}
            maxLength={280}
            rows={3}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption..."
          />

          {serviceTag && (
            <div style={{ fontSize: 14, color: "#888" }}>
              Service: {serviceTag.url ? (
                <a href={serviceTag.url} target="_blank" rel="noreferrer">
                  {serviceTag.label}
                </a>
              ) : (
                serviceTag.label
              )}
            </div>
          )}

          <div>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>Hashtag suggestions</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {hashtagSuggestions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setCaption((c) => (c.includes(tag) ? c : (c + " " + tag).trim()))}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div>Privacy:</div>
            <label>
              <input
                type="radio"
                name="privacy"
                checked={privacy === "public"}
                onChange={() => setPrivacy("public")}
              />
              Public
            </label>
            <label>
              <input
                type="radio"
                name="privacy"
                checked={privacy === "private"}
                onChange={() => setPrivacy("private")}
              />
              Private
            </label>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={saveToDevice} disabled={!videoUrl}>Save to Device</button>
            <button onClick={postToPawSpace} disabled={!videoUrl || posting}>
              {posting ? "Posting..." : "Post to PawSpace"}
            </button>
            <button onClick={shareGeneric} disabled={!videoUrl}>Share to Instagram/TikTok</button>
          </div>
        </div>
      </div>
    </div>
  );
}
