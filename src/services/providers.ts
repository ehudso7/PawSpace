import { supabase } from "../lib/supabase";
import { ProviderProfile, Service, TransformationItem, BusinessHours, Location, Review } from "../types/booking";

export async function getProviderProfile(providerId: string): Promise<ProviderProfile | null> {
  const { data, error } = await supabase
    .from("providers")
    .select(
      `
      id,
      full_name,
      avatar_url,
      cover_photo_url,
      bio,
      email,
      phone,
      website,
      rating,
      total_reviews,
      total_bookings,
      location,
      business_hours,
      services:services(*),
      portfolio_items:portfolio_items(*),
      reviews:reviews(*)
    `
    )
    .eq("id", providerId)
    .single();

  if (error) {
    console.error("getProviderProfile error", error);
    return null;
  }

  // Types mapping (ensures proper shapes)
  const services: Service[] = (data.services || []).map((s: any) => ({
    id: String(s.id),
    title: s.title,
    description: s.description ?? undefined,
    durationMinutes: s.duration_minutes ?? s.durationMinutes ?? 60,
    priceCents: s.price_cents ?? s.priceCents ?? 0,
    currency: s.currency ?? "USD",
    category: s.category ?? undefined,
  }));

  const portfolio_items: TransformationItem[] = (data.portfolio_items || []).map((p: any) => ({
    id: String(p.id),
    beforeImageUrl: p.before_image_url,
    afterImageUrl: p.after_image_url,
    caption: p.caption ?? undefined,
  }));

  const location: Location = data.location ?? {};
  const business_hours: BusinessHours = data.business_hours ?? {};
  const reviews: Review[] = (data.reviews || []).map((r: any) => ({
    id: String(r.id),
    rating: r.rating ?? 0,
    comment: r.comment ?? '',
    created_at: r.created_at ?? new Date().toISOString(),
    reviewer_name: r.reviewer_name ?? undefined,
    reviewer_avatar_url: r.reviewer_avatar_url ?? undefined,
  }));

  const profile: ProviderProfile = {
    id: String(data.id),
    full_name: data.full_name,
    avatar_url: data.avatar_url ?? undefined,
    cover_photo_url: data.cover_photo_url ?? undefined,
    bio: data.bio ?? "",
    location,
    email: data.email ?? undefined,
    phone: data.phone ?? undefined,
    website: data.website ?? undefined,
    rating: data.rating ?? 0,
    total_reviews: data.total_reviews ?? 0,
    total_bookings: data.total_bookings ?? 0,
    services,
    business_hours,
    portfolio_items,
  };

  return profile;
}
