"use server";
import { Resend } from "resend";

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
