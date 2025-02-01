import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useTranslations } from "next-intl"

export default function SurveyOverview({ statistics }) {
  const t = useTranslations("Admin.Interactions.Surveys")

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("totalResponses")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.totalResponses}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("completionRate")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.completionRate.toFixed(2)}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("averageTimePerQuestion")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.averageTimePerQuestion.toFixed(2)}s</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("totalQuestions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.responseDistribution.length}</div>
        </CardContent>
      </Card>
    </div>
  )
}

