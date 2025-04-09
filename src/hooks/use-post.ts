import { useState, useEffect } from "react";
import type { Post, ApiPost } from "@/types/blog";

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/posts/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Post not found");
          }
          throw new Error("Failed to fetch post");
        }

        const postData: ApiPost = await response.json();

        // Convert date strings to Date objects
        const postWithDates: Post = {
          ...postData,
          createdAt: new Date(postData.createdAt),
          updatedAt: new Date(postData.updatedAt),
        };

        setPost(postWithDates);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  return { post, loading, error };
}
