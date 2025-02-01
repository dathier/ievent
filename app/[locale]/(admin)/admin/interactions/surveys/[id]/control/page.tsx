"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SurveyControlPage({
  params,
}: {
  params: { id: string };
}) {
  const t = useTranslations("Admin.Interactions.Surveys");
  const [survey, setSurvey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchSurvey();
    const interval = setInterval(fetchSurvey, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchSurvey() {
    try {
      const response = await axios.get(`/api/admin/surveys/${params.id}`);
      setSurvey(response.data);
      setCurrentQuestionIndex(response.data.currentQuestion);
    } catch (error) {
      console.error("Error fetching survey:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function updateCurrentQuestion(index: number) {
    try {
      const response = await axios.put(
        `/api/admin/surveys/${params.id}/control`,
        {
          currentQuestion: index,
        }
      );
      if (response.data) {
        setCurrentQuestionIndex(index);
        toast({
          title: t("questionUpdated"),
          description: t("questionUpdatedDescription"),
        });
      }
    } catch (error) {
      console.error("Error updating current question:", error);
      toast({
        title: t("updateError"),
        description: t("updateErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function startSurvey() {
    try {
      await axios.put(`/api/admin/surveys/${params.id}/control`, {
        isStarted: true,
        currentQuestion: 0,
      });
      fetchSurvey();
      toast({
        title: t("surveyStarted"),
        description: t("surveyStartedDescription"),
      });
    } catch (error) {
      console.error("Error starting survey:", error);
      toast({
        title: t("startError"),
        description: t("startErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function endSurvey() {
    try {
      await axios.put(`/api/admin/surveys/${params.id}/control`, {
        isStarted: false,
      });
      fetchSurvey();
      toast({
        title: t("surveyEnded"),
        description: t("surveyEndedDescription"),
      });
    } catch (error) {
      console.error("Error ending survey:", error);
      toast({
        title: t("endError"),
        description: t("endErrorDescription"),
        variant: "destructive",
      });
    }
  }

  if (!survey) return <div>{t("loading")}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("surveyControl")}</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/interactions/surveys")}
        >
          {t("return")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{survey.title}</CardTitle>
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
                  <Button onClick={startSurvey}>{t("startSurvey")}</Button>
                ) : (
                  <Button variant="destructive" onClick={endSurvey}>
                    {t("endSurvey")}
                  </Button>
                )}
              </div>
            </div>

            {survey.isStarted && (
              <>
                <div>
                  {t("currentQuestion")}: {currentQuestionIndex + 1}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() =>
                      updateCurrentQuestion(
                        Math.max(0, currentQuestionIndex - 1)
                      )
                    }
                    disabled={currentQuestionIndex === 0}
                  >
                    {t("previousQuestion")}
                  </Button>
                  <Button
                    onClick={() =>
                      updateCurrentQuestion(
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
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
