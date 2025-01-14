import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import cityData from "@/lib/city.json";
import { useTranslations } from "next-intl";

interface LocationSelectorProps {
  onLocationChange: (location: string) => void;
}

export function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const t = useTranslations("Admin.Venues");
  const [countries, setCountries] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    setCountries(cityData.map((country) => country.name));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const country = cityData.find((c) => c.name === selectedCountry);
      if (country) {
        setRegions(country.regions.map((region) => region.name));
      }
    } else {
      setRegions([]);
    }
    setSelectedRegion("");
    setSelectedCity("");
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedRegion) {
      const country = cityData.find((c) => c.name === selectedCountry);
      if (country) {
        const region = country.regions.find((r) => r.name === selectedRegion);
        if (region) {
          setCities(region.cities);
        }
      }
    } else {
      setCities([]);
    }
    setSelectedCity("");
  }, [selectedCountry, selectedRegion]);

  useEffect(() => {
    if (selectedCity) {
      onLocationChange(
        `${selectedCity}, ${selectedRegion}, ${selectedCountry}`
      );
    } else if (selectedRegion) {
      onLocationChange(`${selectedRegion}, ${selectedCountry}`);
    } else if (selectedCountry) {
      onLocationChange(selectedCountry);
    } else {
      onLocationChange("");
    }
  }, [selectedCountry, selectedRegion, selectedCity, onLocationChange]);

  return (
    <div className="flex flex-row items-center justify-center gap-8">
      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
        <SelectTrigger>
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

      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
        <SelectTrigger>
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
        <SelectTrigger>
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
