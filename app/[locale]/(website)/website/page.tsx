import { Hero } from "@/components/website/home/Hero";
import { FeaturedEvents } from "@/components/website/home/FeaturedEvents";
import { RecommendedVenues } from "@/components/website/home/RecommendedVenues";

export const metadata = {
  title: "iEvents - Your Event Management Platform",
  description: "Discover and manage exciting events with iEvents",
};

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <FeaturedEvents />
      <RecommendedVenues />
    </div>
  );
}
