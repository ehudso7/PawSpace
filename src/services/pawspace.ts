export type PrivacySetting = "public" | "private";

export interface ProviderTag {
  name: string;
  url: string;
}

export interface PublishParams {
  videoUrl: string;
  caption: string;
  hashtags: string[];
  privacy: PrivacySetting;
  provider?: ProviderTag;
  // future: location, taggedPets, etc.
}

export interface PublishResult {
  success: boolean;
  id?: string;
  shareUrl?: string;
  error?: string;
}

export class PawSpaceService {
  private readonly apiBase: string;

  constructor(apiBase?: string) {
    this.apiBase = apiBase ?? process.env.PAWSPACE_API_URL ?? "https://api.pawspace.example.com";
  }

  async publishPost(params: PublishParams): Promise<PublishResult> {
    try {
      const res = await fetch(`${this.apiBase}/v1/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: params.videoUrl,
          caption: params.caption,
          hashtags: params.hashtags,
          privacy: params.privacy,
          provider: params.provider,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        return { success: false, error: `HTTP ${res.status}: ${text}` };
      }

      const json = (await res.json()) as { id: string; shareUrl?: string };
      return { success: true, id: json.id, shareUrl: json.shareUrl };
    } catch (err: any) {
      return { success: false, error: err?.message ?? "Unknown error" };
    }
  }
}

export default PawSpaceService;
