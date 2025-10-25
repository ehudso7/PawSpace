import React, { useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Linking, Platform } from "react-native";
import { Video } from "expo-av";
import CloudinaryService from "../../services/cloudinary";
import { suggestHashtags } from "../../utils/hashtags";
import type { TransitionType, TextOverlay, VideoParams } from "../../types/video";
import PawSpaceService, { PrivacySetting, ProviderTag } from "../../services/pawspace";

// Props you'd provide when navigating to this screen
export interface PreviewScreenProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  // Optional pre-selected items
  initialCaption?: string;
  initialPrivacy?: PrivacySetting;
  providerTag?: ProviderTag; // if set, show service tag linking to provider
}

const cloudinary = new CloudinaryService();
const pawspace = new PawSpaceService();

export default function PreviewScreen(props: PreviewScreenProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [caption, setCaption] = useState(props.initialCaption ?? "");
  const [privacy, setPrivacy] = useState<PrivacySetting>(props.initialPrivacy ?? "public");
  const [posting, setPosting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playerRef = useRef<Video>(null);

  const hashtags = useMemo(() => suggestHashtags(caption), [caption]);

  const textOverlays: TextOverlay[] = useMemo(
    () => [
      {
        text: "Before",
        fontFamily: "Arial",
        fontSize: 36,
        color: "#ffffff",
        position: { x: 24, y: 24 },
        startAt: 0,
        endAt: 2,
      },
      {
        text: "After",
        fontFamily: "Arial",
        fontSize: 36,
        color: "#ffffff",
        position: { x: 24, y: 24 },
        startAt: 2,
        endAt: 4,
      },
    ],
    []
  );

  async function generateVideo() {
    try {
      setIsGenerating(true);
      setError(null);
      const params: VideoParams = {
        beforeImageUrl: props.beforeImageUrl,
        afterImageUrl: props.afterImageUrl,
        transition: "fade" as TransitionType,
        duration: 4,
        textOverlays,
        fps: 30,
      };
      const url = await cloudinary.createTransformationVideo(params);
      setVideoUrl(url);
    } catch (e: any) {
      setError(e?.message ?? "Failed to generate video");
    } finally {
      setIsGenerating(false);
    }
  }

  async function onSaveToDevice() {
    try {
      if (!videoUrl) return;
      setSaving(true);
      // On mobile, use react-native-share or expo-file-system to download
      // This is a stub; actual implementation depends on app stack
      // eslint-disable-next-line no-console
      console.log("Saving video to device:", videoUrl);
    } finally {
      setSaving(false);
    }
  }

  async function onShareToSocial() {
    try {
      if (!videoUrl) return;
      setSharing(true);
      // Use native share sheet; stubbed for now
      // eslint-disable-next-line no-console
      console.log("Sharing to IG/TikTok:", videoUrl);
    } finally {
      setSharing(false);
    }
  }

  async function onPostToPawSpace() {
    try {
      if (!videoUrl) return;
      setPosting(true);
      const result = await pawspace.publishPost({
        videoUrl,
        caption: caption.slice(0, 280),
        hashtags,
        privacy,
        provider: props.providerTag,
      });
      if (!result.success) throw new Error(result.error || "Failed to publish");
      // eslint-disable-next-line no-alert
      alert("Posted! " + (result.shareUrl ?? ""));
    } catch (e: any) {
      setError(e?.message ?? "Failed to post");
    } finally {
      setPosting(false);
    }
  }

  function onBack() {
    // integrate with navigation
    // eslint-disable-next-line no-console
    console.log("Back to editor");
  }

  function onOpenProvider() {
    if (props.providerTag?.url) {
      Linking.openURL(props.providerTag.url);
    }
  }

  // Auto-generate on first mount
  React.useEffect(() => {
    generateVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPlayEnabled = !!videoUrl && !isGenerating;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Top bar */}
      <View
        style={{
          position: "absolute",
          top: Platform.select({ ios: 50, android: 20, default: 10 }),
          left: 0,
          right: 0,
          zIndex: 10,
          paddingHorizontal: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={onBack} style={{ padding: 8, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 8 }}>
          <Text style={{ color: "#fff" }}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onShareToSocial} style={{ padding: 8, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 8 }}>
          <Text style={{ color: "#fff" }}>Share Preview</Text>
        </TouchableOpacity>
      </View>

      {/* Video player */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {isPlayEnabled ? (
          <Video
            ref={playerRef}
            source={{ uri: videoUrl! }}
            rate={1.0}
            volume={1.0}
            isMuted={isMuted}
            resizeMode="contain"
            shouldPlay
            isLooping={isLooping}
            style={{ width: "100%", height: "100%" }}
            useNativeControls
          />
        ) : (
          <View style={{ padding: 24 }}>
            <Text style={{ color: "#fff" }}>{isGenerating ? "Generating video..." : error ?? ""}</Text>
          </View>
        )}
      </View>

      {/* Bottom sheet */}
      <View
        style={{
          backgroundColor: "#111",
          paddingVertical: 12,
          paddingHorizontal: 12,
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flex: 1, width: "100%" }}>
            <Text style={{ color: "#fff", marginBottom: 6 }}>Caption</Text>
            <TextInput
              value={caption}
              onChangeText={(t) => setCaption(t.slice(0, 280))}
              placeholder="Write a caption..."
              placeholderTextColor="#888"
              style={{ color: "#fff", backgroundColor: "#222", borderRadius: 8, padding: 10, minHeight: 44, width: 320 }}
              multiline
              maxLength={280}
            />

            {props.providerTag && (
              <TouchableOpacity onPress={onOpenProvider} style={{ marginTop: 10 }}>
                <Text style={{ color: "#7dd3fc" }}>Service: {props.providerTag.name} →</Text>
              </TouchableOpacity>
            )}

            <View style={{ marginTop: 10 }}>
              <Text style={{ color: "#fff", marginBottom: 6 }}>Hashtag suggestions</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {hashtags.map((tag) => (
                  <TouchableOpacity key={tag} onPress={() => setCaption((c) => `${c} ${tag}`.trim())} style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: "#222", borderRadius: 16, marginRight: 8, marginBottom: 8 }}>
                    <Text style={{ color: "#ccc" }}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "#fff", marginRight: 10 }}>Privacy:</Text>
              <TouchableOpacity onPress={() => setPrivacy("public")} style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: privacy === "public" ? "#22c55e" : "#222", marginRight: 8 }}>
                <Text style={{ color: "#fff" }}>Public</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPrivacy("private")} style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: privacy === "private" ? "#22c55e" : "#222" }}>
                <Text style={{ color: "#fff" }}>Private</Text>
              </TouchableOpacity>
            </View>

            {/* Action buttons */}
            <View style={{ marginTop: 12, flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity onPress={onSaveToDevice} disabled={!videoUrl || saving} style={{ flex: 1, marginRight: 6, backgroundColor: "#374151", paddingVertical: 12, borderRadius: 8, alignItems: "center" }}>
                <Text style={{ color: "#fff" }}>{saving ? "Saving..." : "Save to Device"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onPostToPawSpace} disabled={!videoUrl || posting} style={{ flex: 1, marginHorizontal: 6, backgroundColor: "#2563eb", paddingVertical: 12, borderRadius: 8, alignItems: "center" }}>
                <Text style={{ color: "#fff" }}>{posting ? "Posting..." : "Post to PawSpace"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onShareToSocial} disabled={!videoUrl || sharing} style={{ flex: 1, marginLeft: 6, backgroundColor: "#7c3aed", paddingVertical: 12, borderRadius: 8, alignItems: "center" }}>
                <Text style={{ color: "#fff" }}>{sharing ? "Sharing..." : "Share to IG/TikTok"}</Text>
              </TouchableOpacity>
            </View>

            {/* Playback controls */}
            <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => setIsLooping((v) => !v)} style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: isLooping ? "#22c55e" : "#222", marginRight: 8 }}>
                <Text style={{ color: "#fff" }}>Loop</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsMuted((v) => !v)} style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: isMuted ? "#22c55e" : "#222" }}>
                <Text style={{ color: "#fff" }}>{isMuted ? "Unmute" : "Mute"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
