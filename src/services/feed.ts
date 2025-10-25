import type { Comment, FeedResponse, ServiceType, Transformation, UserProfile } from '../types/feed';

// Mock in-memory store to simulate backend
const mockUsers: UserProfile[] = [
  { id: 'u1', username: 'fadesbylee', display_name: 'Lee the Barber', avatar_url: undefined, is_provider: true, is_following: false },
  { id: 'u2', username: 'glamjules', display_name: 'Jules MUA', avatar_url: undefined, is_provider: true, is_following: true },
  { id: 'u3', username: 'you', display_name: 'You', avatar_url: undefined, is_provider: false, is_following: false },
];

let mockTransformations: Transformation[] = Array.from({ length: 24 }).map((_, i) => {
  const provider = mockUsers[(i % 2) + 0];
  const id = `t${i + 1}`;
  const createdAt = new Date(Date.now() - i * 36_00_000).toISOString();
  return {
    id,
    provider,
    service_type: (['haircut', 'makeup', 'nails', 'skincare'][i % 4] as ServiceType) ?? 'other',
    caption: `Before and after magic #${i + 1}`,
    before: {
      id: `${id}-b`,
      type: 'image',
      url: `https://picsum.photos/seed/${id}b/600/800`,
      aspect_ratio: 3 / 4,
    },
    after: {
      id: `${id}-a`,
      type: 'image',
      url: `https://picsum.photos/seed/${id}a/600/800`,
      aspect_ratio: 3 / 4,
    },
    likes_count: Math.floor(Math.random() * 5000),
    comments_count: Math.floor(Math.random() * 200),
    is_liked: Math.random() > 0.7,
    is_saved: Math.random() > 0.8,
    created_at: createdAt,
  } as Transformation;
});

let mockComments: Record<string, Comment[]> = Object.fromEntries(
  mockTransformations.map((t) => [
    t.id,
    [
      {
        id: `${t.id}-c1`,
        transformation_id: t.id,
        user_id: mockUsers[1].id,
        user: mockUsers[1],
        text: 'Incredible work! 🔥',
        likes_count: 5,
        is_liked: false,
        created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
    ],
  ])
);

const networkDelay = (min = 200, max = 650) =>
  new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min) + min)));

class FeedService {
  getById(id: string): Transformation | undefined {
    return mockTransformations.find((t) => t.id === id);
  }

  async getFeed(page: number, limit: number): Promise<FeedResponse> {
    await networkDelay();
    const start = (page - 1) * limit;
    const end = start + limit;
    const slice = mockTransformations.slice(start, end);
    return {
      transformations: slice,
      next_page: end < mockTransformations.length ? page + 1 : null,
      has_more: end < mockTransformations.length,
    };
  }

  async getFeedByService(serviceType: ServiceType): Promise<Transformation[]> {
    await networkDelay();
    return mockTransformations.filter((t) => t.service_type === serviceType);
  }

  async searchTransformations(query: string): Promise<Transformation[]> {
    await networkDelay();
    const q = query.toLowerCase();
    return mockTransformations.filter(
      (t) =>
        t.caption?.toLowerCase().includes(q) ||
        t.provider.display_name.toLowerCase().includes(q) ||
        t.provider.username.toLowerCase().includes(q)
    );
  }

  async likeTransformation(id: string): Promise<void> {
    await networkDelay();
    mockTransformations = mockTransformations.map((t) =>
      t.id === id && !t.is_liked
        ? { ...t, is_liked: true, likes_count: t.likes_count + 1 }
        : t
    );
  }

  async unlikeTransformation(id: string): Promise<void> {
    await networkDelay();
    mockTransformations = mockTransformations.map((t) =>
      t.id === id && t.is_liked
        ? { ...t, is_liked: false, likes_count: Math.max(0, t.likes_count - 1) }
        : t
    );
  }

  async addComment(transformationId: string, text: string, parent_comment_id?: string): Promise<Comment> {
    await networkDelay();
    const you = mockUsers[2];
    const c: Comment = {
      id: `${transformationId}-c${Math.random().toString(36).slice(2, 8)}`,
      transformation_id: transformationId,
      user_id: you.id,
      user: you,
      text,
      likes_count: 0,
      is_liked: false,
      parent_comment_id,
      created_at: new Date().toISOString(),
    };

    if (!mockComments[transformationId]) mockComments[transformationId] = [];

    if (parent_comment_id) {
      const parent = mockComments[transformationId].find((x) => x.id === parent_comment_id);
      if (parent) {
        parent.replies = parent.replies ? [...parent.replies, c] : [c];
      } else {
        mockComments[transformationId].push(c);
      }
    } else {
      mockComments[transformationId].push(c);
    }

    mockTransformations = mockTransformations.map((t) =>
      t.id === transformationId ? { ...t, comments_count: t.comments_count + 1 } : t
    );

    return c;
  }

  async deleteComment(commentId: string): Promise<void> {
    await networkDelay();
    for (const [tid, comments] of Object.entries(mockComments)) {
      const idx = comments.findIndex((c) => c.id === commentId);
      if (idx >= 0) {
        comments.splice(idx, 1);
        mockTransformations = mockTransformations.map((t) =>
          t.id === tid ? { ...t, comments_count: Math.max(0, t.comments_count - 1) } : t
        );
        return;
      }
      for (const c of comments) {
        if (c.replies) {
          const ridx = c.replies.findIndex((r) => r.id === commentId);
          if (ridx >= 0) {
            c.replies.splice(ridx, 1);
            return;
          }
        }
      }
    }
  }

  async likeComment(commentId: string): Promise<void> {
    await networkDelay();
    for (const comments of Object.values(mockComments)) {
      for (const c of comments) {
        if (c.id === commentId && !c.is_liked) {
          c.is_liked = true;
          c.likes_count += 1;
          return;
        }
        if (c.replies) {
          const r = c.replies.find((x) => x.id === commentId);
          if (r && !r.is_liked) {
            r.is_liked = true;
            r.likes_count += 1;
            return;
          }
        }
      }
    }
  }

  async saveTransformation(id: string): Promise<void> {
    await networkDelay();
    mockTransformations = mockTransformations.map((t) =>
      t.id === id ? { ...t, is_saved: true } : t
    );
  }

  async getSavedTransformations(): Promise<Transformation[]> {
    await networkDelay();
    return mockTransformations.filter((t) => t.is_saved);
  }

  async reportTransformation(_id: string, _reason: string): Promise<void> {
    await networkDelay();
  }

  async followUser(userId: string): Promise<void> {
    await networkDelay();
    mockTransformations = mockTransformations.map((t) =>
      t.provider.id === userId ? { ...t, provider: { ...t.provider, is_following: true } } : t
    );
  }

  async unfollowUser(userId: string): Promise<void> {
    await networkDelay();
    mockTransformations = mockTransformations.map((t) =>
      t.provider.id === userId ? { ...t, provider: { ...t.provider, is_following: false } } : t
    );
  }

  async getComments(transformationId: string): Promise<Comment[]> {
    await networkDelay();
    return mockComments[transformationId] ? JSON.parse(JSON.stringify(mockComments[transformationId])) : [];
  }
}

export const feedService = new FeedService();
export default feedService;
