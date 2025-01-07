"use client";

import { useState, useEffect } from "react";
import { VenueSearch } from "@/components/website/venues/VenueSearch";
import { VenueList } from "@/components/website/venues/VenueList";
import { Pagination } from "@/components/website/shared/Pagination";

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 9;

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await fetch("/api/venues");
      if (!response.ok) {
        throw new Error("Failed to fetch venues");
      }
      const data = await response.json();
      setVenues(data);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const handleSearch = (query: string) => {
    // Implement search logic
  };

  const handleFilterCategory = (category: string) => {
    // Implement category filter logic
  };

  const handleFilterLocation = (location: string) => {
    // Implement location filter logic
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedVenues = venues.slice(
    (currentPage - 1) * venuesPerPage,
    currentPage * venuesPerPage
  );

  const totalPages = Math.ceil(venues.length / venuesPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Venues</h1>
      <VenueSearch
        onSearch={handleSearch}
        onFilterCategory={handleFilterCategory}
        onFilterLocation={handleFilterLocation}
      />
      <VenueList venues={paginatedVenues} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

