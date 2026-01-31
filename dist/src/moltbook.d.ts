/**
 * Moltbook API client
 */
export interface MoltbookPost {
    submolt: string;
    title: string;
    content: string;
}
/**
 * Post to Moltbook
 */
export declare function postToMoltbook(post: MoltbookPost): Promise<boolean>;
/**
 * Get Moltbook feed
 */
export declare function getMoltbookFeed(submolt?: string, limit?: number): Promise<unknown[]>;
/**
 * Get comments on a post
 */
export declare function getPostComments(postId: string): Promise<Array<{
    id: string;
    author: string;
    content: string;
    created_at: string;
}>>;
/**
 * Reply to a comment
 */
export declare function replyToComment(postId: string, commentId: string, content: string): Promise<boolean>;
/**
 * Get my posts
 */
export declare function getMyPosts(limit?: number): Promise<Array<{
    id: string;
    title: string;
    created_at: string;
}>>;
//# sourceMappingURL=moltbook.d.ts.map