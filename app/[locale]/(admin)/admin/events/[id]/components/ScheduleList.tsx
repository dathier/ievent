"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Schedule {
  id: number;
  name: string;
  startTime: Date;
  endTime: Date;
  description: string;
  guests: { id: number; name: string }[];
}

interface Guest {
  id: number;
  name: string;
}

const scheduleSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    startTime: z.date(),
    endTime: z.date(),
    description: z.string().min(1, "Description is required"),
    guestIds: z.array(z.number()).optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export function ScheduleList({ eventId }: { eventId: number }) {
  const t = useTranslations("Admin.EventManagement.Schedule");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      name: "",
      startTime: new Date(),
      endTime: new Date(),
      description: "",
      guestIds: [],
    },
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
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function fetchGuests() {
    try {
      const response = await axios.get(`/api/admin/events/${eventId}/guests`);
      setGuests(response.data);
    } catch (error) {
      console.error("Error fetching guests:", error);
      toast({
        title: t("fetchGuestsError"),
        description: t("fetchGuestsErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function onSubmit(data: z.infer<typeof scheduleSchema>) {
    try {
      if (editingSchedule) {
        await axios.put(
          `/api/admin/events/${eventId}/schedules/${editingSchedule.id}`,
          data
        );
        toast({
          title: t("updateSuccess"),
          description: t("updateSuccessDescription"),
        });
      } else {
        await axios.post(`/api/admin/events/${eventId}/schedules`, data);
        toast({
          title: t("createSuccess"),
          description: t("createSuccessDescription"),
        });
      }
      setIsDialogOpen(false);
      setEditingSchedule(null);
      form.reset();
      fetchSchedules();
    } catch (error) {
      console.error(
        `Error ${editingSchedule ? "updating" : "creating"} schedule:`,
        error
      );
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    }
  }

  function handleEdit(schedule: Schedule) {
    setEditingSchedule(schedule);
    form.reset({
      ...schedule,
      startTime: new Date(schedule.startTime),
      endTime: new Date(schedule.endTime),
      guestIds: schedule.guests.map((g) => g.id),
    });
    setIsDialogOpen(true);
  }

  async function handleDelete(id: number) {
    try {
      await axios.delete(`/api/admin/events/${eventId}/schedules/${id}`);
      toast({
        title: t("deleteSuccess"),
        description: t("deleteSuccessDescription"),
      });
      fetchSchedules();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast({
        title: t("deleteError"),
        description: t("deleteErrorDescription"),
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">
            {editingSchedule ? t("editSchedule") : t("addSchedule")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? t("editSchedule") : t("addSchedule")}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("startTime")}</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("endTime")}</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guestIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("guests")}</FormLabel>
                    <FormControl>
                      <Controller
                        name="guestIds"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => {
                              const newValue = [
                                ...field.value,
                                parseInt(value),
                              ];
                              field.onChange(newValue);
                            }}
                            value={field.value.join(",")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectGuests")} />
                            </SelectTrigger>
                            <SelectContent>
                              {guests.map((guest) => (
                                <SelectItem
                                  key={guest.id}
                                  value={guest.id.toString()}
                                >
                                  {guest.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                {form.watch("guestIds").map((guestId) => (
                  <span
                    key={guestId}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >
                    {guests.find((g) => g.id === guestId)?.name}
                    <button
                      type="button"
                      onClick={() => {
                        const newGuestIds = form
                          .getValues("guestIds")
                          .filter((id) => id !== guestId);
                        form.setValue("guestIds", newGuestIds);
                      }}
                      className="ml-2 text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <Button type="submit">{t("submit")}</Button>
            </form>
          </Form>
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
                {new Date(schedule.startTime).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(schedule.endTime).toLocaleString()}
              </TableCell>
              <TableCell>
                {schedule.guests.map((g) => g.name).join(", ")}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleEdit(schedule)}
                >
                  {t("edit")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(schedule.id)}
                >
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
