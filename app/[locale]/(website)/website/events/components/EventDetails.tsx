import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getEvent } from "@/lib/events";
import { RegistrationForm } from "./RegistrationForm";
import Image from "next/image";

export async function EventDetails({ eventId }: { eventId: number }) {
  const event = await getEvent(eventId);
  if (!event) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <img
          src={event.imageUrl}
          alt={event.title}
          width={800}
          height={400}
          className="w-full h-96 object-cover mb-4"
        />
        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <p className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            {new Date(event.startDate).toLocaleDateString()} -{" "}
            {new Date(event.endDate).toLocaleDateString()}
          </p>
          <p className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {event.location}
          </p>
          {event.isPaid && (
            <p className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              {event.ticketPrice}
            </p>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{event.description}</p>
        </CardContent>
      </Card>

      {event.guests && event.guests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.guests.map((guest) => (
                <div key={guest.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={guest.photo || "/placeholder.svg"}
                      alt={guest.name}
                      className="h-12 w-12 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{guest.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {guest.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {event.schedule && event.schedule.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {event.schedule.map((item) => (
                <li key={item.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-24">
                    <p className="text-sm font-medium">
                      {new Date(item.startTime).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.endTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {event.requiresRegistration && (
        <Card>
          <CardHeader>
            <CardTitle>Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <RegistrationForm eventId={event.id} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
