import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventSearchProps {
  onSearch: (query: string) => void;
  onFilterCategory: (category: string) => void;
  onFilterIndustry: (industry: string) => void;
  onFilterBusiness: (business: string) => void;
}

export function EventSearch({
  onSearch,
  onFilterCategory,
  onFilterIndustry,
  onFilterBusiness,
}: EventSearchProps) {
  const t = useTranslations("Events.search");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>{t("searchButton")}</Button>
      </div>
      <div className="flex gap-2">
        <Select onValueChange={onFilterCategory}>
          <SelectTrigger>
            <SelectValue placeholder={t("categoryPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="conference">
              {t("categories.conference")}
            </SelectItem>
            <SelectItem value="workshop">{t("categories.workshop")}</SelectItem>
            <SelectItem value="seminar">{t("categories.seminar")}</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={onFilterIndustry}>
          <SelectTrigger>
            <SelectValue placeholder={t("industryPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">
              {t("industries.technology")}
            </SelectItem>
            <SelectItem value="healthcare">
              {t("industries.healthcare")}
            </SelectItem>
            <SelectItem value="finance">{t("industries.finance")}</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={onFilterBusiness}>
          <SelectTrigger>
            <SelectValue placeholder={t("businessPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="b2b">{t("businessTypes.b2b")}</SelectItem>
            <SelectItem value="b2c">{t("businessTypes.b2c")}</SelectItem>
            <SelectItem value="b2g">{t("businessTypes.b2g")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
