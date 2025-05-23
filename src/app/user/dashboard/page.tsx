"use client";

import { usePosts } from "@/hooks/use-posts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
export default function UserDashboard() {
  const { data: session } = useSession();
  console.log("session", session);

  const { data: postsData, loading } = usePosts({ userId: session?.user.id });
  console.log("postsData", postsData);
  async function handleDelete(postId: string) {
    // Implement delete logic here
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Posts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {postsData?.posts.slice(0, 5).map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistance(post.createdAt, new Date(), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {post.categories.slice(0, 2).map((category) => (
                        <Badge
                          key={category.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {category.name}
                        </Badge>
                      ))}
                      {post.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="justify-end flex gap-2">
                    <Button size="sm" asChild>
                      <Link href={`/user/posts/edit/${post.slug}`}>Edit</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/user/posts/${post.slug}`}>view</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {postsData?.posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No posts found. Create your first post!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
