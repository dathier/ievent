import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getEvent } from "@/lib/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegistrationForm } from "../../components/RegistrationForm";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const event = await getEvent(parseInt(params.id));
  if (!event) return { title: "Event Registration Not Found" };
  return {
    title: `Register for ${event.title} | iEvents`,
    description: `Register for ${event.title} - ${event.description}`,
  };
}

export default async function RegisterPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(parseInt(params.id));
  if (!event) notFound();

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Register for {event.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <RegistrationForm eventId={parseInt(params.id)} />
        </CardContent>
      </Card>
    </div>
  );
}
