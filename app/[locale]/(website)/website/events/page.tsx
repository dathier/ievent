"use client";

import { useState, useEffect } from "react";
import { EventSearch } from "@/components/website/events/EventSearch";
import { EventList } from "@/components/website/events/EventList";
import { Pagination } from "@/components/ui/pagination";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  status: string;
  isPublished: boolean;
  eventType: string;
  industryType: string;
  businessType: string;
}

export default function EventsPage() {
  const t = useTranslations("Events");

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSearch = (query: string) => {
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handleFilterCategory = (category: string) => {
    const filtered = events.filter((event) => event.eventType === category);
    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handleFilterIndustry = (industry: string) => {
    const filtered = events.filter((event) => event.industryType === industry);
    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handleFilterBusiness = (business: string) => {
    const filtered = events.filter((event) => event.businessType === business);
    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 mt-16">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <EventSearch
            onSearch={handleSearch}
            onFilterCategory={handleFilterCategory}
            onFilterIndustry={handleFilterIndustry}
            onFilterBusiness={handleFilterBusiness}
          />
        </CardContent>
      </Card>
      <EventList events={paginatedEvents} />

      <Pagination
        className="justify-center"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
