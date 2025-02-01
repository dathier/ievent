"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function TestSurveyPage({ params }: { params: { id: string } }) {
  const t = useTranslations("Admin.Interactions.Surveys");
  const router = useRouter();
  const [survey, setSurvey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetchSurvey();
  }, []);

  async function fetchSurvey() {
    try {
      const response = await fetch(`/api/admin/surveys/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch survey");
      const data = await response.json();
      setSurvey(data);
    } catch (error) {
      console.error("Error fetching survey:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  function handleAnswer(answer) {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer,
    });
  }

  function nextQuestion() {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 测试完成，显示结果
      console.log("Test completed:", answers);
      toast({
        title: t("testCompleted"),
        description: t("testCompletedDescription"),
      });
      router.push(`/admin/interactions/surveys/${params.id}`);
    }
  }

  if (!survey) return <div>{t("loading")}</div>;

  const currentQuestion = survey?.questions?.[currentQuestionIndex];

  if (!currentQuestion) return <div>{t("loading")}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("testSurvey")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.content}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion.type === "SINGLE_CHOICE" && (
            <RadioGroup onValueChange={handleAnswer}>
              {currentQuestion.options.map((option) => (
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
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id.toString()}
                    onCheckedChange={(checked) => {
                      const currentAnswers =
                        answers[currentQuestionIndex] || [];
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
              onChange={(e) => handleAnswer(e.target.value)}
            />
          )}
        </CardContent>
      </Card>
      <Button onClick={nextQuestion}>
        {currentQuestionIndex < survey.questions.length - 1
          ? t("nextQuestion")
          : t("finish")}
      </Button>
    </div>
  );
}
