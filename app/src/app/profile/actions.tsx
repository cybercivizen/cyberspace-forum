"use server";
import { getSession } from "@/src/lib/auth/session";
import { SessionData, UserProfile } from "@/src/lib/types";
import { Resend } from "resend";
import { getUserProfile as fetchUserProfile } from "@/src/lib/repositories/user-repository";

export async function sendEmail() {
  console.log("Sending email...");
  try {
    const resend = new Resend("re_GDDaqTJv_DqpvW5Bd8N62YsnpHDQ1geuo");
    const { data, error } = await resend.emails.send({
      from: "delivered@resend.dev",
      to: "khalil.eljou@gmail.com",
      subject: "Hello World",
      html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
    });

    if (error) {
      console.error("Resend API error:", error);
      return { success: false, error: error.message };
    }
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error initializing Resend:", error);
    throw error;
  }
}

export async function getUserProfile(
  username: string
): Promise<{ userProfile: UserProfile; isOwner: boolean }> {
  console.error("Username: ", username); // Changed to console.error for visibility
  const userProfile = (await fetchUserProfile(username)) as UserProfile;

  try {
    if (!userProfile) {
      throw new Error("User profile not found");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }

  try {
    const session = (await getSession()) as SessionData;

    if (session.username === username) {
      return { userProfile, isOwner: true };
    } else {
      return { userProfile, isOwner: false };
    }
  } catch (error) {
    console.error("Error fetching session data:", error);
    throw error;
  }
}
