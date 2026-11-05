import Private from "@/components/private";
import AddBookForm from "@/components/pages/add-book-form";

export const metadata = {
  title: "Add Book",
};

export default function AddBookPage() {
  return (
    <Private>
      <AddBookForm />
    </Private>
  );
}
