import { useState, useEffect } from "react";
import type { PaginatedPosts, ApiPaginatedPosts, ApiPost } from "@/types/blog";

export function usePosts(options: {
  page?: number;
  limit?: number;
  published?: boolean;
  category?: string;
} = {}) {
  const [data, setData] = useState<PaginatedPosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        const searchParams = new URLSearchParams();
        if (options.page) {
          searchParams.set("page", options.page.toString());
        }
        if (options.limit) {
          searchParams.set("limit", options.limit.toString());
        }
        if (options.published !== undefined) {
          searchParams.set("published", options.published.toString());
        }
        if (options.category) {
          searchParams.set("category", options.category);
        }

        const response = await fetch(`/api/posts?${searchParams}`);

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const postsData: ApiPaginatedPosts = await response.json();

        // Convert date strings to Date objects
        const postsWithDates: PaginatedPosts = {
          ...postsData,
          posts: postsData.posts.map((post: ApiPost) => ({
            ...post,
            createdAt: new Date(post.createdAt),
            updatedAt: new Date(post.updatedAt),
          })),
        };

        setData(postsWithDates);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [options.page, options.limit, options.published, options.category]);

  return { data, loading, error };
}
