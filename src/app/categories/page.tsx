"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/use-categories";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const { categories, loading } = useCategories();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Browse posts by category
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className="transition-all hover:scale-[1.01]"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {category.name}
                      <Badge variant="outline">
                        {category._count?.posts || 0} posts
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    <span>View posts &rarr;</span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No categories found.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
