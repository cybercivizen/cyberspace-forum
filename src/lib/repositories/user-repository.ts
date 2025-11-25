"use server";
import db from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { getRoleId } from "../constants";

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
