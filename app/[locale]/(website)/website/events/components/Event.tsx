"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import QRCode from "qrcode.react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EventProps {
  events: Array<{
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
    imageUrl?: string;
  }>;
}

export function Event({ events }: EventProps) {
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const handleQRCodeClick = (eventId: number) => {
    setSelectedEventId(eventId);
    setIsQRDialogOpen(true);
  };

  const eventUrl = (eventId: number) =>
    `${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="flex flex-col">
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
          <CardContent className="flex-grow">
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
          <CardFooter className="flex gap-2">
            <Link href={`/events/${event.id}`} className="flex-1">
              <Button className="w-full">View Details</Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQRCodeClick(event.id)}
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}

      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center p-4">
            {selectedEventId && (
              <QRCode
                value={eventUrl(selectedEventId)}
                size={256}
                level="H"
                includeMargin
              />
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              Scan this QR code to view the event details
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
