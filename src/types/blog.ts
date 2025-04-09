export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  categories: string[] | Category[];
}

export interface ApiPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: {
    posts: number;
  };
}

export interface PaginatedPosts {
  posts: Post[];
  metadata: {
    total: number;
    pages: number;
    currentPage: number;
  };
}

export interface ApiPaginatedPosts {
  posts: ApiPost[];
  metadata: {
    total: number;
    pages: number;
    currentPage: number;
  };
}
