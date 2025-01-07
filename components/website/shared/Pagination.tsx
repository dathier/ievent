import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations('Shared')

  return (
    <div className="flex justify-center space-x-2 mt-4">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {t('previous')}
      </Button>
      <span className="py-2 px-3 bg-gray-100 rounded">
        {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {t('next')}
      </Button>
    </div>
  )
}

