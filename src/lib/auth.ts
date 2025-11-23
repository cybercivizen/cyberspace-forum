"use server";
import db from "@/src/lib/db";
import { roles, users } from "@/src/lib/schema";
import { createSession, SessionData } from "@/src/lib/session";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { ROLE_ADMIN } from "./constants";

export async function login(data: { email: string; password: string }) {
  // Fetch the user to get the hashed password
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (!user.length) {
    return {
      success: false,
      errors: {
        email: "Email is not registered",
      },
    };
  }

  const isPasswordMatch = await bcrypt.compare(data.password, user[0].password);

  if (!isPasswordMatch) {
    console.log("Incorrect password for email:", data.email);
    return {
      success: false,
      errors: {
        password: "Incorrect password",
      },
    };
  }

  const sessionData: SessionData = {
    userId: user[0].id,
    email: data.email,
    isAdmin: user[0].rolesId === ROLE_ADMIN,
  };

  await createSession(sessionData); // Use the processed email

  return {
    success: true,
    errors: null,
  };
}

export async function signup(data: {
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

  const newUser = await db
    .insert(users)
    .values({
      username: data.username.trim(),
      email: data.email,
      password: hashedPassword,
      dateOfBirth: data.dateOfBirth,
      rolesId: roleId,
    })
    .returning({ id: users.id, email: users.email, roleId: users.rolesId });

  const sessionData: SessionData = {
    userId: newUser[0].id,
    email: data.email,
    isAdmin: roleId === ROLE_ADMIN,
  };

  await createSession(sessionData);

  return {
    success: true,
    errors: null,
  };
}
