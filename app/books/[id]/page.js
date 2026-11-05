import Private from "@/components/private";
import BookDetails from "@/components/pages/book-details";

export const metadata = {
  title: "Book Details",
};

export default function BookDetailsPage() {
  return (
    <Private>
      <BookDetails />
    </Private>
  );
}
