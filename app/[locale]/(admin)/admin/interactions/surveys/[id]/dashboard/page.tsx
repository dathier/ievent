"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { io } from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import SurveyOverview from "./components/SurveyOverview";
import QuestionDetails from "./components/QuestionDetails";
import RespondentInfo from "./components/RespondentInfo";
import ExportButton from "./components/ExportButton";

export default function SurveyDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const t = useTranslations("Admin.Interactions.Surveys");
  const router = useRouter();
  const [survey, setSurvey] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
      {
        transports: ["websocket", "polling"],
      }
    );
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      newSocket.emit("join", { surveyId: params.id });
    });

    newSocket.on("newResponse", (data) => {
      console.log("New response received:", data);
      fetchSurveyAndStatistics();
    });

    return () => {
      newSocket.disconnect();
    };
  }, [params.id]);

  useEffect(() => {
    fetchSurveyAndStatistics();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchSurveyAndStatistics, 5000);
    return () => clearInterval(interval);
  }, [params.id]);

  async function fetchSurveyAndStatistics() {
    try {
      const [surveyResponse, statsResponse] = await Promise.all([
        axios.get(`/api/admin/surveys/${params.id}`),
        axios.get(`/api/admin/surveys/${params.id}/statistics`),
      ]);

      setSurvey(surveyResponse.data);
      setStatistics(statsResponse.data);
      setCurrentQuestionIndex(surveyResponse.data.currentQuestion);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function handleQuestionChange(newIndex: number) {
    try {
      await axios.put(`/api/admin/surveys/${params.id}/control`, {
        currentQuestion: newIndex,
      });
      setCurrentQuestionIndex(newIndex);
      socket?.emit("questionChange", {
        surveyId: params.id,
        questionIndex: newIndex,
      });
    } catch (error) {
      console.error("Error updating current question:", error);
      toast({
        title: t("updateError"),
        description: t("updateErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function handleSurveyControl(isStarted: boolean) {
    try {
      await axios.put(`/api/admin/surveys/${params.id}/control`, {
        isStarted,
        currentQuestion: isStarted ? 0 : currentQuestionIndex,
      });
      fetchSurveyAndStatistics();
      socket?.emit("surveyStateChange", { surveyId: params.id, isStarted });
      toast({
        title: isStarted ? t("surveyStarted") : t("surveyEnded"),
        description: isStarted
          ? t("surveyStartedDescription")
          : t("surveyEndedDescription"),
      });
    } catch (error) {
      console.error("Error controlling survey:", error);
      toast({
        title: t("controlError"),
        description: t("controlErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function generateQrCode() {
    try {
      const response = await axios.post(
        `/api/admin/surveys/${params.id}/publish`
      );
      setQrCode(response.data.qrCode);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: t("qrCodeError"),
        description: t("qrCodeErrorDescription"),
        variant: "destructive",
      });
    }
  }

  if (!survey || !statistics) return <div>{t("loading")}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("surveyDashboard")}</h1>
        <div className="space-x-2">
          <Button onClick={generateQrCode}>{t("generateQrCode")}</Button>
          <ExportButton surveyId={params.id} />
          <Button
            variant="outline"
            onClick={() => router.push("/admin/interactions/surveys")}
          >
            {t("return")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("surveyControl")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                {t("surveyStatus")}:{" "}
                {survey.isStarted ? t("inProgress") : t("notStarted")}
              </div>
              <div className="space-x-2">
                {!survey.isStarted ? (
                  <Button onClick={() => handleSurveyControl(true)}>
                    {t("startSurvey")}
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => handleSurveyControl(false)}
                  >
                    {t("endSurvey")}
                  </Button>
                )}
              </div>
            </div>

            {survey.isStarted && (
              <div className="space-y-4">
                <div>
                  {t("currentQuestion")}: {currentQuestionIndex + 1} /{" "}
                  {survey.questions.length}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() =>
                      handleQuestionChange(
                        Math.max(0, currentQuestionIndex - 1)
                      )
                    }
                    disabled={currentQuestionIndex === 0}
                  >
                    {t("previousQuestion")}
                  </Button>
                  <Button
                    onClick={() =>
                      handleQuestionChange(
                        Math.min(
                          survey.questions.length - 1,
                          currentQuestionIndex + 1
                        )
                      )
                    }
                    disabled={
                      currentQuestionIndex === survey.questions.length - 1
                    }
                  >
                    {t("nextQuestion")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SurveyOverview statistics={statistics} />

      <QuestionDetails
        question={survey.questions[currentQuestionIndex]}
        responseDistribution={
          statistics.responseDistribution[currentQuestionIndex]
        }
      />

      <RespondentInfo respondents={statistics.respondents} />

      <Dialog open={!!qrCode} onOpenChange={() => setQrCode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("qrCodeTitle")}</DialogTitle>
          </DialogHeader>
          {qrCode && (
            <div className="flex justify-center">
              <Image
                src={qrCode || "/placeholder.svg"}
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
