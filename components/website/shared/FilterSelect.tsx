import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterSelectProps {
  options: { value: string; label: string }[];
  onFilter: (value: string) => void;
  placeholder: string;
}

export function FilterSelect({ options, onFilter, placeholder }: FilterSelectProps) {
  return (
    <Select onValueChange={onFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

