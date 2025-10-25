import { useState, useEffect, useCallback } from 'react';
import { feedService } from '../services/feed';
import { Comment, CommentState, ApiError, UserProfile } from '../types';

interface UseCommentsOptions {
  transformationId: string;
  pageSize?: number;
  autoRefresh?: boolean;
}

export const useComments = (options: UseCommentsOptions) => {
  const { transformationId, pageSize = 50, autoRefresh = false } = options;

  const [state, setState] = useState<CommentState>({
    comments: [],
    isLoading: false,
    isPosting: false,
    error: null,
    replyingTo: null,
  });

  const loadComments = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await feedService.getComments(transformationId, 1, pageSize);
      
      setState(prev => ({
        ...prev,
        comments: response.comments,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: (error as ApiError).message || 'Failed to load comments',
        isLoading: false,
      }));
    }
  }, [transformationId, pageSize]);

  const addComment = useCallback(async (text: string, parentCommentId?: string) => {
    try {
      setState(prev => ({ ...prev, isPosting: true, error: null }));
      
      const newComment = await feedService.addComment(transformationId, text, parentCommentId);
      
      setState(prev => {
        let updatedComments;
        
        if (parentCommentId) {
          // Add as reply to existing comment
          updatedComments = prev.comments.map(comment => {
            if (comment.id === parentCommentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              };
            }
            return comment;
          });
        } else {
          // Add as top-level comment
          updatedComments = [newComment, ...prev.comments];
        }
        
        return {
          ...prev,
          comments: updatedComments,
          isPosting: false,
          replyingTo: null,
        };
      });
      
      return newComment;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: (error as ApiError).message || 'Failed to post comment',
        isPosting: false,
      }));
      throw error;
    }
  }, [transformationId]);

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      await feedService.deleteComment(commentId);
      
      setState(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => {
          if (comment.id === commentId) {
            return false;
          }
          // Also remove from replies
          if (comment.replies) {
            comment.replies = comment.replies.filter(reply => reply.id !== commentId);
          }
          return true;
        }),
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: (error as ApiError).message || 'Failed to delete comment',
      }));
    }
  }, []);

  const toggleCommentLike = useCallback(async (commentId: string) => {
    const findComment = (comments: Comment[]): Comment | null => {
      for (const comment of comments) {
        if (comment.id === commentId) return comment;
        if (comment.replies) {
          const found = findComment(comment.replies);
          if (found) return found;
        }
      }
      return null;
    };

    const comment = findComment(state.comments);
    if (!comment) return;

    const wasLiked = comment.is_liked;
    const newLikesCount = wasLiked ? comment.likes_count - 1 : comment.likes_count + 1;

    // Optimistic update
    const updateCommentInTree = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        if (c.id === commentId) {
          return { ...c, is_liked: !wasLiked, likes_count: newLikesCount };
        }
        if (c.replies) {
          return { ...c, replies: updateCommentInTree(c.replies) };
        }
        return c;
      });
    };

    setState(prev => ({
      ...prev,
      comments: updateCommentInTree(prev.comments),
    }));

    try {
      if (wasLiked) {
        await feedService.unlikeComment(commentId);
      } else {
        await feedService.likeComment(commentId);
      }
    } catch (error) {
      // Revert optimistic update
      setState(prev => ({
        ...prev,
        comments: updateCommentInTree(prev.comments).map(c => {
          if (c.id === commentId) {
            return { ...c, is_liked: wasLiked, likes_count: comment.likes_count };
          }
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map(reply =>
                reply.id === commentId
                  ? { ...reply, is_liked: wasLiked, likes_count: comment.likes_count }
                  : reply
              ),
            };
          }
          return c;
        }),
      }));
      console.error('Failed to toggle comment like:', error);
    }
  }, [state.comments]);

  const setReplyingTo = useCallback((comment: Comment | null) => {
    setState(prev => ({ ...prev, replyingTo: comment }));
  }, []);

  const refresh = useCallback(() => {
    loadComments();
  }, [loadComments]);

  // Initial load
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        if (!state.isLoading && !state.isPosting) {
          loadComments();
        }
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, loadComments, state.isLoading, state.isPosting]);

  return {
    ...state,
    addComment,
    deleteComment,
    toggleCommentLike,
    setReplyingTo,
    refresh,
  };
};