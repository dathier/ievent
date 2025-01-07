import { Hero } from "@/components/website/home/Hero";
import { FeaturedEvents } from "@/components/website/home/FeaturedEvents";
import { RecommendedVenues } from "@/components/website/home/RecommendedVenues";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Hero />
      <FeaturedEvents />
      <RecommendedVenues />
    </div>
  );
}

