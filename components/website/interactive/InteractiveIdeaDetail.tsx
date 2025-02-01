"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useInteractiveIdeas } from "@/data/interactiveIdeas";

interface InteractiveIdeaDetailProps {
  ideaId: string;
}

export function InteractiveIdeaDetail({ ideaId }: InteractiveIdeaDetailProps) {
  const t = useTranslations("InteractiveIdeas");
  const ideas = useInteractiveIdeas();
  const idea = ideas
    .flatMap((category) => category.items)
    .find((item) => item.id === ideaId);

  if (!idea) {
    return <div>{t("ideaNotFound")}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{idea.title}</CardTitle>
        <CardDescription>{idea.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">{t("benefit")}</h3>
        <p>{idea.benefit}</p>
      </CardContent>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">{t("implementation")}</h3>
        <p>{t(`implementations.${idea.id}`)}</p>
      </CardContent>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">{t("examples")}</h3>
        <ul className="list-disc pl-5">
          {[1, 2, 3].map((index) => (
            <li key={index}>{t(`examples.${idea.id}.${index}`)}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
