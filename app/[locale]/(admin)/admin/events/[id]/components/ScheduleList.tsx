"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Schedule {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  guests: { id: number; name: string }[];
}

interface Guest {
  id: number;
  name: string;
}

export function ScheduleList({ eventId }: { eventId: number }) {
  const t = useTranslations("Admin.EventManagement.Schedule");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    startTime: "",
    endTime: "",
    description: "",
    guestIds: [],
  });

  useEffect(() => {
    fetchSchedules();
    fetchGuests();
  }, []);

  async function fetchSchedules() {
    try {
      const response = await axios.get(
        `/api/admin/events/${eventId}/schedules`
      );
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  }

  async function fetchGuests() {
    try {
      const response = await axios.get(`/api/admin/events/${eventId}/guests`);
      setGuests(response.data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.post(`/api/admin/events/${eventId}/schedules`, newSchedule);
      toast({
        title: t("scheduleCreated"),
        description: t("scheduleCreatedDescription"),
      });
      fetchSchedules();
      setNewSchedule({
        name: "",
        startTime: "",
        endTime: "",
        description: "",
        guestIds: [],
      });
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast({
        title: t("scheduleCreationError"),
        description: t("scheduleCreationErrorDescription"),
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">{t("addSchedule")}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addSchedule")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder={t("name")}
              value={newSchedule.name}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, name: e.target.value })
              }
              required
            />
            <Input
              type="datetime-local"
              placeholder={t("startTime")}
              value={newSchedule.startTime}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, startTime: e.target.value })
              }
              required
            />
            <Input
              type="datetime-local"
              placeholder={t("endTime")}
              value={newSchedule.endTime}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, endTime: e.target.value })
              }
              required
            />
            <Textarea
              placeholder={t("description")}
              value={newSchedule.description}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, description: e.target.value })
              }
              required
            />
            <Select
              onValueChange={(value) =>
                setNewSchedule({
                  ...newSchedule,
                  guestIds: [...newSchedule.guestIds, parseInt(value)],
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectGuests")} />
              </SelectTrigger>
              <SelectContent>
                {guests.map((guest) => (
                  <SelectItem key={guest.id} value={guest.id.toString()}>
                    {guest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              {newSchedule.guestIds.map((guestId) => (
                <span
                  key={guestId}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {guests.find((g) => g.id === guestId)?.name}
                  <button
                    type="button"
                    onClick={() =>
                      setNewSchedule({
                        ...newSchedule,
                        guestIds: newSchedule.guestIds.filter(
                          (id) => id !== guestId
                        ),
                      })
                    }
                    className="ml-2 text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <Button type="submit">{t("submit")}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("startTime")}</TableHead>
            <TableHead>{t("endTime")}</TableHead>
            <TableHead>{t("guests")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>{schedule.name}</TableCell>
              <TableCell>
                {format(new Date(schedule.startTime), "PPp")}
              </TableCell>
              <TableCell>{format(new Date(schedule.endTime), "PPp")}</TableCell>
              <TableCell>
                {schedule.guests.map((g) => g.name).join(", ")}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">
                  {t("edit")}
                </Button>
                <Button variant="destructive" size="sm">
                  {t("delete")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
