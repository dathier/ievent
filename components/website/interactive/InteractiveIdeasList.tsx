"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useInteractiveIdeas } from "@/data/interactiveIdeas";

export function InteractiveIdeasList() {
  const t = useTranslations("InteractiveIdeas");
  const ideas = useInteractiveIdeas();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredIdeas = ideas.flatMap((category) =>
    category.items.filter(
      (item) =>
        (selectedCategory === "all" ||
          category.category === selectedCategory) &&
        (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">{t("allCategories")}</option>
          {ideas.map((category) => (
            <option key={category.category} value={category.category}>
              {t(`categories.${category.category}`)}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredIdeas.map((idea) => (
          <Card key={idea.id}>
            <CardHeader>
              <CardTitle>{idea.title}</CardTitle>
              <CardDescription>{idea.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{idea.benefit}</p>
            </CardContent>
            <CardContent>
              <Link href={`/website/interactive/ideas/${idea.id}`}>
                <Button>{t("learnMore")}</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredIdeas.length === 0 && (
        <p className="text-center text-muted-foreground">{t("noIdeasFound")}</p>
      )}
    </div>
  );
}
