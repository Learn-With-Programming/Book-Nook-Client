import Private from "@/components/private";
import MyBooks from "@/components/pages/my-books";

export const metadata = {
  title: "My Books",
};

export default function MyBooksPage() {
  return (
    <Private>
      <MyBooks />
    </Private>
  );
}
