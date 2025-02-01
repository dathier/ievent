import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import axios from "axios"
import { toast } from "@/hooks/use-toast"

export default function SurveyControl({ surveyId, currentQuestion, totalQuestions, onQuestionChange }) {
  const t = useTranslations("Admin.Interactions.Surveys")

  const handleQuestionChange = async (newIndex) => {
    try {
      await axios.put(`/api/admin/surveys/${surveyId}/control`, {
        currentQuestion: newIndex,
      })
      onQuestionChange(newIndex)
    } catch (error) {
      console.error("Error updating current question:", error)
      toast({
        title: t("updateError"),
        description: t("updateErrorDescription"),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex justify-between items-center">
      <Button onClick={() => handleQuestionChange(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}>
        {t("previousQuestion")}
      </Button>
      <span>{t("questionProgress", { current: currentQuestion + 1, total: totalQuestions })}</span>
      <Button
        onClick={() => handleQuestionChange(Math.min(totalQuestions - 1, currentQuestion + 1))}
        disabled={currentQuestion === totalQuestions - 1}
      >
        {t("nextQuestion")}
      </Button>
    </div>
  )
}

