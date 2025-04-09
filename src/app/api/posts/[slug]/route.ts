import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { isAdmin } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const post = await db.post.findUnique({
      where: { slug },
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
    });

    if (!post) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // If the post is not published, only allow admin to view it
    if (!post.published) {
      const session = await getServerSession();

      if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const isUserAdmin = await isAdmin(session.user.email);

      if (!isUserAdmin) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("[POST_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isUserAdmin = await isAdmin(session.user.email);

    if (!isUserAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { slug } = params;
    const body = await req.json();
    const { title, content, excerpt, coverImage, categories, published } = body;

    // Get the existing post
    const existingPost = await db.post.findUnique({
      where: { slug },
      include: { categories: true },
    });

    if (!existingPost) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Create a new slug if title is updated
    const newSlug = title
      ? title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-")
      : slug;

    // Handle category updates if provided
    const categoryConnections =
      categories && categories.length > 0
        ? {
            set: [], // Clear existing connections
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

    // Update the post
    const updatedPost = await db.post.update({
      where: { slug },
      data: {
        ...(title && { title }),
        ...(newSlug !== slug && { slug: newSlug }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(coverImage !== undefined && { coverImage }),
        ...(published !== undefined && { published }),
        ...(categoryConnections && { categories: categoryConnections }),
      },
      include: {
        categories: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("[POST_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isUserAdmin = await isAdmin(session.user.email);

    if (!isUserAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { slug } = params;

    // Check if post exists
    const post = await db.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Delete the post
    await db.post.delete({
      where: { slug },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[POST_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
