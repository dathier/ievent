import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RecommendedVenues() {
  const t = useTranslations("Frontend.recommendedVenues");

  const venues = [
    {
      id: 1,
      name: "Grand Conference Center",
      location: "Downtown, City",
      image: "/001.jpg",
    },
    {
      id: 2,
      name: "Seaside Convention Hall",
      location: "Beachfront, Resort Town",
      image: "/002.jpg",
    },
    {
      id: 3,
      name: "Mountain View Lodge",
      location: "Alpine Heights",
      image: "/003.jpg",
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue.id}>
              <CardHeader>
                <CardTitle>{venue.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={venue.image}
                  alt={venue.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover mb-4"
                />
                <p>{venue.location}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">{t("viewDetails")}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
