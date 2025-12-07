import ProfileInfo from "@/src/components/app/profile-info";
import { getSession } from "@/src/lib/auth/session";
import { SessionData, UserProfile } from "@/src/lib/types";
import { getUserProfile } from "../actions";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const session = (await getSession()) as SessionData;

  const { userProfile, isOwner } = (await getUserProfile(username)) as {
    userProfile: UserProfile;
    isOwner: boolean;
  };

  return <ProfileInfo userProfile={userProfile} isOwner={isOwner} />;
}
