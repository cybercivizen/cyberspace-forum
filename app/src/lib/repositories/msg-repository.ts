"use server";
import db from "../db/db";
import { messages, users } from "../db/schema";
import { eq, asc } from "drizzle-orm";
import { Message } from "../types";

export async function getAllMessages(): Promise<Message[]> {
  const result = await db
    .select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      user: {
        id: users.id,
        username: users.username,
        profilePictureUrl: users.profile_picture_url,
      },
    })
    .from(messages)
    .leftJoin(users, eq(messages.userId, users.id))
    .orderBy(asc(messages.createdAt));

  return result as Message[];
}

export async function createMessage(data: { content: string; userId: number }) {
  return (
    await db
      .insert(messages)
      .values({
        content: data.content,
        userId: data.userId,
      })
      .returning({ id: messages.id })
  )[0];
}

export async function updateMessage(data: { id: number; content: string }) {
  return await db
    .update(messages)
    .set({ content: data.content })
    .where(eq(messages.id, data.id));
}

export async function deleteMessage(id: number) {
  return await db.delete(messages).where(eq(messages.id, id));
}
