"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { toast } from "@/hooks/use-toast";
import { FileUploader } from "@/components/FileUpload";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { useUploadThing } from "@/lib/uploadthing";

const eventSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    imageUrl: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    location: z.string().min(1, "Location is required"),
    isPaid: z.boolean(),
    ticketPrice: z.number().min(0).optional(),
    eventType: z.string().min(1, "Event type is required"),
    industryType: z.string().min(1, "Industry type is required"),
    businessType: z.string().min(1, "Business type is required"),
    description: z.string().min(1, "Description is required"),
    requiresRegistration: z.boolean(),
    isPublished: z.boolean(),
    isFeatured: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isPaid) {
        return data.ticketPrice !== undefined && data.ticketPrice > 0;
      }
      return true;
    },
    {
      message: "Ticket price is required for paid events",
      path: ["ticketPrice"],
    }
  )
  .refine(
    (data) => {
      return data.endDate > data.startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export default function CreateEventPage() {
  const t = useTranslations("Admin.Events");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      startDate: new Date(),
      endDate: new Date(),
      location: "",
      isPaid: false,
      ticketPrice: 0,
      eventType: "",
      industryType: "",
      businessType: "",
      description: "",
      requiresRegistration: false,
      isPublished: false,
      isFeatured: false,
    },
  });

  async function onSubmit(data: z.infer<typeof eventSchema>) {
    setIsSubmitting(true);
    let uploadedImageUrl = data.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }
    data = { ...data, imageUrl: uploadedImageUrl };

    console.log("Submitting event data:", data);
    try {
      const response = await axios.post("/api/admin/events", data);
      toast({
        title: t("createSuccess"),
        description: t("createSuccessDescription"),
      });
      router.push("/admin/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: t("createError"),
        description: t("createErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t("createEvent")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("eventTitle")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
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
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormDescription>{t("imageUrlDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-8">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("startDate")}</FormLabel>
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
              name="endDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("endDate")}</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      minDate={form.watch("startDate")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("eventLocation")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPaid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("isPaid")}</FormLabel>
                  <FormDescription>{t("isPaidDescription")}</FormDescription>
                </div>
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
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectEventType")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="conference">
                      {t("eventTypes.conference")}
                    </SelectItem>
                    <SelectItem value="workshop">
                      {t("eventTypes.workshop")}
                    </SelectItem>
                    <SelectItem value="seminar">
                      {t("eventTypes.seminar")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("industryType")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectIndustryType")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="technology">
                      {t("industryTypes.technology")}
                    </SelectItem>
                    <SelectItem value="healthcare">
                      {t("industryTypes.healthcare")}
                    </SelectItem>
                    <SelectItem value="finance">
                      {t("industryTypes.finance")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("businessType")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectBusinessType")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="b2b">
                      {t("businessTypes.b2b")}
                    </SelectItem>
                    <SelectItem value="b2c">
                      {t("businessTypes.b2c")}
                    </SelectItem>
                    <SelectItem value="b2g">
                      {t("businessTypes.b2g")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requiresRegistration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("requiresRegistration")}</FormLabel>
                  <FormDescription>
                    {t("requiresRegistrationDescription")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("isPublished")}</FormLabel>
                  <FormDescription>
                    {t("isPublishedDescription")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("isFeatured")}</FormLabel>
                  <FormDescription>
                    {t("isFeaturedDescription")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("creating") : t("createEvent")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
