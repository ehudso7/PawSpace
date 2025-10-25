import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";
import type { Effect, TextOverlay, TransitionType, VideoParams } from "../types/video";

export interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

export class CloudinaryService {
  private readonly cloudName: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(config?: Partial<CloudinaryConfig>) {
    this.cloudName = config?.cloud_name ?? process.env.CLOUDINARY_CLOUD_NAME ?? "";
    this.apiKey = config?.api_key ?? process.env.CLOUDINARY_API_KEY ?? "";
    this.apiSecret = config?.api_secret ?? process.env.CLOUDINARY_API_SECRET ?? "";

    if (!this.cloudName || !this.apiKey || !this.apiSecret) {
      // Intentionally not throwing to enable client-only usage that relies on unsigned uploads.
      // For server-side usage, ensure env vars are set.
      // eslint-disable-next-line no-console
      console.warn("Cloudinary configuration is incomplete. Some operations may fail.");
    }

    cloudinary.config({
      cloud_name: this.cloudName,
      api_key: this.apiKey,
      api_secret: this.apiSecret,
      secure: true,
    });
  }

  // Upload an image by URL or local path. Returns the secure_url.
  async uploadImage(uri: string, folder = "pawspace/transformations"): Promise<string> {
    const options: UploadApiOptions = {
      folder,
      resource_type: "image",
      overwrite: true,
      // Ensure long URLs work
      use_filename: true,
      unique_filename: false,
    };

    const res: UploadApiResponse = await cloudinary.uploader.upload(uri, options);
    return res.secure_url;
  }

  // Create a transformation video URL by stitching before/after images with transition, overlays, and optional audio.
  // Returns a Cloudinary URL that generates the video on-demand (and will be cached on first request).
  async createTransformationVideo(params: VideoParams): Promise<string> {
    const {
      beforeImageUrl,
      afterImageUrl,
      transition,
      duration,
      textOverlays,
      audioTrack,
      fps,
    } = params;

    // Get or upload the images so that we have Cloudinary public IDs
    const beforePublicId = await this.ensurePublicId(beforeImageUrl);
    const afterPublicId = await this.ensurePublicId(afterImageUrl);

    const halfDuration = Math.max(0.5, Number((duration / 2).toFixed(2)));
    const transitionSpec = this.transitionToEffect(transition, 1.0);

    // Build transformation parts
    const parts: string[] = [];

    // Base canvas: derive size from first image automatically by using the image as the first layer and applying it from t=0 for halfDuration
    // Place BEFORE image for first half
    parts.push(
      `l_image:${this.escapePublicId(beforePublicId)}`,
      `du_${halfDuration}`,
      "fl_layer_apply"
    );

    // Transition to AFTER
    parts.push(`${transitionSpec}`, "fl_splice");

    // Place AFTER image for second half
    parts.push(
      `l_image:${this.escapePublicId(afterPublicId)}`,
      `du_${halfDuration}`,
      "fl_layer_apply"
    );

    // Text overlays
    if (textOverlays && textOverlays.length > 0) {
      for (const overlay of textOverlays) {
        parts.push(this.textOverlayToLayer(overlay));
      }
    }

    // Effects on the whole output can be appended at the end by merging all effects into a single comma-separated segment
    // Specific per-frame effects should be encoded within the overlay layers.

    // Audio track (optional)
    if (audioTrack) {
      const audioLayer = `l_video:${this.escapePublicId(audioTrack)}`;
      parts.push(`${audioLayer}`, "fl_layer_apply" /* mix default */);
    }

    // Frame rate
    if (fps && fps > 0) {
      parts.push(`fps_${fps}`);
    }

    // Output format mp4
    parts.push("f_mp4");

    // Compose URL manually to retain full control
    const base = `https://res.cloudinary.com/${this.cloudName}/video/upload/`;
    const transformation = parts.join("/");

    // Using a 1px transparent video placeholder as base is not required when using timeline overlays: Cloudinary constructs a timeline from the first layer.
    // We still need a public ID at the end. Cloudinary ignores it when using only timeline overlays, so we can use an arbitrary placeholder such as "empty".
    const url = `${base}${transformation}/empty.mp4`;

    return url;
  }

  // Apply global effects to an existing public ID and return a delivery URL
  async applyEffects(publicId: string, effects: Effect[]): Promise<string> {
    const effectParts = effects.map((e) => this.effectToString(e)).filter(Boolean) as string[];
    const base = `https://res.cloudinary.com/${this.cloudName}/video/upload/`;
    const path = `${effectParts.join("/")}/${this.escapePublicId(publicId)}.mp4`;
    return `${base}${path}`;
  }

  // Helpers
  private async ensurePublicId(urlOrId: string): Promise<string> {
    // If the string already looks like a Cloudinary URL containing this cloud name, parse its public ID
    if (urlOrId.includes("res.cloudinary.com") && urlOrId.includes(`/${this.cloudName}/`)) {
      const parsed = this.parsePublicIdFromUrl(urlOrId);
      if (parsed) return parsed;
    }

    // If it looks like a bare public id (contains no scheme and no spaces), use as is
    if (!/^https?:\/\//.test(urlOrId) && !urlOrId.includes(" ")) {
      return urlOrId.replace(/\.(jpg|jpeg|png|webp|gif)$/i, "");
    }

    // Otherwise upload and return the resulting public_id
    const res: UploadApiResponse = await cloudinary.uploader.upload(urlOrId, {
      folder: "pawspace/transformations",
      resource_type: "image",
      overwrite: true,
      use_filename: true,
      unique_filename: false,
    });
    return res.public_id;
  }

  private parsePublicIdFromUrl(assetUrl: string): string | null {
    try {
      const u = new URL(assetUrl);
      const path = u.pathname; // e.g. /demo/image/upload/v169999/path/to/id.jpg
      const uploadIdx = path.indexOf("/upload/");
      if (uploadIdx === -1) return null;
      const afterUpload = path.substring(uploadIdx + "/upload/".length);
      // Strip version (v123456)
      const withoutVersion = afterUpload.replace(/^v\d+\//, "");
      // Strip extension
      return withoutVersion.replace(/\.[^/.]+$/, "");
    } catch (_) {
      return null;
    }
  }

  private transitionToEffect(t: TransitionType, durationSec: number): string {
    const d = Math.max(0.2, Number(durationSec.toFixed(2)));
    switch (t) {
      case "fade":
        return `e_transition:fade:duration_${d}`;
      case "slideLeft":
        return `e_transition:slide_h_neg:duration_${d}`; // horizontal negative direction
      case "slideRight":
        return `e_transition:slide_h_pos:duration_${d}`;
      case "slideUp":
        return `e_transition:slide_v_neg:duration_${d}`;
      case "slideDown":
        return `e_transition:slide_v_pos:duration_${d}`;
      case "wipe":
        return `e_transition:wipe:duration_${d}`;
      case "none":
      default:
        return `e_transition:fade:duration_${d}`;
    }
  }

  private textOverlayToLayer(overlay: TextOverlay): string {
    const font = `${overlay.fontFamily || "Arial"}_${overlay.fontSize || 32}`;
    const encodedText = encodeURIComponent(overlay.text);
    const color = overlay.color ? `,co_${overlay.color.replace("#", "rgb:")}` : "";
    const position = `,g_north_west,x_${Math.round(overlay.position.x)},y_${Math.round(
      overlay.position.y
    )}`;
    const timing = `${overlay.startAt != null ? `,so_${overlay.startAt}` : ""}${
      overlay.endAt != null ? `,eo_${overlay.endAt}` : ""
    }`;

    // l_text:font:text/fl_layer_apply
    return `l_text:${font}:${encodedText}${color}${position}${timing}/fl_layer_apply`;
  }

  private effectToString(effect: Effect): string | null {
    const v = effect.value != null ? `:${effect.value}` : "";
    switch (effect.kind) {
      case "grayscale":
        return "e_grayscale";
      case "blur":
        return `e_blur${v}`;
      case "sharpen":
        return `e_sharpen${v}`;
      case "brightness":
        return `e_brightness${v}`;
      case "contrast":
        return `e_contrast${v}`;
      case "saturation":
        return `e_saturation${v}`;
      case "sepia":
        return `e_sepia${v}`;
      case "vignette":
        return `e_vignette${v}`;
      case "zoompan":
        return `e_zoompan${v}`;
      default:
        return null;
    }
  }

  private escapePublicId(publicId: string): string {
    // Cloudinary public IDs may contain slashes, spaces, etc. Encode carefully: slashes should remain as path separators.
    return publicId
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
  }
}

export default CloudinaryService;
