"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import PostForm, { FormValues } from "@/components/blog/PostForm";

export default function NewPostPage() {
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
      }

      const post = await response.json();
      toast.success("Post created successfully!");
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="outline" size="sm" className="mr-4" asChild>
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
      </div>
      <PostForm onSubmit={onSubmit} />
    </div>
  );
}
