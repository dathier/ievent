import { useTranslations } from "next-intl";

export type Idea = {
  id: string;
  title: string;
  description: string;
  benefit: string;
};

export type Category = {
  category: string;
  items: Idea[];
};

export function useInteractiveIdeas() {
  const t = useTranslations("InteractiveIdeas");

  const categories = [
    "participantInteraction",
    "virtualExperiences",
    "realTimeInteraction",
    "dataVisualization",
    "innovativeTechnology",
    "educationAndSkillDevelopment",
    "innovativeInteractionAndExperience",
    "advancedTechnologyAndInnovativeExperience",
    "cuttingEdgeTechnologyApplications",
    "innovativeInteractionAndSocialExperience",
  ];

  return categories.map((category) => ({
    category,
    items: Object.keys(t.raw("ideas")).map((ideaId) => ({
      id: ideaId,
      title: t(`ideas.${ideaId}.title`),
      description: t(`ideas.${ideaId}.description`),
      benefit: t(`ideas.${ideaId}.benefit`),
    })),
  }));
}
