import Private from "@/components/private";
import MyBorrows from "@/components/pages/my-borrows";

export const metadata = {
  title: "My Borrows",
};

export default function MyBorrowsPage() {
  return (
    <Private>
      <MyBorrows />
    </Private>
  );
}
