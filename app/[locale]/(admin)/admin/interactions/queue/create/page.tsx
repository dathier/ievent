"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateQueuePage() {
  const t = useTranslations("Admin.Interactions.Queue");
  const router = useRouter();
  const [people, setPeople] = useState(2);
  const [queueType, setQueueType] = useState("普通餐");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/interactive/queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ people, queueType }),
    });
    if (response.ok) {
      router.push("/admin/interactions/queue/list");
    } else {
      // Handle error
      console.error("Failed to create queue item");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("create.title")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="people"
            className="block text-sm font-medium text-gray-700"
          >
            {t("create.people")}
          </label>
          <Input
            type="number"
            id="people"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            min={1}
            required
          />
        </div>
        <div>
          <label
            htmlFor="queueType"
            className="block text-sm font-medium text-gray-700"
          >
            {t("create.type")}
          </label>
          <Select onValueChange={setQueueType} value={queueType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("create.selectType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="普通餐">{t("create.normalMeal")}</SelectItem>
              <SelectItem value="自助餐">{t("create.buffet")}</SelectItem>
              <SelectItem value="包间">{t("create.privateRoom")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">{t("create.submit")}</Button>
      </form>
    </div>
  );
}
