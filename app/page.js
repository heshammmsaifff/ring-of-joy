import Hero from "@/components/home/Hero";
import Category from "@/components/home/Category";
import LatestOffersSection from "@/components/home/LatestOffers";
import WhyUsSection from "@/components/home/WhyUs";

export default function Page() {
  return (
    <>
      <Hero />
      <Category />
      <LatestOffersSection />
      <WhyUsSection />
    </>
  );
}
