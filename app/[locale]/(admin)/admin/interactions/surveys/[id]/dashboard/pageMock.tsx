"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { mockSurvey, mockResponses, mockStatistics } from "@/data/mockSurvey"; // 引入模拟数据

export default function SurveyDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const t = useTranslations("Admin.Interactions.Surveys");
  const router = useRouter();
  const [survey, setSurvey] = useState(mockSurvey); // 使用模拟数据初始化状态
  const [responses, setResponses] = useState(mockResponses); // 使用模拟数据初始化状态
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [statistics, setStatistics] = useState(mockStatistics); // 使用模拟数据初始化状态

  // 以下 useEffect 可暂时注释掉，使用模拟数据时不需要从 API 获取数据
  // useEffect(() => {
  //     fetchSurveyAndResponses();
  //     const interval = setInterval(fetchSurveyAndResponses, 5000);
  //     return () => clearInterval(interval);
  // }, []);

  // async function fetchSurveyAndResponses() {
  //     try {
  //         const [surveyResponse, responsesResponse, statsResponse] = await Promise.all([
  //             axios.get(`/api/admin/surveys/${params.id}`),
  //             axios.get(`/api/admin/surveys/${params.id}/responses`),
  //             axios.get(`/api/admin/surveys/${params.id}/statistics`)
  //         ]);
  //         setSurvey(surveyResponse.data);
  //         setResponses(responsesResponse.data);
  //         setStatistics(statsResponse.data);
  //         if (
  //             surveyResponse.data.currentQuestion >= 0 &&
  //             surveyResponse.data.currentQuestion < surveyResponse.data.questions.length
  //         ) {
  //             setCurrentQuestionIndex(surveyResponse.data.currentQuestion);
  //         } else {
  //             setCurrentQuestionIndex(0);
  //         }
  //     } catch (error) {
  //         console.error("Error fetching data:", error);
  //         toast({
  //             title: t("fetchError"),
  //             description: t("fetchErrorDescription"),
  //             variant: "destructive"
  //         });
  //     }
  // }

  if (!survey) return <div>{t("loading")}</div>;

  const currentQuestion = survey.questions[currentQuestionIndex];
  const currentQuestionResponses = responses.filter(
    (r) => r.questionId === currentQuestion.id
  );

  const chartData =
    currentQuestion?.options?.map((option) => ({
      name: option.content,
      responses: currentQuestionResponses.filter(
        (r) => JSON.parse(r.answer) === option.content
      ).length,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("surveyDashboard")}</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/interactions/surveys")}
        >
          {t("return")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalResponses")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.totalResponses}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("completionRate")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.completionRate.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("averageTimePerQuestion")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.averageTimePerQuestion.toFixed(2)}s
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("currentQuestion")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentQuestionIndex + 1}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentQuestion?.content}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("responseDistribution")}</CardTitle>
        </CardHeader>
        <CardContent>
          {survey.status === "PUBLISHED" && (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="responses"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {survey.status === "DRAFT" && <div>{t("surveyNotStarted")}</div>}
          {survey.status === "CLOSED" && <div>{t("surveyEnded")}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
