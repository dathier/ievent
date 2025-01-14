import { VenueCard } from "./VenueCard";

interface Venue {
  id: number;
  name: string;
  location: string;
  category: string;
  image: string;
}

interface VenueListProps {
  venues: Venue[];
}

export function VenueList({ venues }: VenueListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}
