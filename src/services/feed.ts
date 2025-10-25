import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share } from 'react-native';
import { Comment, FeedResponse, ServiceType, Transformation, UserProfile } from '../types/feed';

const STORAGE_KEYS = {
  likes: 'feed_likes',
  saves: 'feed_saves',
  follows: 'feed_follows',
  comments: 'feed_comments',
  cache: 'feed_cache',
};

// Mock data helpers
function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const MOCK_USERS: UserProfile[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `u_${i + 1}`,
  name: `Provider ${i + 1}`,
  username: `provider${i + 1}`,
  avatar_url: `https://i.pravatar.cc/150?img=${i + 10}`,
  is_provider: true,
  is_following: false,
  followers_count: Math.floor(Math.random() * 5000),
  following_count: Math.floor(Math.random() * 1000),
}));

const MOCK_MEDIA_IMAGES = [
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
  'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  'https://images.unsplash.com/photo-1511367461989-f85a21fda167',
];

const MOCK_TRANSFORMATIONS: Transformation[] = Array.from({ length: 40 }).map((_, i) => {
  const provider = randomItem(MOCK_USERS);
  const beforeUrl = randomItem(MOCK_MEDIA_IMAGES);
  const afterUrl = randomItem(MOCK_MEDIA_IMAGES);
  return {
    id: `t_${i + 1}`,
    provider,
    service_type: Object.values(ServiceType)[i % Object.values(ServiceType).length] as ServiceType,
    before: { type: 'image', url: `${beforeUrl}?w=800&auto=format&fit=crop` },
    after: { type: 'image', url: `${afterUrl}?w=800&auto=format&fit=crop` },
    caption: 'Loved working on this transformation! #glowup #style',
    tags: ['#glowup', '#style'],
    likes_count: Math.floor(Math.random() * 9000),
    comments_count: Math.floor(Math.random() * 250),
    is_liked: false,
    is_saved: false,
    created_at: new Date(Date.now() - i * 3600 * 1000).toISOString(),
    location_name: 'Studio City',
    price_estimate: Math.floor(Math.random() * 200) + 50,
  };
});

async function getSetFromStorage(key: string): Promise<Set<string>> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return new Set();
  try {
    const arr: string[] = JSON.parse(raw);
    return new Set(arr);
  } catch {
    return new Set();
  }
}

async function saveSetToStorage(key: string, set: Set<string>): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(Array.from(set)));
}

async function getCommentsMap(): Promise<Record<string, Comment[]>> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.comments);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

async function setCommentsMap(map: Record<string, Comment[]>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(map));
}

async function simulateNetwork<T>(fn: () => T, failRate = 0.1, minDelay = 250, maxDelay = 700): Promise<T> {
  await new Promise(r => setTimeout(r, Math.random() * (maxDelay - minDelay) + minDelay));
  if (Math.random() < failRate) throw new Error('Network error');
  return fn();
}

export const feedService = {
  // Get feed with pagination
  async getFeed(page: number, limit: number): Promise<FeedResponse> {
    try {
      const res = await simulateNetwork(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        const slice = MOCK_TRANSFORMATIONS.slice(start, end);
        return {
          transformations: slice,
          next_page: end < MOCK_TRANSFORMATIONS.length ? page + 1 : null,
          has_more: end < MOCK_TRANSFORMATIONS.length,
        } as FeedResponse;
      }, 0.15);

      await AsyncStorage.setItem(STORAGE_KEYS.cache, JSON.stringify(res));
      return res;
    } catch (err) {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.cache);
      if (cached) {
        try { return JSON.parse(cached) as FeedResponse; } catch {}
      }
      // Fallback to first page of mock
      const slice = MOCK_TRANSFORMATIONS.slice(0, limit);
      return { transformations: slice, next_page: 2, has_more: true };
    }
  },

  async getFeedByService(serviceType: ServiceType): Promise<Transformation[]> {
    return simulateNetwork(() => MOCK_TRANSFORMATIONS.filter(t => t.service_type === serviceType));
  },

  async searchTransformations(query: string): Promise<Transformation[]> {
    const lower = query.toLowerCase();
    return simulateNetwork(
      () => MOCK_TRANSFORMATIONS.filter(
        t =>
          t.caption?.toLowerCase().includes(lower) ||
          t.provider.name.toLowerCase().includes(lower) ||
          t.tags?.some(tag => tag.toLowerCase().includes(lower))
      )
    );
  },

  // Like/unlike transformation
  async likeTransformation(id: string): Promise<void> {
    const likes = await getSetFromStorage(STORAGE_KEYS.likes);
    likes.add(id);
    await saveSetToStorage(STORAGE_KEYS.likes, likes);
    await simulateNetwork(() => undefined, 0.2);
  },

  async unlikeTransformation(id: string): Promise<void> {
    const likes = await getSetFromStorage(STORAGE_KEYS.likes);
    likes.delete(id);
    await saveSetToStorage(STORAGE_KEYS.likes, likes);
    await simulateNetwork(() => undefined, 0.2);
  },

  // Comment on transformation
  async addComment(transformationId: string, text: string, user?: UserProfile, parent_comment_id?: string): Promise<Comment> {
    const map = await getCommentsMap();
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      transformation_id: transformationId,
      user_id: user?.id ?? 'me',
      user: user ?? {
        id: 'me',
        name: 'You',
        username: 'you',
        avatar_url: 'https://i.pravatar.cc/150?u=me',
        is_provider: false,
      },
      text,
      likes_count: 0,
      is_liked: false,
      parent_comment_id,
      replies: [],
      created_at: new Date().toISOString(),
    };
    const list = map[transformationId] ?? [];

    if (parent_comment_id) {
      const parentIndex = list.findIndex(c => c.id === parent_comment_id);
      if (parentIndex !== -1) {
        const parent = list[parentIndex];
        parent.replies = [newComment, ...(parent.replies ?? [])];
      } else {
        list.unshift(newComment);
      }
    } else {
      list.unshift(newComment);
    }

    map[transformationId] = list;
    await setCommentsMap(map);
    await simulateNetwork(() => undefined, 0.15);
    return newComment;
  },

  async deleteComment(commentId: string): Promise<void> {
    const map = await getCommentsMap();
    for (const [tId, list] of Object.entries(map)) {
      const idx = list.findIndex(c => c.id === commentId);
      if (idx !== -1) {
        list.splice(idx, 1);
        map[tId] = list;
        await setCommentsMap(map);
        await simulateNetwork(() => undefined, 0.15);
        return;
      }
      // Search replies
      for (const c of list) {
        if (c.replies) {
          const rIdx = c.replies.findIndex(r => r.id === commentId);
          if (rIdx !== -1) {
            c.replies.splice(rIdx, 1);
            await setCommentsMap(map);
            await simulateNetwork(() => undefined, 0.15);
            return;
          }
        }
      }
    }
  },

  async likeComment(commentId: string): Promise<void> {
    // Store liked comment ids locally
    const key = 'liked_comments';
    const set = await getSetFromStorage(key);
    set.add(commentId);
    await saveSetToStorage(key, set);
    await simulateNetwork(() => undefined, 0.15);
  },

  // Save transformation (bookmark)
  async saveTransformation(id: string): Promise<void> {
    const saves = await getSetFromStorage(STORAGE_KEYS.saves);
    saves.add(id);
    await saveSetToStorage(STORAGE_KEYS.saves, saves);
    await simulateNetwork(() => undefined, 0.15);
  },

  async getSavedTransformations(): Promise<Transformation[]> {
    const saves = await getSetFromStorage(STORAGE_KEYS.saves);
    const list = MOCK_TRANSFORMATIONS.filter(t => saves.has(t.id));
    return simulateNetwork(() => list);
  },

  // Report transformation
  async reportTransformation(id: string, reason: string): Promise<void> {
    console.warn('Reported', { id, reason });
    await simulateNetwork(() => undefined, 0.5);
  },

  // Follow/unfollow user
  async followUser(userId: string): Promise<void> {
    const follows = await getSetFromStorage(STORAGE_KEYS.follows);
    follows.add(userId);
    await saveSetToStorage(STORAGE_KEYS.follows, follows);
    await simulateNetwork(() => undefined, 0.15);
  },

  async unfollowUser(userId: string): Promise<void> {
    const follows = await getSetFromStorage(STORAGE_KEYS.follows);
    follows.delete(userId);
    await saveSetToStorage(STORAGE_KEYS.follows, follows);
    await simulateNetwork(() => undefined, 0.15);
  },

  async shareTransformation(transformation: Transformation): Promise<void> {
    try {
      await Share.share({
        message: `${transformation.provider.name}'s ${transformation.service_type} transformation: ${transformation.after.url}`,
      });
    } catch {}
  },

  async getComments(transformationId: string): Promise<Comment[]> {
    const map = await getCommentsMap();
    return map[transformationId] ?? [];
  },
};

export default feedService;
