import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin } from "lucide-react";

interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  status: string;
  isPublished: boolean;
}

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  const approvedEvents = events.filter(
    (event) => event.status === "approved" && event.isPublished
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {approvedEvents.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2 flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              {new Date(event.startDate).toLocaleDateString()} -{" "}
              {new Date(event.endDate).toLocaleDateString()}
            </p>
            <p className="text-muted-foreground mb-4 flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              {event.location}
            </p>
            <p className="line-clamp-3">{event.description}</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/website/events/${event.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
