"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Livestream {
  id: number;
  streamUrl: string;
  status: "live" | "upcoming" | "ended" | "replay" | "offline";
}

const livestreamSchema = z.object({
  streamUrl: z.string().url("Must be a valid URL"),
  status: z.enum(["live", "upcoming", "ended", "replay", "offline"]),
});

export function Livestream({ eventId }: { eventId: number }) {
  const t = useTranslations("Admin.EventManagement.Livestream");
  const [livestream, setLivestream] = useState<Livestream | null>(null);

  const form = useForm<z.infer<typeof livestreamSchema>>({
    resolver: zodResolver(livestreamSchema),
    defaultValues: {
      streamUrl: "",
      status: "offline",
    },
  });

  useEffect(() => {
    fetchLivestream();
  }, []);

  async function fetchLivestream() {
    try {
      const response = await axios.get(
        `/api/admin/events/${eventId}/livestream`
      );
      setLivestream(response.data);
      form.reset(response.data);
    } catch (error) {
      console.error("Error fetching livestream:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function onSubmit(data: z.infer<typeof livestreamSchema>) {
    try {
      if (livestream) {
        await axios.put(`/api/admin/events/${eventId}/livestream`, data);
        toast({
          title: t("updateSuccess"),
          description: t("updateSuccessDescription"),
        });
      } else {
        await axios.post(`/api/admin/events/${eventId}/livestream`, data);
        toast({
          title: t("createSuccess"),
          description: t("createSuccessDescription"),
        });
      }
      fetchLivestream();
    } catch (error) {
      console.error("Error updating livestream:", error);
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="streamUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("url")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("status")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectStatus")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="live">{t("statuses.live")}</SelectItem>
                    <SelectItem value="upcoming">
                      {t("statuses.upcoming")}
                    </SelectItem>
                    <SelectItem value="ended">{t("statuses.ended")}</SelectItem>
                    <SelectItem value="replay">
                      {t("statuses.replay")}
                    </SelectItem>
                    <SelectItem value="offline">
                      {t("statuses.offline")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {livestream ? t("update") : t("create")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
