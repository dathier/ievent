import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Pie,
  PieChart,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function QuestionDetails({ question, responseDistribution }) {
  const t = useTranslations("Admin.Interactions.Surveys");

  const renderChart = () => {
    if (question.type === "TEXT") {
      return (
        <div className="h-[400px] overflow-y-auto">
          <ul>
            {responseDistribution.map((item, index) => (
              <li key={index} className="mb-2">
                {item.name}: {item.responses}
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (
      question.type === "SINGLE_CHOICE" ||
      question.type === "MULTIPLE_CHOICE"
    ) {
      return (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={responseDistribution}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="responses" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.content}</CardTitle>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
}
