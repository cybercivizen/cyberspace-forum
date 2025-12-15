import ProfileInfo from "@/src/components/app/profile-info";
import { UserProfile } from "@/src/lib/types";
import { getUserProfile } from "../actions";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  console.log("ProfilePage username:", username);
  const { userProfile, isOwner } = (await getUserProfile(username)) as {
    userProfile: UserProfile;
    isOwner: boolean;
  };

  return <ProfileInfo userProfile={userProfile} isOwner={isOwner} />;
}
