"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

interface Survey {
  id: number;
  title: string;
  status: string;
  createdAt: string;
}

export default function SurveysPage() {
  const t = useTranslations("Admin.Interactions.Surveys");
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    fetchSurveys();
  }, []);

  async function fetchSurveys() {
    try {
      const response = await fetch("/api/admin/surveys");
      if (!response.ok) {
        throw new Error("Failed to fetch surveys");
      }
      const data = await response.json();
      setSurveys(data);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function deleteSurvey(id: number) {
    try {
      const response = await fetch(`/api/admin/surveys/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete survey");
      }
      toast({
        title: t("deleteSuccess"),
        description: t("deleteSuccessDescription"),
      });
      fetchSurveys();
    } catch (error) {
      console.error("Error deleting survey:", error);
      toast({
        title: t("deleteError"),
        description: t("deleteErrorDescription"),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("surveysList")}</h1>
        <Button asChild>
          <a href="/admin/interactions/surveys/create">{t("createSurvey")}</a>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("surveyTitle")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("createdAt")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {surveys.map((survey) => (
            <TableRow key={survey.id}>
              <TableCell className="font-medium">{survey.title}</TableCell>
              <TableCell>{t(`status.${survey.status}`)}</TableCell>
              <TableCell>
                {new Date(survey.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <a href={`/admin/interactions/surveys/${survey.id}/edit`}>
                      {t("edit")}
                    </a>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSurvey(survey.id)}
                  >
                    {t("delete")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
