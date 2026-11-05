import Private from "@/components/private";
import ProfileView from "@/components/pages/profile-view";

export const metadata = {
  title: "My Profile",
};

export default function ProfilePage() {
  return (
    <Private>
      <ProfileView />
    </Private>
  );
}
