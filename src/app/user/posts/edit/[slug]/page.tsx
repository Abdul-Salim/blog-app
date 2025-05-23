"use client";
import { useParams, useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { usePost } from "@/hooks/use-post";

import PostForm, { FormValues } from "@/components/blog/PostForm";
import { use } from "react";

export default function EditPost({ params }: { params: any }) {
  const router = useRouter();

  const resolvedParams: { slug: string } = use(params);
  const slug = resolvedParams.slug;
  const { post, loading, error } = usePost(slug as string);

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
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

        <PostForm
          defaultValues={{
            ...post,
            categories: post?.categories?.map((item) => item?.id),
          }}
          onSubmit={onSubmit}
        />
      </div>
    );
}
