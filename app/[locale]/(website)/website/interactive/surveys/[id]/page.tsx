"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import type { Survey } from "../types";
import { io } from "socket.io-client";

export default function TakeSurveyPage({ params }: { params: { id: string } }) {
  const t = useTranslations("Surveys");
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [respondentName, setRespondentName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height,
      },
      colorDepth: window.screen.colorDepth,
      orientation: window.screen.orientation.type,
      connection: navigator.connection
        ? {
            type: (navigator.connection as any).effectiveType,
            downlink: (navigator.connection as any).downlink,
          }
        : null,
    };
    setDeviceInfo(info);
  }, []);

  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    console.log(`Connecting to Socket.IO server at ${socketUrl}`);

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      socket.emit("join", { surveyId: params.id });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    socket.on("questionChange", (data) => {
      if (data.surveyId === params.id) {
        setCurrentQuestionIndex(data.questionIndex);
        setIsWaiting(false);
      }
    });

    socket.on("surveyStateChange", (data) => {
      if (data.surveyId === params.id) {
        fetchSurvey();
      }
    });

    return () => {
      console.log("Disconnecting from Socket.IO server");
      socket.disconnect();
    };
  }, [params.id]);

  useEffect(() => {
    let isMounted = true;

    const fetchSurvey = async () => {
      try {
        const response = await axios.get(`/api/surveys/${params.id}`);
        const data = response.data;
        if (isMounted) {
          setSurvey(data);
          if (data.isStarted) {
            setCurrentQuestionIndex(data.currentQuestion);
            setIsWaiting(false);
          }
          if (!data.isStarted && isStarted) {
            setIsStarted(false);
            toast({
              title: t("surveyNotStarted"),
              description: t("pleaseWait"),
            });
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching survey:", error);
        if (isMounted) {
          setIsLoading(false);
          toast({
            title: t("fetchError"),
            description: t("fetchErrorDescription"),
            variant: "destructive",
          });
        }
      }
    };

    fetchSurvey();
    const interval = setInterval(fetchSurvey, 5000);

    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, [params.id, t, isStarted]);

  useEffect(() => {
    const storedAnswers = localStorage.getItem(`survey_${params.id}_answers`);
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
    const storedAnsweredQuestions = localStorage.getItem(
      `survey_${params.id}_answered_questions`
    );
    if (storedAnsweredQuestions) {
      setAnsweredQuestions(JSON.parse(storedAnsweredQuestions));
    }
  }, [params.id]);

  function handleAnswer(answer: string | string[]) {
    const newAnswers = {
      ...answers,
      [currentQuestionIndex]: answer,
    };
    setAnswers(newAnswers);
    localStorage.setItem(
      `survey_${params.id}_answers`,
      JSON.stringify(newAnswers)
    );
  }

  async function submitAnswer() {
    if (!survey || answeredQuestions.includes(currentQuestionIndex)) return;
    setIsSubmitting(true);

    try {
      await axios.post(`/api/surveys/${params.id}/responses`, {
        questionId: survey.questions[currentQuestionIndex].id,
        answer: answers[currentQuestionIndex],
        respondent: respondentName,
      });

      const newAnsweredQuestions = [...answeredQuestions, currentQuestionIndex];
      setAnsweredQuestions(newAnsweredQuestions);
      localStorage.setItem(
        `survey_${params.id}_answered_questions`,
        JSON.stringify(newAnsweredQuestions)
      );

      setIsWaiting(true);
      setIsSubmitting(false);

      if (currentQuestionIndex === survey.questions.length - 1) {
        router.push(`/website/surveys/${params.id}/completion`);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsSubmitting(false);
      toast({
        title: t("submitError"),
        description: t("submitErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function startSurvey() {
    if (!respondentName || !deviceInfo) return;

    try {
      await axios.post(`/api/surveys/${params.id}/participants`, {
        name: respondentName,
        deviceInfo,
      });
      setIsStarted(true);
    } catch (error) {
      console.error("Error registering participant:", error);
      toast({
        title: t("registrationError"),
        description: t("registrationErrorDescription"),
        variant: "destructive",
      });
    }
  }

  if (isLoading) return <div>{t("loading")}</div>;
  if (!survey) return <div>{t("surveyNotFound")}</div>;

  if (!survey.isStarted) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-12 mt-16">
        <Card>
          <CardHeader>
            <CardTitle>{survey.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t("waitingForStart")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-12 mt-16">
        <h1 className="text-3xl font-bold">{survey.title}</h1>
        <Input
          placeholder={t("enterName")}
          value={respondentName}
          onChange={(e) => setRespondentName(e.target.value)}
        />
        <Button onClick={startSurvey} disabled={!respondentName || !deviceInfo}>
          {t("startSurvey")}
        </Button>
      </div>
    );
  }

  if (isWaiting) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-12 mt-16">
        <Card>
          <CardHeader>
            <CardTitle>{survey.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t("waitingForNextQuestion")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = survey.questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-12 mt-16">
        <h1 className="text-3xl font-bold">{survey.title}</h1>
        <div>{t("noQuestionsAvailable")}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 mt-16">
      <h1 className="text-3xl font-bold">{survey.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.content}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion.type === "SINGLE_CHOICE" && (
            <RadioGroup
              onValueChange={(value) => handleAnswer(value)}
              value={answers[currentQuestionIndex] as string}
            >
              {currentQuestion.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.content}
                    id={option.id.toString()}
                  />
                  <Label htmlFor={option.id.toString()}>{option.content}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
          {currentQuestion.type === "MULTIPLE_CHOICE" && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id.toString()}
                    checked={(
                      (answers[currentQuestionIndex] as string[]) || []
                    ).includes(option.content)}
                    onCheckedChange={(checked) => {
                      const currentAnswers =
                        (answers[currentQuestionIndex] as string[]) || [];
                      if (checked) {
                        handleAnswer([...currentAnswers, option.content]);
                      } else {
                        handleAnswer(
                          currentAnswers.filter((a) => a !== option.content)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={option.id.toString()}>{option.content}</Label>
                </div>
              ))}
            </div>
          )}
          {currentQuestion.type === "TEXT" && (
            <Input
              placeholder={t("enterAnswer")}
              value={(answers[currentQuestionIndex] as string) || ""}
              onChange={(e) => handleAnswer(e.target.value)}
            />
          )}
        </CardContent>
      </Card>
      <Button
        onClick={submitAnswer}
        disabled={
          isSubmitting || answeredQuestions.includes(currentQuestionIndex)
        }
      >
        {isSubmitting
          ? t("submitting")
          : answeredQuestions.includes(currentQuestionIndex)
          ? t("answered")
          : t("submit")}
      </Button>
    </div>
  );
}
