"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
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

interface Video {
  id: number;
  title: string;
  url: string;
}

const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL"),
});

export function VideoList({ eventId }: { eventId: number }) {
  const t = useTranslations("Admin.EventManagement.Videos");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("videoUploader");

  const form = useForm<z.infer<typeof videoSchema>>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    try {
      const response = await axios.get(`/api/admin/events/${eventId}/videos`);
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function onSubmit(data: z.infer<typeof videoSchema>) {
    let uploadedVideoUrl = data.url;

    if (files.length > 0) {
      const uploadedVideos = await startUpload(files);

      if (!uploadedVideos) {
        return;
      }

      uploadedVideoUrl = uploadedVideos[0].url;
    }
    data = { ...data, url: uploadedVideoUrl };

    try {
      if (editingVideo) {
        await axios.put(
          `/api/admin/events/${eventId}/videos/${editingVideo.id}`,
          data
        );
        toast({
          title: t("updateSuccess"),
          description: t("updateSuccessDescription"),
        });
      } else {
        await axios.post(`/api/admin/events/${eventId}/videos`, data);
        toast({
          title: t("createSuccess"),
          description: t("createSuccessDescription"),
        });
      }
      setIsDialogOpen(false);
      setEditingVideo(null);
      form.reset();
      fetchVideos();
    } catch (error) {
      console.error(
        `Error ${editingVideo ? "updating" : "creating"} video:`,
        error
      );
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    }
  }

  function handleEdit(video: Video) {
    setEditingVideo(video);
    form.reset(video);
    setIsDialogOpen(true);
  }

  async function handleDelete(id: number) {
    try {
      await axios.delete(`/api/admin/events/${eventId}/videos/${id}`);
      toast({
        title: t("deleteSuccess"),
        description: t("deleteSuccessDescription"),
      });
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
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
            {editingVideo ? t("editVideo") : t("addVideo")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? t("editVideo") : t("addVideo")}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("title")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("video")}</FormLabel>
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
              <Button type="submit">{t("submit")}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("title")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => (
            <TableRow key={video.id}>
              <TableCell>{video.title}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleEdit(video)}
                >
                  {t("edit")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(video.id)}
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
