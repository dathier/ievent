"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Venue {
  id: number;
  name: string;
  location: string;
  category: string;
  capacity: number;
  image: string;
}

export default function VenueManagementPage() {
  const t = useTranslations("Admin.Venues");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [venues, searchTerm, categoryFilter]);

  async function fetchVenues() {
    try {
      const response = await axios.get("/api/admin/venues");
      setVenues(response.data);
    } catch (error) {
      console.error("Error fetching venues:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  function filterVenues() {
    let filtered = venues;
    if (searchTerm) {
      filtered = filtered.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter((venue) => venue.category === categoryFilter);
    }
    setFilteredVenues(filtered);
  }

  async function handleDelete(venueId: number) {
    try {
      await axios.delete(`/api/admin/venues/${venueId}`);
      toast({
        title: t("deleteSuccess"),
      });
      fetchVenues();
    } catch (error) {
      console.error("Error deleting venue:", error);
      toast({
        title: t("deleteError"),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("venuesList")}</h1>
        <Link href="/admin/venues/create">
          <Button>{t("createVenue")}</Button>
        </Link>
      </div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder={t("searchVenues")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder={t("filterByCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            <SelectItem value="conference">
              {t("categoryConference")}
            </SelectItem>
            <SelectItem value="exhibition">
              {t("categoryExhibition")}
            </SelectItem>
            <SelectItem value="banquet">{t("categoryBanquet")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("venueName")}</TableHead>
            <TableHead>{t("venueLocation")}</TableHead>
            <TableHead>{t("venueCategory")}</TableHead>
            <TableHead>{t("venueCapacity")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredVenues.map((venue) => (
            <TableRow key={venue.id}>
              <TableCell className="font-medium">{venue.name}</TableCell>
              <TableCell>{venue.location}</TableCell>
              <TableCell>{t(`category${venue.category}`)}</TableCell>
              <TableCell>{venue.capacity}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/admin/venues/${venue.id}/edit`)
                      }
                    >
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(venue.id)}>
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
