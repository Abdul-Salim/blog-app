"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { FormLabel } from "../ui/form";
import { Switch } from "../ui/switch";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCategories } from "@/hooks/use-categories";
import { useState } from "react";
import { CheckIcon, Loader2, PlusCircle, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Post } from "@/types/blog";
import { useRouter } from "next/navigation";

const postSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  excerpt: z.string().max(200).optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  categories: z.array(z.string()).optional(),
  published: z.boolean(),
});

export type FormValues = z.infer<typeof postSchema>;

interface PostFormProps {
  onSubmit: (data: FormValues) => Promise<void>;
  defaultValues?: Post;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, defaultValues }) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const addCategory = (category: string) => {
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
    setNewCategory("");
  };
  const router = useRouter();

  console.log(defaultValues);
  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };
  const form = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    values: {
      title: defaultValues?.title ?? "",
      content: defaultValues?.content ?? "",
      excerpt: defaultValues?.excerpt ?? "",
      coverImage: defaultValues?.coverImage ?? "",
      categories: (defaultValues?.categories as string[]) ?? [],
      published: defaultValues?.published ?? false,
    },
  });

  const submitHandler = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      values.categories = selectedCategories;
      await onSubmit(values);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief summary of the post (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A short excerpt that appears in post listings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL to an image for the post (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {category}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeCategory(category)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {category}</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 justify-start"
                      disabled={categoriesLoading}
                    >
                      {categoriesLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <PlusCircle className="mr-2 h-4 w-4" />
                      )}
                      Add category
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search categories..." />
                      <CommandList>
                        <CommandEmpty>
                          <div className="p-2 text-sm">
                            No categories found. Add "{newCategory}" as a new
                            category?
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              className="ml-2"
                              onClick={() => addCategory(newCategory)}
                            >
                              Add
                            </Button>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-[200px]">
                            {categories.map((category) => (
                              <CommandItem
                                key={category.id}
                                value={category.name}
                                onSelect={() => addCategory(category.name)}
                              >
                                <div className="flex items-center">
                                  <span>{category.name}</span>
                                  {selectedCategories.includes(
                                    category.name
                                  ) && (
                                    <CheckIcon className="ml-auto h-4 w-4" />
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </CommandList>
                      <div className="p-2 border-t">
                        <div className="text-xs text-muted-foreground mb-2">
                          Add a new category
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            size={1}
                            className="h-8"
                            placeholder="New category name"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="h-8"
                            onClick={() => addCategory(newCategory)}
                            disabled={!newCategory}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publish</FormLabel>
                    <FormDescription>
                      Post will be{" "}
                      {field.value ? "visible to all" : "saved as draft"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your post content here (markdown supported)"
                      className="min-h-[400px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Markdown formatting is supported
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
