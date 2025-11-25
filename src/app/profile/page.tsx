import ProfileInfo from "@/src/components/app/profile-info";
import { getSession } from "@/src/lib/auth/session";
import { getUserProfile } from "@/src/lib/repositories/user-repository";
import { SessionData } from "@/src/lib/types";

export default async function ProfilePage() {
  const session = (await getSession()) as SessionData;
  const userProfile = await getUserProfile(session.userId);

  return <ProfileInfo userProfile={userProfile} />;
}
