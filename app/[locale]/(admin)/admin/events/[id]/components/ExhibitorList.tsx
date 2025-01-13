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
import { FileUploader } from "@/components/FileUpload";
import { useUploadThing } from "@/lib/uploadthing";

interface Exhibitor {
  id: number;
  name: string;
  logo: string;
  website: string;
  description: string;
}

const exhibitorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string().url("Must be a valid URL").optional(),
  website: z.string().url("Must be a valid URL"),
  description: z.string().min(1, "Description is required"),
});

export function ExhibitorList({ eventId }: { eventId: number }) {
  const t = useTranslations("Admin.EventManagement.Exhibitors");
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExhibitor, setEditingExhibitor] = useState<Exhibitor | null>(
    null
  );

  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof exhibitorSchema>>({
    resolver: zodResolver(exhibitorSchema),
    defaultValues: {
      name: "",
      logo: "",
      website: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchExhibitors();
  }, []);

  async function fetchExhibitors() {
    try {
      const response = await axios.get(
        `/api/admin/events/${eventId}/exhibitors`
      );
      setExhibitors(response.data);
    } catch (error) {
      console.error("Error fetching exhibitors:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function onSubmit(data: z.infer<typeof exhibitorSchema>) {
    let uploadedLogoUrl = data.logo;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedLogoUrl = uploadedImages[0].url;
    }
    data = { ...data, logo: uploadedLogoUrl };

    try {
      if (editingExhibitor) {
        await axios.put(
          `/api/admin/events/${eventId}/exhibitors/${editingExhibitor.id}`,
          data
        );
        toast({
          title: t("updateSuccess"),
          description: t("updateSuccessDescription"),
        });
      } else {
        await axios.post(`/api/admin/events/${eventId}/exhibitors`, data);
        toast({
          title: t("createSuccess"),
          description: t("createSuccessDescription"),
        });
      }
      setIsDialogOpen(false);
      setEditingExhibitor(null);
      form.reset();
      fetchExhibitors();
    } catch (error) {
      console.error(
        `Error ${editingExhibitor ? "updating" : "creating"} exhibitor:`,
        error
      );
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    }
  }

  function handleEdit(exhibitor: Exhibitor) {
    setEditingExhibitor(exhibitor);
    form.reset(exhibitor);
    setIsDialogOpen(true);
  }

  async function handleDelete(id: number) {
    try {
      await axios.delete(`/api/admin/events/${eventId}/exhibitors/${id}`);
      toast({
        title: t("deleteSuccess"),
        description: t("deleteSuccessDescription"),
      });
      fetchExhibitors();
    } catch (error) {
      console.error("Error deleting exhibitor:", error);
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
            {editingExhibitor ? t("editExhibitor") : t("addExhibitor")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExhibitor ? t("editExhibitor") : t("addExhibitor")}
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
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("logo")}</FormLabel>
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
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("website")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
              <Button type="submit">{t("submit")}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("website")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exhibitors.map((exhibitor) => (
            <TableRow key={exhibitor.id}>
              <TableCell>{exhibitor.name}</TableCell>
              <TableCell>{exhibitor.website}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleEdit(exhibitor)}
                >
                  {t("edit")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(exhibitor.id)}
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
