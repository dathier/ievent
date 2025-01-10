"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

interface Venue {
  id: number;
  name: string;
  location: string;
  capacity: number;
}

export default function VenueManagement() {
  const t = useTranslations("Admin.Venues");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [newVenue, setNewVenue] = useState({
    name: "",
    location: "",
    capacity: 0,
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  async function fetchVenues() {
    const response = await fetch("/admin/venues");
    const data = await response.json();
    setVenues(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch("/admin/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVenue),
      });
      if (response.ok) {
        toast({
          title: t("createSuccess"),
          description: t("createSuccessDescription"),
        });
        fetchVenues();
        setNewVenue({ name: "", location: "", capacity: 0 });
      } else {
        throw new Error("Failed to create venue");
      }
    } catch (error) {
      toast({
        title: t("createError"),
        description: t("createErrorDescription"),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <Input
          type="text"
          value={newVenue.name}
          onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
          placeholder={t("venueName")}
        />
        <Input
          type="text"
          value={newVenue.location}
          onChange={(e) =>
            setNewVenue({ ...newVenue, location: e.target.value })
          }
          placeholder={t("venueLocation")}
        />
        <Input
          type="number"
          value={newVenue.capacity}
          onChange={(e) =>
            setNewVenue({ ...newVenue, capacity: parseInt(e.target.value) })
          }
          placeholder={t("venueCapacity")}
        />
        <Button type="submit">{t("createVenue")}</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("venueName")}</TableHead>
            <TableHead>{t("venueLocation")}</TableHead>
            <TableHead>{t("venueCapacity")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.map((venue) => (
            <TableRow key={venue.id}>
              <TableCell>{venue.name}</TableCell>
              <TableCell>{venue.location}</TableCell>
              <TableCell>{venue.capacity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
