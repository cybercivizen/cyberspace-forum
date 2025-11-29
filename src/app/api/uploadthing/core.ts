import { createUploadthing, type FileRouter } from "uploadthing/server";
import { cookies } from "next/headers";
import db from "../../../lib/db/db";
import { users } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/src/lib/auth/session";
import { SessionData } from "@/src/lib/types";

const f = createUploadthing();

const auth = async (req: Request) => {
  const session = (await getSession()) as SessionData;
  const userId = session.userId;

  if (!userId) {
    throw new Error("Unauthorized - Please log in");
  }

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("Invalid user session");
  }

  return { id: user.id };
};

export const uploadRouter = {
  profilePicture: f(["image"])
    .middleware(async ({ req }) => {
      const user = await auth(req);
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      await db
        .update(users)
        .set({ profile_picture_url: file.ufsUrl })
        .where(eq(users.id, metadata.userId));

      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
