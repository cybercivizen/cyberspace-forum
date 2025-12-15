"use server";
import { createSession } from "@/src/lib/auth/session";
import bcrypt from "bcrypt";
import { ROLE_ADMIN } from "../constants";
import { createUser, getUserBy } from "../repositories/user-repository";
import { SessionData } from "../types";

export async function login(data: { email: string; password: string }) {
  const user = await getUserBy("email", data.email);

  if (!user) {
    return {
      success: false,
      errors: {
        email: "Email is not registered",
      },
    };
  }

  const isPasswordMatch = await bcrypt.compare(data.password, user.password);

  if (!isPasswordMatch) {
    return {
      success: false,
      errors: {
        password: "Incorrect password",
      },
    };
  }

  const sessionData: SessionData = {
    userId: user.id,
    username: user.username,
    email: data.email,
    isAdmin: user.rolesId === ROLE_ADMIN,
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
  const isUsernameTaken = await getUserBy("username", data.username);

  const isEmailTaken = await getUserBy("email", data.email);

  if (isEmailTaken || isUsernameTaken) {
    return {
      success: false,
      errors: {
        ...(isEmailTaken && { email: "Email is already taken" }),
        ...(isUsernameTaken && { username: "Username is already taken" }),
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { termsAccepted, ...dataToInsert } = data;
  const newUser = await createUser(dataToInsert);

  const sessionData: SessionData = {
    userId: newUser.id,
    username: data.username.trim(),
    email: data.email,
    isAdmin: newUser.roleId === ROLE_ADMIN,
  };

  await createSession(sessionData);

  return {
    success: true,
    errors: null,
  };
}
