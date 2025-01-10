import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin } from 'lucide-react'
import { getEvents } from '@/lib/events'

export async function EventList() {
  const events = await getEvents()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground mb-2 flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
            </p>
            <p className="text-muted-foreground mb-4 flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              {event.location}
            </p>
            <p className="line-clamp-3">{event.description}</p>
          </CardContent>
          <CardFooter>
            <Link href={`/events/${event.id}`} passHref>
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

