import HomeSlider from "@/components/home/home-slider";
import NewArrivals from "@/components/home/new-arrivals";
import HowBorrowingWorks from "@/components/home/how-borrowing-works";
import TopCategories from "@/components/home/top-categories";
import SectionHeading from "@/components/section-heading";

export const metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <>
      <HomeSlider />

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <SectionHeading eyebrow="Fresh on the shelf" title="New Arrivals" />
        <NewArrivals />
      </section>

      <HowBorrowingWorks />
      <TopCategories />
    </>
  );
}
