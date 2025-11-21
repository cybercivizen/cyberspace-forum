"use server";

import db from "@/src/lib/db";
import { roles, users } from "@/src/lib/schema";
import { ValidationError } from "@/src/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date;
  role: "admin" | "user";
  termsAccepted: boolean;
}) {
  console.log("Saving user:", data);

  // Fetch the role ID synchronously before insert
  const roleResult = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, data.role))
    .limit(1);

  if (!roleResult.length) {
    throw new Error(`Role '${data.role}' not found`);
  }

  const roleId = roleResult[0].id;
  const isUsernameTaken = await db
    .select()
    .from(users)
    .where(eq(users.username, data.username))
    .limit(1)
    .then((d) => d.length);

  const isEmailTaken = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1)
    .then((d) => d.length);

  if (isEmailTaken || isUsernameTaken) {
    return {
      success: false,
      errors: {
        ...(isEmailTaken && { email: "Email is already taken" }),
        ...(isUsernameTaken && { username: "Username is already taken" }),
      },
    };
  }

  await db.insert(users).values({
    username: data.username,
    email: data.email,
    password: data.password,
    dateOfBirth: data.dateOfBirth,
    rolesId: roleId,
  });

  return {
    success: true,
    errors: {},
  };
}
