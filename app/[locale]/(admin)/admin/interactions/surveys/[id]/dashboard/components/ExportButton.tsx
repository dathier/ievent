import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import axios from "axios"
import { toast } from "@/hooks/use-toast"

export default function ExportButton({ surveyId }) {
  const t = useTranslations("Admin.Interactions.Surveys")

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`/api/admin/surveys/${surveyId}/export`, {
        params: { format },
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `survey_results.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Error exporting survey results:", error)
      toast({
        title: t("exportError"),
        description: t("exportErrorDescription"),
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Button onClick={() => handleExport("csv")}>{t("exportCSV")}</Button>
      <Button onClick={() => handleExport("pdf")}>{t("exportPDF")}</Button>
    </>
  )
}

