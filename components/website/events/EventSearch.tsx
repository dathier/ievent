import { SearchInput } from "../shared/SearchInput"
import { FilterSelect } from "../shared/FilterSelect"
import { useTranslations } from 'next-intl'

interface EventSearchProps {
  onSearch: (query: string) => void;
  onFilterCategory: (category: string) => void;
  onFilterIndustry: (industry: string) => void;
  onFilterBusiness: (business: string) => void;
}

export function EventSearch({ onSearch, onFilterCategory, onFilterIndustry, onFilterBusiness }: EventSearchProps) {
  const t = useTranslations('Events')

  const categoryOptions = [
    { value: "conference", label: t('categoryConference') },
    { value: "workshop", label: t('categoryWorkshop') },
    { value: "seminar", label: t('categorySeminar') },
  ]

  const industryOptions = [
    { value: "technology", label: t('industryTechnology') },
    { value: "healthcare", label: t('industryHealthcare') },
    { value: "finance", label: t('industryFinance') },
  ]

  const businessOptions = [
    { value: "startup", label: t('businessStartup') },
    { value: "enterprise", label: t('businessEnterprise') },
    { value: "nonprofit", label: t('businessNonprofit') },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <SearchInput onSearch={onSearch} />
      <FilterSelect options={categoryOptions} onFilter={onFilterCategory} placeholder={t('filterCategory')} />
      <FilterSelect options={industryOptions} onFilter={onFilterIndustry} placeholder={t('filterIndustry')} />
      <FilterSelect options={businessOptions} onFilter={onFilterBusiness} placeholder={t('filterBusiness')} />
    </div>
  )
}

