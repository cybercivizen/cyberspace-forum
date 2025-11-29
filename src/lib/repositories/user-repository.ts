"use server";
import db from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { getRoleId } from "../constants";
import { FormInput } from "@/src/components/app/profile-info";
import { UserProfile } from "../types";
import { profile } from "console";

export async function getUserBy(
  field: "id" | "email" | "username",
  value: string | number
) {
  let whereClause;

  switch (field) {
    case "id":
      whereClause = eq(users.id, value as number);
      break;
    case "email":
      whereClause = eq(users.email, value as string);
      break;
    case "username":
      whereClause = eq(users.username, value as string);
      break;
    default:
      throw new Error("Invalid field");
  }

  return (await db.select().from(users).where(whereClause).limit(1))[0];
}

export async function getUserProfile(id: number) {
  return (
    await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        dateOfBirth: users.dateOfBirth,
        rolesId: users.rolesId,
        profilePictureUrl: users.profile_picture_url,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
  )[0];
}

export async function createUser(data: {
  username: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  role: "user" | "admin";
}) {
  const roleId = getRoleId(data.role);
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return (
    await db
      .insert(users)
      .values({
        username: data.username.trim(),
        email: data.email,
        password: hashedPassword,
        dateOfBirth: data.dateOfBirth,
        rolesId: roleId,
      })
      .returning({ id: users.id, email: users.email, roleId: users.rolesId })
  )[0];
}

export async function modifyUser(data: FormInput, userProfile: UserProfile) {
  const isUsernameTaken = await getUserBy("username", data.username);
  if (isUsernameTaken && data.username !== userProfile.username) {
    return {
      success: false,
      errors: {
        username: "Username is already taken",
      },
    };
  }
  await db
    .update(users)
    .set({ username: data.username, dateOfBirth: data.dateOfBirth })
    .where(eq(users.id, userProfile.id));
  return { success: true, errors: null };
}

export async function updateUserProfile(
  id: number,
  data: {
    username?: string;
    email?: string;
    dateOfBirth?: Date;
  }
) {
  // Call db update method
}
