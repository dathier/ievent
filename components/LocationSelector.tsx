import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import cityData from "@/data/city.json";
import { useTranslations } from "next-intl";

interface LocationSelectorProps {
  onLocationChange: (location: string) => void;
}

export function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const t = useTranslations("Venues");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const countries = useMemo(() => cityData.map((country) => country.name), []);

  const regions = useMemo(() => {
    if (selectedCountry) {
      const country = cityData.find((c) => c.name === selectedCountry);
      return country ? country.regions.map((region) => region.name) : [];
    }
    return [];
  }, [selectedCountry]);

  const cities = useMemo(() => {
    if (selectedCountry && selectedRegion) {
      const country = cityData.find((c) => c.name === selectedCountry);
      if (country) {
        const region = country.regions.find((r) => r.name === selectedRegion);
        return region ? region.cities : [];
      }
    }
    return [];
  }, [selectedCountry, selectedRegion]);

  const handleCountryChange = useCallback((value: string) => {
    setSelectedCountry(value);
    setSelectedRegion("");
    setSelectedCity("");
  }, []);

  const handleRegionChange = useCallback((value: string) => {
    setSelectedRegion(value);
    setSelectedCity("");
  }, []);

  useEffect(() => {
    let location = "";
    if (selectedCity) {
      location = `${selectedCity}, ${selectedRegion}, ${selectedCountry}`;
    } else if (selectedRegion) {
      location = `${selectedRegion}, ${selectedCountry}`;
    } else if (selectedCountry) {
      location = selectedCountry;
    }
    onLocationChange(location);
  }, [selectedCountry, selectedRegion, selectedCity, onLocationChange]);

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <Select value={selectedCountry} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("selectCountry")} />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedRegion} onValueChange={handleRegionChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("selectRegion")} />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region} value={region}>
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCity} onValueChange={setSelectedCity}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("selectCity")} />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
