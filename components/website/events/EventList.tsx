import { EventCard } from "./EventCard"

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
}

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

