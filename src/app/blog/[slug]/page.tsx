"use client";

import Link from "next/link";
import Image from "next/image";
import { usePost } from "@/hooks/use-post";
import { formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LucideTrash, LucideTrash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Category } from "@/types/blog";
import { use } from "react";

export default function PostPage({ params }: { params: any }) {
  const resolvedParams: { slug: string } = use(params);
  const slug = resolvedParams.slug;

  const { post, loading, error } = usePost(params.slug);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const categories = post?.categories as Category[];

  if (error) {
    if (error.message === "Post not found") {
      notFound();
    }
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/blog">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Error loading post</h1>
          <p className="text-muted-foreground mt-2">
            {error.message || "Something went wrong."}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/blog">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/blog">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/posts/edit/${post.slug}`}>Edit</Link>
            </Button>
            <Button variant="outline" size="sm">
              Delete
            </Button>
          </div>
        )}
      </div>

      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="font-bold text-3xl md:text-4xl mb-4">{post.title}</h1>

        <div className="flex items-center space-x-4 mt-4 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                {post.author.name.charAt(0)}
              </div>
            )}
            <span>{post.author.name}</span>
          </div>
          <span>•</span>
          <time dateTime={post.createdAt.toISOString()}>
            {formatDistance(post.createdAt, new Date(), { addSuffix: true })}
          </time>
          <span>•</span>
          <div className="flex flex-wrap gap-2">
            {categories?.map((category) => (
              <Badge key={category?.id} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {post.coverImage && (
          <div className="relative aspect-video w-full mb-8 overflow-hidden rounded-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
