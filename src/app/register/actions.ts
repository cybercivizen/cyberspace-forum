"use server";

import db from "@/src/lib/db";
import { users } from "@/src/lib/schema";
import { revalidatePath } from "next/cache";

export async function seedUser() {
  //   await db.insert(users).values({
  //     name: "John Doe",
  //     age: 30,
  //     email: "test@email.com",
  //   });

  revalidatePath("/register"); // optional: refresh the page if needed
}

export async function saveUser(data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date;
  accountType: "admin" | "user";
  termsAccepted: boolean;
}) {
  try {
    console.log("Saving user:", data);
    await db.insert(users).values({
      username: data.username,
      email: data.email,
      password: data.password,
      dateOfBirth: data.dateOfBirth,
      rolesId: data.accountType === "admin" ? 1 : 2,
    });
  } catch (error) {
    console.log("Error saving user:", error);
  }
}
