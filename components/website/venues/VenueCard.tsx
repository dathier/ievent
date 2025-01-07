import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface VenueCardProps {
  venue: {
    id: number;
    name: string;
    location: string;
  };
}

export function VenueCard({ venue }: VenueCardProps) {
  const t = useTranslations("Venues");

  return (
    <Card>
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
  );
}
