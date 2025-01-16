import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getEvent } from "@/lib/events";

export async function EventDetails({ eventId }: { eventId: number }) {
  const event = await getEvent(eventId);
  if (!event) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <div className="relative w-full h-96 mb-4">
          <Image
            src={event.imageUrl || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
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
                  <div className="relative flex-shrink-0 w-12 h-12">
                    <Image
                      src={guest.imageUrl || "/placeholder.svg"}
                      alt={guest.name}
                      fill
                      className="rounded-full object-cover"
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

      {event.exhibitors && event.exhibitors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Exhibitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {event.exhibitors.map((exhibitor) => (
                <div key={exhibitor.id} className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-2">
                    <Image
                      src={exhibitor.logo || "/placeholder.svg"}
                      alt={exhibitor.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="font-medium">{exhibitor.name}</p>
                  {exhibitor.website && (
                    <a
                      href={exhibitor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {event.livestream && (
        <Card>
          <CardHeader>
            <CardTitle>Livestream</CardTitle>
          </CardHeader>
          <CardContent>
            {event.livestream.status === "live" && (
              <div className="aspect-video">
                <iframe
                  src={event.livestream.streamUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}
            <p className="mt-2 text-muted-foreground capitalize">
              Status: {event.livestream.status}
            </p>
          </CardContent>
        </Card>
      )}

      {event.materials && event.materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.materials.map((material) => (
                <a
                  key={material.id}
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium">{material.name}</p>
                  <p className="text-sm text-muted-foreground">Download</p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {event.news && event.news.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>News</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {event.news.map((item) => (
                <div key={item.id} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {event.photos && event.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {event.photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.caption || "Event photo"}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <p>{photo.caption || "Event photo"}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {event.schedules && event.schedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {event.schedules.map((item) => (
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
                    {item.guests && item.guests.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Guests: {item.guests.map((g) => g.name).join(", ")}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {event.videos && event.videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.videos.map((video) => (
                <div key={video.id}>
                  <div className="aspect-video">
                    <iframe
                      src={video.videoUrl}
                      title={video.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                  <p className="mt-2 font-medium">{video.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {event.requiresRegistration && (
        <Card>
          <CardHeader>
            <CardTitle>Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/website/events/${event.id}/register`}>
              <Button size="lg" className="w-full">
                Register for this event
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
