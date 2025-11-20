"use server";

import db from "@/src/lib/db";
import { users } from "@/src/lib/schema";
import { revalidatePath } from "next/cache";

export async function seedUser() {
  await db.insert(users).values({
    name: "John Doe",
    age: 30,
    email: "test@email.com",
  });

  revalidatePath("/register"); // optional: refresh the page if needed
}
