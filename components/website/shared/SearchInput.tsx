import { Input } from "@/components/ui/input"
import { useTranslations } from 'next-intl'

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const t = useTranslations('Shared')

  return (
    <Input
      type="text"
      placeholder={t('searchPlaceholder')}
      onChange={(e) => onSearch(e.target.value)}
      className="max-w-sm"
    />
  )
}

