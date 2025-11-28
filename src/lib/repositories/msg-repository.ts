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
    .where(eq(messages.userId, userId));
}

export async function createMessage(data: { content: string; userId: number }) {
  return await db.insert(messages).values({
    content: data.content,
    userId: data.userId,
  });
}
