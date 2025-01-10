"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import axios from "axios";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  status: string;
  isPublished: boolean;
}

export function FeaturedEvents() {
  const t = useTranslations("Home");
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  async function fetchFeaturedEvents() {
    try {
      const response = await axios.get("/api/events/featured");
      const events = response.data;
      const approvedAndPublishedEvents = events.filter(
        (event: Event) => event.status === "approved" && event.isPublished
      );
      setFeaturedEvents(approvedAndPublishedEvents);
    } catch (error) {
      console.error("Error fetching featured events:", error);
    }
  }

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-6">{t("featuredEvents")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  {format(new Date(event.startDate), "PP")} -{" "}
                  {format(new Date(event.endDate), "PP")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{event.location}</p>
                <p className="mt-2">{event.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/website/events/${event.id}`}>
                  <Button>{t("learnMore")}</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
