"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const surveySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export default function EditSurveyPage({ params }: { params: { id: string } }) {
  const t = useTranslations("Admin.Interactions.Surveys");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof surveySchema>>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (params.id !== "create") {
      fetchSurvey();
    }
  }, [params.id]);

  async function fetchSurvey() {
    try {
      const response = await fetch(`/api/admin/surveys/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch survey");
      }
      const data = await response.json();
      form.reset(data);
    } catch (error) {
      console.error("Error fetching survey:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function onSubmit(data: z.infer<typeof surveySchema>) {
    setIsLoading(true);
    try {
      const url =
        params.id === "create"
          ? "/api/admin/surveys"
          : `/api/admin/surveys/${params.id}`;
      const method = params.id === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save survey");
      }

      toast({
        title: t("saveSuccess"),
        description: t("saveSuccessDescription"),
      });
      router.push("/admin/interactions/surveys");
    } catch (error) {
      console.error("Error saving survey:", error);
      toast({
        title: t("saveError"),
        description: t("saveErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {params.id === "create" ? t("createSurvey") : t("editSurvey")}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("surveyTitle")}</FormLabel>
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
                <FormLabel>{t("surveyDescription")}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("saving") : t("saveSurvey")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
