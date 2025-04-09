import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { isAdmin } from "@/lib/auth";
import type { Prisma } from "@prisma/client";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get("published") === "true";
    const category = searchParams.get("category");
    const limit = Number(searchParams.get("limit") || 10);
    const page = Number(searchParams.get("page") || 1);
    const skip = (page - 1) * limit;

    const whereClause: Record<string, string | boolean | object> = {};

    if (publishedOnly) {
      whereClause.published = true;
    }

    if (category) {
      whereClause.categories = {
        some: {
          slug: category,
        },
      };
    }

    const posts = await db.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const total = await db.post.count({
      where: whereClause,
    });

    return NextResponse.json({
      posts,
      metadata: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("[POSTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user || !session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isUserAdmin = await isAdmin(session.user.email);

    if (!isUserAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      content,
      excerpt,
      coverImage,
      categories,
      published = false,
    } = body;

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    // Connect or create categories
    const categoryConnections =
      categories && categories.length > 0
        ? {
            connectOrCreate: categories.map((category: string) => {
              const categorySlug = category
                .toLowerCase()
                .replace(/[^\w\s]/gi, "")
                .replace(/\s+/g, "-");

              return {
                where: { name: category },
                create: {
                  name: category,
                  slug: categorySlug,
                },
              };
            }),
          }
        : undefined;

    const post = await db.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        published,
        author: {
          connect: {
            email: session.user.email,
          },
        },
        categories: categoryConnections,
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("[POSTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
