"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

export default function SurveyResponsesPage({
  params,
}: {
  params: { id: string };
}) {
  const t = useTranslations("Admin.Interactions.Surveys");
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetchResponses();
  }, []);

  async function fetchResponses() {
    try {
      const response = await fetch(`/api/admin/surveys/${params.id}/responses`);
      if (!response.ok) throw new Error("Failed to fetch responses");
      const data = await response.json();
      setResponses(data);
    } catch (error) {
      console.error("Error fetching responses:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("surveyResponses")}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("respondent")}</TableHead>
            <TableHead>{t("question")}</TableHead>
            <TableHead>{t("answer")}</TableHead>
            <TableHead>{t("submittedAt")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.map((response) => (
            <TableRow key={response.id}>
              <TableCell>{response.respondent}</TableCell>
              <TableCell>{response.question.content}</TableCell>
              <TableCell>{JSON.parse(response.answer)}</TableCell>
              <TableCell>
                {new Date(response.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
