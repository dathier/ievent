"use client";

import { useState, useEffect } from "react";
import { EventSearch } from "@/components/website/events/EventSearch";
import { EventList } from "@/components/website/events/EventList";
import { Pagination } from "@/components/website/shared/Pagination";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events?approved=true");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSearch = (query: string) => {
    // Implement search logic
  };

  const handleFilterCategory = (category: string) => {
    // Implement category filter logic
  };

  const handleFilterIndustry = (industry: string) => {
    // Implement industry filter logic
  };

  const handleFilterBusiness = (business: string) => {
    // Implement business filter logic
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedEvents = events.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const totalPages = Math.ceil(events.length / eventsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      <EventSearch
        onSearch={handleSearch}
        onFilterCategory={handleFilterCategory}
        onFilterIndustry={handleFilterIndustry}
        onFilterBusiness={handleFilterBusiness}
      />
      <EventList events={paginatedEvents} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

