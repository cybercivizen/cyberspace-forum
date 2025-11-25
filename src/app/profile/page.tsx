import ProfileInfo from "@/src/components/app/profile-info";
import { getSession } from "@/src/lib/auth/session";

export default async function ProfilePage() {
  const session = await getSession();
  const username = session?.username as string;

  return <ProfileInfo username={username} />;
}
