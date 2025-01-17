"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-time-picker";

const eventSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().url().optional(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().min(1),
  isPaid: z.boolean(),
  ticketPrice: z.number().min(0).optional(),
  eventType: z.string().min(1),
  industryType: z.string().min(1),
  businessType: z.string().min(1),
  description: z.string().min(1),
  requiresRegistration: z.boolean(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
});

interface EditEventFormProps {
  event: IEvent;
  onSubmit: (data: z.infer<typeof eventSchema>) => Promise<void>;
}

type IEvent = {
  id: number;
  title: string;
  imageUrl: string;
  startDate: Date;
  endDate: Date;
  location: string;
  isPaid: boolean;
  ticketPrice: number | null;
  eventType: string;
  industryType: string;
  businessType: string;
  description: string;
  requiresRegistration: boolean;
  isPublished: boolean;
  isFeatured: boolean;
};

export function EditEventForm({ event, onSubmit }: EditEventFormProps) {
  const t = useTranslations("Admin.Events");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      imageUrl: event.imageUrl,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      location: event.location,
      isPaid: event.isPaid,
      ticketPrice: event.ticketPrice || 0,
      eventType: event.eventType,
      industryType: event.industryType,
      businessType: event.businessType,
      description: event.description,
      requiresRegistration: event.requiresRegistration,
      isPublished: event.isPublished,
      isFeatured: event.isFeatured,
    },
  });

  const handleSubmit = async (data: z.infer<typeof eventSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("eventTitle")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("imageUrl")}</FormLabel>
              <FormControl>
                <Input {...field} type="url" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("startDate")}</FormLabel>
              <FormControl>
                <DateTimePicker
                  value={field.value}
                  onChange={(date: Date) => field.onChange(date)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("endDate")}</FormLabel>
              <FormControl>
                <DateTimePicker
                  value={field.value}
                  onChange={(date: Date) => field.onChange(date)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("eventLocation")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPaid"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>{t("isPaid")}</FormLabel>
            </FormItem>
          )}
        />

        {form.watch("isPaid") && (
          <FormField
            control={form.control}
            name="ticketPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("ticketPrice")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("eventType")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("eventDescription")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="requiresRegistration"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>{t("requiresRegistration")}</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>{t("isPublished")}</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>{t("isFeatured")}</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("saving") : t("save")}
        </Button>
      </form>
    </Form>
  );
}
