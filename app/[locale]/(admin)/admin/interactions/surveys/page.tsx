"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
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
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface Survey {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  qrCode?: string;
}

export default function SurveysPage() {
  const t = useTranslations("Admin.Interactions.Surveys");
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSurveys();
  }, []);

  async function fetchSurveys() {
    try {
      const response = await axios.get("/api/admin/surveys");
      setSurveys(response.data);
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
      await axios.delete(`/api/admin/surveys/${id}`);
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

  async function updateSurveyStatus(id: number, status: string) {
    try {
      await axios.put(`/api/admin/surveys/${id}`, { status });
      fetchSurveys();
      toast({
        title: t("updateSuccess"),
        description: t("updateSuccessDescription"),
      });
    } catch (error) {
      console.error("Error updating survey status:", error);
      toast({
        title: t("updateError"),
        description: t("updateErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function generateQrCode(id: number) {
    try {
      const response = await axios.post(`/api/admin/surveys/${id}/publish`);
      const updatedSurvey = response.data;
      setSelectedQrCode(updatedSurvey.qrCode);
      fetchSurveys();
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: t("qrCodeError"),
        description: t("qrCodeErrorDescription"),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("surveysList")}</h1>
        <div>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/interactions")}
            className="mr-2"
          >
            {t("return")}
          </Button>
          <Button asChild>
            <Link href="/admin/interactions/surveys/create">
              {t("createSurvey")}
            </Link>
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("surveyTitle")}</TableHead>
            <TableHead>{t("statusTitle")}</TableHead>
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
                  {survey.status === "DRAFT" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateSurveyStatus(survey.id, "PUBLISHED")
                        }
                      >
                        {t("publish")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/admin/interactions/surveys/${survey.id}/test`
                          )
                        }
                      >
                        {t("test")}
                      </Button>
                    </>
                  )}
                  {survey.status === "PUBLISHED" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSurveyStatus(survey.id, "CLOSED")}
                      >
                        {t("close")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSurveyStatus(survey.id, "DRAFT")}
                      >
                        {t("retract")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateQrCode(survey.id)}
                      >
                        {t("qrCode")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/admin/interactions/surveys/${survey.id}/dashboard`
                          )
                        }
                      >
                        {t("dashboard")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/admin/interactions/surveys/${survey.id}/control`
                          )
                        }
                      >
                        {t("control")}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/admin/interactions/surveys/${survey.id}/edit`
                      )
                    }
                  >
                    {t("edit")}
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

      <Dialog
        open={!!selectedQrCode}
        onOpenChange={() => setSelectedQrCode(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("qrCodeTitle")}</DialogTitle>
          </DialogHeader>
          {selectedQrCode && (
            <div className="flex justify-center">
              <Image
                src={selectedQrCode || "/placeholder.svg"}
                alt="QR Code"
                width={200}
                height={200}
                className="border p-2 rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
