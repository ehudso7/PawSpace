export type Transformation = {
  id: string;
  userId: string;
  beforeUrl: string;
  afterUrl: string;
  caption?: string;
  createdAt: string; // ISO
};

export async function fetchFeed(): Promise<Transformation[]> {
  // Placeholder
  return [];
}

export async function fetchTransformation(id: string): Promise<Transformation | null> {
  // Placeholder
  return null;
}
