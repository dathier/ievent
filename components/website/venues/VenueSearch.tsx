import React, { useCallback } from "react";
import { SearchInput } from "../shared/SearchInput";
import { FilterSelect } from "../shared/FilterSelect";
import { useTranslations } from "next-intl";
import { LocationSelector } from "@/components/LocationSelector";

interface VenueSearchProps {
  onSearch: (query: string) => void;
  onFilterCategory: (category: string) => void;
  onFilterLocation: (location: string) => void;
}

export function VenueSearch({
  onSearch,
  onFilterCategory,
  onFilterLocation,
}: VenueSearchProps) {
  const t = useTranslations("Venues");

  const categoryOptions = [
    { value: "conference", label: t("categoryConference") },
    { value: "exhibition", label: t("categoryExhibition") },
    { value: "banquet", label: t("categoryBanquet") },
  ];

  const handleLocationChange = useCallback(
    (location: string) => {
      onFilterLocation(location);
    },
    [onFilterLocation]
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <SearchInput onSearch={onSearch} />
      <FilterSelect
        options={categoryOptions}
        onFilter={onFilterCategory}
        placeholder={t("filterCategory")}
      />
      <LocationSelector onLocationChange={handleLocationChange} />
    </div>
  );
}
