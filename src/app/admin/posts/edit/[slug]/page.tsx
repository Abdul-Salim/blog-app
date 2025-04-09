"use client";
import { useParams, useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { usePost } from "@/hooks/use-post";

import PostForm, { FormValues } from "@/components/blog/PostForm";

export default function EditPostPage() {
  const router = useRouter();

  const { slug } = useParams();
  const { post, loading, error } = usePost(slug as string);

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update post");

      router.push("/admin/dashboard");
    } catch (err) {}
  };

  if (loading) return <div>Loading...</div>;

  if (error)
    return (
      <Alert variant="destructive" className="!flex !items-center">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <p>{error?.message}</p>
        </AlertDescription>
      </Alert>
    );

  if (post)
    return (
      <div>
        <h1>Edit Post</h1>

        <PostForm defaultValues={post} onSubmit={onSubmit} />
      </div>
    );
}
