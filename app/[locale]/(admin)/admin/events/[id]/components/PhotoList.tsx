"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FileUploader } from "@/components/FileUpload";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";

interface Photo {
  id: number;
  imageUrl: string;
  caption: string;
}

const photoSchema = z.object({
  imageUrl: z.string().url("Must be a valid URL"),
  caption: z.string().optional(),
});

export function PhotoList({ eventId }: { eventId: number }) {
  const t = useTranslations("Admin.EventManagement.Photos");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof photoSchema>>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      imageUrl: "",
      caption: "",
    },
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    try {
      const response = await axios.get(`/api/admin/events/${eventId}/photos`);
      setPhotos(response.data);
    } catch (error) {
      console.error("Error fetching photos:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function onSubmit(data: z.infer<typeof photoSchema>) {
    let uploadedPhotoUrl = data.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedPhotoUrl = uploadedImages[0].url;
    }
    data = { ...data, imageUrl: uploadedPhotoUrl };

    try {
      await axios.post(`/api/admin/events/${eventId}/photos`, data);
      toast({
        title: t("uploadSuccess"),
        description: t("uploadSuccessDescription"),
      });
      setIsDialogOpen(false);
      form.reset();
      fetchPhotos();
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: number) {
    try {
      await axios.delete(`/api/admin/events/${eventId}/photos/${id}`);
      toast({
        title: t("deleteSuccess"),
        description: t("deleteSuccessDescription"),
      });
      fetchPhotos();
    } catch (error) {
      console.error("Error deleting photo:", error);
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
          <Button className="mb-4">{t("uploadPhoto")}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("uploadPhoto")}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("photo")}</FormLabel>
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
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("caption")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{t("upload")}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative">
            <Image
              src={photo.imageUrl}
              alt={photo.caption}
              width={300}
              height={300}
              className="w-full h-auto"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => handleDelete(photo.id)}
            >
              {t("delete")}
            </Button>
            {photo.caption && (
              <p className="mt-2 text-sm text-gray-500">{photo.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
