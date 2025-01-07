"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function FeaturedEvents() {
  const t = useTranslations("Frontend.featuredEvents");
  const [events, setEvents] = useState([]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/events?approved=true");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data.slice(0, 3)); // Get only the first 3 events
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }, [t]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                <p>{event.location}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/events/${event.id}`} passHref>
                  <Button variant="outline">{t("learnMore")}</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
