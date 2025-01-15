"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploader } from "@/components/FileUpload";

import { useUploadThing } from "@/lib/uploadthing";

const websiteContentSchema = z.object({
  heroTitle: z.string().min(1, "Title is required"),
  heroSubtitle: z.string().min(1, "Subtitle is required"),
  heroDescription: z.string().min(1, "Description is required"),
  imageUrl: z.string(),
});

interface WebsiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  imageUrl: string;
}

export default function WebsiteManagement() {
  const t = useTranslations("Admin.Website");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent[]>([]);

  const form = useForm<z.infer<typeof websiteContentSchema>>({
    resolver: zodResolver(websiteContentSchema),
    defaultValues: {
      heroTitle: "",
      heroSubtitle: "",
      heroDescription: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    fetchWebsiteContent();
  }, []);

  async function fetchWebsiteContent() {
    try {
      const response = await axios.get("/api/admin/website");
      setWebsiteContent(response.data);
      form.reset(response.data);
    } catch (error) {
      console.error("Error fetching website content:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function onSubmit(data: z.infer<typeof websiteContentSchema>) {
    setIsLoading(true);

    let uploadedImageUrl = data.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }
    data = { ...data, imageUrl: uploadedImageUrl };

    try {
      const response = await axios.post("/api/admin/website", data);

      toast({
        title: t("updateSuccess"),
        description: t("updateSuccessDescription"),
      });
    } catch (error) {
      console.error("Error updating website content:", error);
      toast({
        title: t("updateError"),
        description: t("updateErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="heroTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("heroTitle")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="heroSubtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("heroSubtitle")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="heroDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("heroDescription")}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
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
                <FormLabel>{t("heroBackgroundImage")}</FormLabel>
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("saving") : t("saveChanges")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
