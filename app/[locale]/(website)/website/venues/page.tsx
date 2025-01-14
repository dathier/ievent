"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { VenueSearch } from "@/components/website/venues/VenueSearch";
import { VenueList } from "@/components/website/venues/VenueList";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Venue {
  id: number;
  name: string;
  location: string;
  category: string;
  image: string;
}

export default function VenuesPage() {
  const t = useTranslations("Venues");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const venuesPerPage = 9;

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await fetch("/api/admin/venues");
      if (!response.ok) {
        throw new Error("Failed to fetch venues");
      }
      const data = await response.json();
      setVenues(data);
      setFilteredVenues(data);
      setTotalPages(Math.ceil(data.length / venuesPerPage));
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const handleSearch = (query: string) => {
    const filtered = venues.filter(
      (venue) =>
        venue.name.toLowerCase().includes(query.toLowerCase()) ||
        venue.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVenues(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / venuesPerPage));
  };

  const handleFilterCategory = (category: string) => {
    const filtered = venues.filter((venue) => venue.category === category);
    setFilteredVenues(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / venuesPerPage));
  };

  const handleFilterLocation = (location: string) => {
    const filtered = venues.filter((venue) => venue.location === location);
    setFilteredVenues(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / venuesPerPage));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedVenues = filteredVenues.slice(
    (currentPage - 1) * venuesPerPage,
    currentPage * venuesPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 mt-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <VenueSearch
            onSearch={handleSearch}
            onFilterCategory={handleFilterCategory}
            onFilterLocation={handleFilterLocation}
          />
        </CardContent>
      </Card>
      <VenueList venues={paginatedVenues} />
      <Pagination
        className="justify-center"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
