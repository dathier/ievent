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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { FileUploader } from "@/components/FileUpload";
import { useUploadThing } from "@/lib/uploadthing";
import { LocationSelector } from "@/components/LocationSelector";

const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  image: z.string().url("Invalid image URL"),
});

export default function CreateVenuePage() {
  const t = useTranslations("Admin.Venues");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof venueSchema>>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      location: "",
      category: "",
      capacity: 0,
      image: "",
    },
  });

  async function onSubmit(data: z.infer<typeof venueSchema>) {
    setIsSubmitting(true);
    let uploadedImageUrl = data.image;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }

    try {
      await axios.post("/api/admin/venues", {
        ...data,
        image: uploadedImageUrl,
      });
      toast({
        title: t("createSuccess"),
        description: t("createSuccessDescription"),
      });
      router.push("/admin/venues");
    } catch (error) {
      console.error("Error creating venue:", error);
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
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t("createVenue")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("venueName")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("venueLocation")}</FormLabel>
                <FormControl>
                  <LocationSelector onLocationChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("venueCategory")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCategory")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="conference">
                      {t("categoryConference")}
                    </SelectItem>
                    <SelectItem value="exhibition">
                      {t("categoryExhibition")}
                    </SelectItem>
                    <SelectItem value="banquet">
                      {t("categoryBanquet")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("venueCapacity")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("venueImage")}</FormLabel>
                <FormControl>
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("creating") : t("createVenue")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
