"use server";

import db from "@/src/lib/db";
import { roles, users } from "@/src/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createSession } from "@/src/lib/session";

export async function signupUser(data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date;
  role: "admin" | "user";
  termsAccepted: boolean;
}) {
  console.log("Saving user:", data);

  const roleResult = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, data.role))
    .limit(1);

  if (!roleResult.length) {
    throw new Error(`Role '${data.role}' not found`);
  }

  const roleId = roleResult[0].id;

  const isUsernameTaken =
    (
      await db
        .select()
        .from(users)
        .where(eq(users.username, data.username))
        .limit(1)
    ).length > 0;

  const isEmailTaken =
    (await db.select().from(users).where(eq(users.email, data.email)).limit(1))
      .length > 0;

  if (isEmailTaken || isUsernameTaken) {
    return {
      success: false,
      errors: {
        ...(isEmailTaken && { email: "Email is already taken" }),
        ...(isUsernameTaken && { username: "Username is already taken" }),
      },
    };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await db.insert(users).values({
    username: data.username,
    email: data.email,
    password: hashedPassword,
    dateOfBirth: data.dateOfBirth,
    rolesId: roleId,
  });

  await createSession(data.email);

  return {
    success: true,
    errors: null,
  };
}
