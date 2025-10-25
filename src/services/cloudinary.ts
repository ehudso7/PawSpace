import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { CloudinaryConfig, getCloudinaryConfigFromEnv } from "../config/cloudinary";
import {
  Effect,
  TextOverlay,
  TransitionType,
  VideoParams,
} from "../types/media";

export class CloudinaryService {
  private isConfigured = false;

  constructor(private readonly config?: CloudinaryConfig) {
    if (config) {
      cloudinary.config({
        cloud_name: config.cloud_name,
        api_key: config.api_key,
        api_secret: config.api_secret,
        secure: true,
      });
      this.isConfigured = true;
    }
  }

  static fromEnv(): CloudinaryService {
    const config = getCloudinaryConfigFromEnv();
    return new CloudinaryService(config);
  }

  private ensureConfigured(): void {
    if (this.isConfigured) return;
    const cfg = this.config ?? getCloudinaryConfigFromEnv();
    cloudinary.config({
      cloud_name: cfg.cloud_name,
      api_key: cfg.api_key,
      api_secret: cfg.api_secret,
      secure: true,
    });
    this.isConfigured = true;
  }

  async uploadImage(uri: string, folder: string): Promise<string> {
    this.ensureConfigured();
    const response: UploadApiResponse = await cloudinary.uploader.upload(uri, {
      folder,
      resource_type: "image",
      unique_filename: true,
      use_filename: true,
    });
    return response.public_id;
  }

  async createTransformationVideo(params: VideoParams): Promise<string> {
    this.ensureConfigured();

    const folder = params.folder ?? "transformations";

    // Upload images to Cloudinary (remote URLs supported)
    const [beforeUpload, afterUpload] = await Promise.all([
      cloudinary.uploader.upload(params.beforeImageUrl, {
        folder,
        resource_type: "image",
        unique_filename: true,
        use_filename: true,
      }),
      cloudinary.uploader.upload(params.afterImageUrl, {
        folder,
        resource_type: "image",
        unique_filename: true,
        use_filename: true,
      }),
    ]);

    const beforePublicId = beforeUpload.public_id;
    const afterPublicId = afterUpload.public_id;

    const width = params.width ?? 1080;
    const height = params.height ?? 1920;
    const fps = params.fps ?? 30;

    const perImageDuration = Math.max(0.5, params.duration / 2);
    const transitionEffect = this.mapTransition(params.transition);

    // Build optional overlay transformations for text
    const textOverlays = (params.textOverlays ?? []).map((overlay) =>
      this.toTextOverlayTransformation(overlay)
    );

    // Use Cloudinary's slideshow API to generate MP4 from images
    const publicId = `${folder}/xform_${Date.now()}`;

    const manifest: any = {
      timeline: [
        {
          media: { public_id: beforePublicId, type: "image" },
          duration: perImageDuration,
          transition: { effect: transitionEffect, duration: 1.0 },
          media_transformation: [
            { width, height, crop: "fill", gravity: "auto" },
            ...textOverlays,
          ],
        },
        {
          media: { public_id: afterPublicId, type: "image" },
          duration: perImageDuration,
          media_transformation: [
            { width, height, crop: "fill", gravity: "auto" },
            ...textOverlays,
          ],
        },
      ],
      soundtrack: params.audioTrack
        ? { soundtrack_url: params.audioTrack }
        : undefined,
      fps,
      width,
      height,
      // format defaults to mp4
    };

    const result = await cloudinary.uploader.create_slideshow({
      manifest_json: manifest,
      public_id: publicId,
      notification_url: undefined,
      // eager: [{ format: "mp4" }], // derived format
    } as any);

    // Response contains secure_url when ready or a status with public_id
    if ((result as any).secure_url) {
      return (result as any).secure_url as string;
    }

    // Fallback: compose URL to the video asset (may still be processing)
    return cloudinary.url(publicId, {
      resource_type: "video",
      format: "mp4",
      secure: true,
    });
  }

  async applyEffects(publicId: string, effects: Effect[]): Promise<string> {
    this.ensureConfigured();
    const transformation = effects
      .map((e) => this.mapEffectToTransformation(e))
      .filter(Boolean) as Array<Record<string, unknown>>;

    return cloudinary.url(publicId, {
      resource_type: "video",
      format: "mp4",
      secure: true,
      transformation,
    });
  }

  private toTextOverlayTransformation(overlay: TextOverlay): Record<string, any> {
    const { text, fontFamily, fontSize, color, opacity, position, startTime, duration } = overlay;

    const gravity = typeof position === "string" ? position : undefined;
    const x = typeof position === "object" ? position.x : undefined;
    const y = typeof position === "object" ? position.y : undefined;

    const layer: Record<string, any> = {
      overlay: {
        font_family: fontFamily ?? "Arial",
        font_size: fontSize ?? 40,
        text,
      },
      color: color ?? "white",
      opacity: typeof opacity === "number" ? opacity : 100,
      gravity: gravity ?? (position ? undefined : "south"),
      x,
      y,
    };

    if (typeof startTime === "number") layer.start_offset = startTime;
    if (typeof duration === "number") layer.duration = duration;

    return layer;
  }

  private mapTransition(t: TransitionType): string {
    switch (t) {
      case "fade":
        return "fade";
      case "wipeLeft":
        return "wipeleft";
      case "wipeRight":
        return "wiperight";
      case "slideUp":
        return "slideup";
      case "slideDown":
        return "slidedown";
      case "slideLeft":
        return "slideleft";
      case "slideRight":
        return "slideright";
      case "crossZoom":
        return "crosszoom";
      case "circleOpen":
        return "circleopen";
      case "circleClose":
        return "circleclose";
      default:
        return "fade";
    }
  }

  private mapEffectToTransformation(effect: Effect): Record<string, unknown> | null {
    const value = effect.value;
    switch (effect.name) {
      case "grayscale":
        return { effect: "grayscale" };
      case "sepia":
        return { effect: "sepia" };
      case "blur":
        return { effect: `blur:${Math.max(1, Math.round(value ?? 100))}` };
      case "sharpen":
        return { effect: "sharpen" };
      case "brightness":
        return { effect: `brightness:${Math.max(-99, Math.min(100, Math.round(value ?? 20)))}` };
      case "contrast":
        return { effect: `contrast:${Math.max(-99, Math.min(100, Math.round(value ?? 20)))}` };
      case "saturation":
        return { effect: `saturation:${Math.max(-99, Math.min(100, Math.round(value ?? 20)))}` };
      case "vibrance":
        return { effect: `vibrance:${Math.max(-99, Math.min(100, Math.round(value ?? 20)))}` };
      case "zoomIn":
        return { effect: `zoompan:duration_${(value ?? 1.5).toFixed(1)}:zoom_1.2` };
      case "zoomOut":
        return { effect: `zoompan:duration_${(value ?? 1.5).toFixed(1)}:zoom_0.8` };
      case "slowMotion":
        return { effect: `accelerate:-${Math.max(5, Math.round(value ?? 30))}` };
      default:
        return null;
    }
  }
}

export default CloudinaryService;