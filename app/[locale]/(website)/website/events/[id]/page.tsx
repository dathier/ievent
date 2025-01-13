import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EventDetails } from "../components/EventDetails";
import { EventDetailsSkeleton } from "../components/EventDetailsSkeleton";
import { getEvent } from "@/lib/events";
import EventLayout from "./EventLayout";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const event = await getEvent(parseInt(params.id));
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.title} | iEvents`,
    description: event.description,
  };
}

export default function EventPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<EventDetailsSkeleton />}>
        <EventDetails eventId={parseInt(params.id)} />
      </Suspense>
    </div>
  );
}
