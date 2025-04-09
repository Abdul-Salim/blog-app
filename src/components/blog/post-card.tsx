import Link from "next/link";
import Image from "next/image";
import { formatDistance } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category, Post } from "@/types/blog";

export function PostCard({ post }: { post: Post }) {
  const categories = post.categories as Category[];
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/blog/${post.slug}`} className="flex-1 flex flex-col">
        {post.coverImage && (
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-all hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <CardHeader className="flex-1">
          <div className="space-y-1">
            <h3 className="text-xl font-bold leading-tight tracking-tight">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories?.map((category) => (
              <Badge key={category?.id} variant="secondary" className="text-xs">
                {category?.name}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                {post.author.name.charAt(0)}
              </div>
            )}
            <span>{post.author.name}</span>
          </div>
          <time dateTime={post.createdAt.toISOString()}>
            {formatDistance(post.createdAt, new Date(), { addSuffix: true })}
          </time>
        </CardFooter>
      </Link>
    </Card>
  );
}
