"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import axios from "axios";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
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
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { EditEventSheet } from "@/components/admin/EditEventSheet";

interface Event {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
  isPaid: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  description: string;
  status: string;
  ticketPrice?: number;
  eventType: string; // 新增字段
  industryType: string; // 新增字段
  businessType: string; // 新增字段
  requiresRegistration: boolean; // 新增字段
}

export default function EventsListPage() {
  const t = useTranslations("Admin.Events");
  const tManage = useTranslations("Admin.EventManagement");
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const response = await axios.get("/api/admin/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function handleDelete(eventId: number) {
    try {
      await axios.delete(`/api/admin/events/${eventId}`);
      toast({
        title: tManage("deleteSuccess"),
      });
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: tManage("deleteError"),
        variant: "destructive",
      });
    }
  }

  async function handleStatusUpdate(eventId: number, status: string) {
    try {
      await axios.patch(`/api/admin/events/${eventId}`, { status });
      toast({
        title: tManage("updateSuccess"),
      });
      fetchEvents();
    } catch (error) {
      console.error("Error updating event status:", error);
      toast({
        title: tManage("updateError"),
        variant: "destructive",
      });
    }
  }

  async function handleToggle(
    eventId: number,
    field: "isPublished" | "isFeatured"
  ) {
    try {
      const event = events.find((e) => e.id === eventId);
      if (!event) return;

      await axios.patch(`/api/admin/events/${eventId}`, {
        [field]: !event[field],
      });
      fetchEvents();
      toast({
        title: event[field]
          ? t(`event${field === "isPublished" ? "Unpublished" : "Unfeatured"}`)
          : t(`event${field === "isPublished" ? "Published" : "Featured"}`),
        description: t("eventUpdateSuccess"),
      });
    } catch (error) {
      console.error(`Error toggling event ${field} status:`, error);
      toast({
        title: t("updateError"),
        description: t("eventUpdateFailed"),
        variant: "destructive",
      });
    }
  }

  async function handleEdit(eventData: Partial<Event>) {
    try {
      await axios.put(`/api/admin/events/${selectedEvent?.id}`, eventData);
      toast({
        title: tManage("updateSuccess"),
      });
      fetchEvents();
      setIsEditSheetOpen(false);
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: tManage("updateError"),
        variant: "destructive",
      });
    }
  }

  function formatEventDate(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let dateString = "";

    if (isToday(start)) {
      dateString = `<span class="text-red-600 font-semibold">Today</span>`;
    } else if (isTomorrow(start)) {
      dateString = `<span class="text-orange-600 font-semibold">Tomorrow</span>`;
    } else if (isYesterday(start)) {
      dateString = `<span class="text-gray-500 font-semibold">Yesterday</span>`;
    } else {
      dateString = format(start, "MMM d, yyyy");
    }

    return `${dateString} - ${format(end, "MMM d, yyyy")}`;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("eventsList")}</h1>
        <Link href="/admin/events/create">
          <Button>{t("createEvent")}</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">{t("eventTitle")}</TableHead>
            <TableHead>{t("eventDate")}</TableHead>
            <TableHead>{t("eventLocation")}</TableHead>
            <TableHead>{t("isPaid")}</TableHead>
            <TableHead>{t("statusName")}</TableHead>
            <TableHead>{t("isPublished")}</TableHead>
            <TableHead>{t("isFeatured")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-bold">{event.title}</TableCell>
              <TableCell
                dangerouslySetInnerHTML={{
                  __html: formatEventDate(event.startDate, event.endDate),
                }}
              />
              <TableCell>{event.location}</TableCell>
              <TableCell>
                {event.isPaid ? (
                  <span className="text-green-600 font-semibold">
                    ￥{event.ticketPrice?.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-gray-500">{t("free")}</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    event.status === "approved"
                      ? "default"
                      : event.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {t(`status.${event.status}`)}
                </Badge>
              </TableCell>
              <TableCell>
                <Switch
                  checked={event.isPublished}
                  onCheckedChange={() => handleToggle(event.id, "isPublished")}
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={event.isFeatured}
                  onCheckedChange={() => handleToggle(event.id, "isFeatured")}
                />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="min-w-[6rem]">
                    {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                    <DropdownMenuItem
                      onClick={() => router.push(`/admin/events/${event.id}`)}
                    >
                      <span className="bg-blue-400 text-white px-2 py-1 rounded-sm">
                        {t("manage")}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        setSelectedEvent(event);
                        setIsEditSheetOpen(true);
                      }}
                    >
                      <span className="bg-slate-400 text-white px-2 py-1 rounded-sm">
                        {t("edit")}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(event.id, "approved")}
                    >
                      <span className="bg-green-500 text-white px-2 py-1 rounded-sm">
                        {t("approve")}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(event.id, "rejected")}
                    >
                      <span className="bg-red-400 text-white px-2 py-1 rounded-sm">
                        {t("reject")}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(event.id)}>
                      <span className="bg-red-200 text-red-500 px-2 py-1 font-bold rounded-sm">
                        {t("delete")}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedEvent && (
        <EditEventSheet
          event={selectedEvent}
          isOpen={isEditSheetOpen}
          onClose={() => setIsEditSheetOpen(false)}
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
}
