"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const questionSchema = z.object({
  id: z.number().optional(),
  content: z.string().min(1, "Question content is required"),
  type: z.enum(["MULTIPLE_CHOICE", "SINGLE_CHOICE", "TEXT"]),
  options: z
    .array(
      z.object({
        id: z.number().optional(),
        content: z.string().min(1, "Option content is required"),
      })
    )
    .optional(),
});

const surveySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  questions: z.array(questionSchema),
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
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  useEffect(() => {
    if (params.id !== "create") {
      fetchSurvey();
    }
  }, [params.id]);

  async function fetchSurvey() {
    try {
      const response = await axios.get(`/api/admin/surveys/${params.id}`);
      form.reset(response.data);
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
      const method = params.id === "create" ? "post" : "put";

      const response = await axios[method](url, data);

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {params.id === "create" ? t("createSurvey") : t("editSurvey")}
        </h1>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/interactions/surveys")}
        >
          {t("return")}
        </Button>
      </div>
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
          <div>
            <h2 className="text-xl font-semibold mb-4">{t("questions")}</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 mb-6 p-4 border rounded">
                <FormField
                  control={form.control}
                  name={`questions.${index}.content`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("questionContent")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`questions.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("questionType")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("selectQuestionType")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MULTIPLE_CHOICE">
                            {t("multipleChoice")}
                          </SelectItem>
                          <SelectItem value="SINGLE_CHOICE">
                            {t("singleChoice")}
                          </SelectItem>
                          <SelectItem value="TEXT">{t("text")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {(form.watch(`questions.${index}.type`) === "MULTIPLE_CHOICE" ||
                  form.watch(`questions.${index}.type`) ===
                    "SINGLE_CHOICE") && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("options")}
                    </h3>
                    {form
                      .watch(`questions.${index}.options`)
                      ?.map((option, optionIndex) => (
                        <FormField
                          key={optionIndex}
                          control={form.control}
                          name={`questions.${index}.options.${optionIndex}.content`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("optionContent")}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const options =
                          form.getValues(`questions.${index}.options`) || [];
                        form.setValue(`questions.${index}.options`, [
                          ...options,
                          { content: "" },
                        ]);
                      }}
                    >
                      {t("addOption")}
                    </Button>
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  {t("removeQuestion")}
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ content: "", type: "TEXT" })}
            >
              {t("addQuestion")}
            </Button>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("saving") : t("saveSurvey")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
