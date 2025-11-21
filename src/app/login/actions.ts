"use server";
import { authenticateUser } from "@/src/lib/auth";
import db from "@/src/lib/db";
import { users } from "@/src/lib/schema";
import { and, eq } from "drizzle-orm";

export async function loginUser(data: { email: string; password: string }) {
  const isEmailExists =
    (await db.select().from(users).where(eq(users.email, data.email)).limit(1))
      .length > 0;

  if (!isEmailExists) {
    return {
      success: false,
      errors: {
        email: "Email is not registered",
      },
    };
  }

  const isPasswordMatch =
    (
      await db
        .select()
        .from(users)
        .where(
          and(eq(users.email, data.email), eq(users.password, data.password))
        )
        .limit(1)
    ).length > 0;

  if (!isPasswordMatch) {
    return {
      success: false,
      errors: {
        password: "Incorrect password",
      },
    };
  }

  authenticateUser();

  return {
    success: true,
    errors: null,
  };
}
