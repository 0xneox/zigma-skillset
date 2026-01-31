/**
 * Moltbook API client
 */

import { logger } from './logger.js';

const MOLTBOOK_API_KEY = process.env.MOLTBOOK_API_KEY;
const MOLTBOOK_BASE_URL = process.env.MOLTBOOK_BASE_URL || 'https://www.moltbook.com/api/v1';

export interface MoltbookPost {
  submolt: string;
  title: string;
  content: string;
}

/**
 * Post to Moltbook
 */
export async function postToMoltbook(post: MoltbookPost): Promise<boolean> {
  if (!MOLTBOOK_API_KEY) {
    logger.warn('MOLTBOOK_API_KEY not set, skipping post');
    return false;
  }

  try {
    const response = await fetch(`${MOLTBOOK_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MOLTBOOK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error('Moltbook post failed', { status: response.status, error });
      return false;
    }

    const data = await response.json() as { success: boolean; post: { id: string; url: string } };
    logger.info('Posted to Moltbook', { postId: data.post.id, url: data.post.url });
    return true;
  } catch (error) {
    logger.error('Moltbook post error', { error });
    return false;
  }
}

/**
 * Get Moltbook feed
 */
export async function getMoltbookFeed(submolt?: string, limit = 25): Promise<unknown[]> {
  if (!MOLTBOOK_API_KEY) {
    return [];
  }

  try {
    const url = submolt
      ? `${MOLTBOOK_BASE_URL}/posts?submolt=${submolt}&limit=${limit}`
      : `${MOLTBOOK_BASE_URL}/posts?limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${MOLTBOOK_API_KEY}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json() as { posts: unknown[] };
    return data.posts || [];
  } catch (error) {
    logger.error('Failed to fetch Moltbook feed', { error });
    return [];
  }
}

/**
 * Get comments on a post
 */
export async function getPostComments(postId: string): Promise<Array<{ id: string; author: string; content: string; created_at: string }>> {
  if (!MOLTBOOK_API_KEY) {
    return [];
  }

  try {
    const response = await fetch(`${MOLTBOOK_BASE_URL}/posts/${postId}/comments`, {
      headers: {
        'Authorization': `Bearer ${MOLTBOOK_API_KEY}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json() as { comments: Array<{ id: string; author: string; content: string; created_at: string }> };
    return data.comments || [];
  } catch (error) {
    logger.error('Failed to fetch comments', { error });
    return [];
  }
}

/**
 * Reply to a comment
 */
export async function replyToComment(postId: string, commentId: string, content: string): Promise<boolean> {
  if (!MOLTBOOK_API_KEY) {
    return false;
  }

  try {
    const response = await fetch(`${MOLTBOOK_BASE_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MOLTBOOK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        parent_id: commentId,
      }),
    });

    if (!response.ok) {
      logger.error('Failed to reply to comment', { status: response.status });
      return false;
    }

    logger.info('Replied to comment', { postId, commentId });
    return true;
  } catch (error) {
    logger.error('Reply error', { error });
    return false;
  }
}

/**
 * Get my posts
 */
export async function getMyPosts(limit = 10): Promise<Array<{ id: string; title: string; created_at: string }>> {
  if (!MOLTBOOK_API_KEY) {
    return [];
  }

  try {
    const response = await fetch(`${MOLTBOOK_BASE_URL}/agents/me`, {
      headers: {
        'Authorization': `Bearer ${MOLTBOOK_API_KEY}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json() as { agent: { posts?: Array<{ id: string; title: string; created_at: string }> } };
    return data.agent.posts?.slice(0, limit) || [];
  } catch (error) {
    logger.error('Failed to fetch my posts', { error });
    return [];
  }
}
