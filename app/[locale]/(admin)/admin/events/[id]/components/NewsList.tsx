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

interface News {
  id: number;
  title: string;
  content: string;
}

const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export function NewsList({ eventId }: { eventId: number }) {
  const t = useTranslations("Admin.EventManagement.News");
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  const form = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      const response = await axios.get(`/api/admin/events/${eventId}/news`);
      setNewsList(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function onSubmit(data: z.infer<typeof newsSchema>) {
    try {
      if (editingNews) {
        await axios.put(
          `/api/admin/events/${eventId}/news/${editingNews.id}`,
          data
        );
        toast({
          title: t("updateSuccess"),
          description: t("updateSuccessDescription"),
        });
      } else {
        await axios.post(`/api/admin/events/${eventId}/news`, data);
        toast({
          title: t("createSuccess"),
          description: t("createSuccessDescription"),
        });
      }
      setIsDialogOpen(false);
      setEditingNews(null);
      form.reset();
      fetchNews();
    } catch (error) {
      console.error(
        `Error ${editingNews ? "updating" : "creating"} news:`,
        error
      );
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    }
  }

  function handleEdit(news: News) {
    setEditingNews(news);
    form.reset(news);
    setIsDialogOpen(true);
  }

  async function handleDelete(id: number) {
    try {
      await axios.delete(`/api/admin/events/${eventId}/news/${id}`);
      toast({
        title: t("deleteSuccess"),
        description: t("deleteSuccessDescription"),
      });
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
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
            {editingNews ? t("editNews") : t("addNews")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingNews ? t("editNews") : t("addNews")}
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("content")}</FormLabel>
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
            <TableHead>{t("title")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newsList.map((news) => (
            <TableRow key={news.id}>
              <TableCell>{news.title}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleEdit(news)}
                >
                  {t("edit")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(news.id)}
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
