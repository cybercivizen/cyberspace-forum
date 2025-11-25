"use server";
import { createSession, SessionData } from "@/src/lib/auth/session";
import bcrypt from "bcrypt";
import { ROLE_ADMIN } from "../constants";
import { createUser, getUserBy } from "../repositories/user-repository";

export async function login(data: { email: string; password: string }) {
  // Fetch the user to get the hashed password
  const user = await getUserBy("email", data.email);

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
    return {
      success: false,
      errors: {
        password: "Incorrect password",
      },
    };
  }

  const sessionData: SessionData = {
    userId: user[0].id,
    username: user[0].username,
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
  const isUsernameTaken =
    (await getUserBy("username", data.username)).length > 0;

  const isEmailTaken = (await getUserBy("email", data.email)).length > 0;

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
