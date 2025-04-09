import { type NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if user with email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("User with this email already exists", { status: 409 });
    }

    // Determine if this is the first user (make them admin)
    const userCount = await db.user.count();
    const role = userCount === 0 ? "ADMIN" : "USER";

    const user = await createUser({
      name,
      email,
      password,
      role,
    });

    // Remove password from the response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("[REGISTER_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
