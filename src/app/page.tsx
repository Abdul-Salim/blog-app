"use client";

import Link from "next/link";
import { usePosts } from "@/hooks/use-posts";
import { PostCard } from "@/components/blog/post-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { data, loading } = usePosts({ published: true, limit: 6 });

  return (
    <div className="space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Welcome to my Personal Blog
        </h1>
        <p className="text-xl text-muted-foreground mx-auto max-w-2xl">
          Discover thoughts, insights, and stories about programming, technology, and more.
        </p>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Latest Posts</h2>
          <Button asChild variant="outline">
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {data?.posts.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No posts found. Check back later!</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-52 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
}
