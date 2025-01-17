"use client";

import Link from "next/link";
import Image from "next/image";

import QRCodeModal from "@/components/QRCodeModal";
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
  imageUrl: string;
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
          {event.imageUrl && (
            <div className="relative w-full h-48">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover rounded-t-lg"
                priority
              />
            </div>
          )}
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
            <div className="flex gap-8">
              <Button asChild className="w-full">
                <Link href={`/website/events/${event.id}`}>活动详情</Link>
              </Button>

              <QRCodeModal
                url={`${process.env.NEXT_PUBLIC_BASE_URL}/website/events/${event.id}`}
              />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
