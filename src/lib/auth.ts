import { hash } from "bcrypt";
import { db } from "./db";

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await hash(password, 10);
  return hashedPassword;
}

export async function createUser({
  name,
  email,
  password,
  role = "USER",
}: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  const hashedPassword = await hashPassword(password);

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role,
    },
  });

  return user;
}

// Helper function to check if user is admin
export async function isAdmin(email: string) {
  const user = await db.user.findUnique({
    where: { email: email },
    select: { role: true },
  });

  return user?.role === "ADMIN";
}
