"use server";
import db from "../db/db";
import { messages } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getAllMessages(userId: number) {
  return await db
    .select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      userId: messages.userId,
    })
    .from(messages)
    .orderBy(messages.createdAt);
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
