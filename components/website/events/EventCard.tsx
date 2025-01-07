import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'

interface EventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    location: string;
  };
}

export function EventCard({ event }: EventCardProps) {
  const t = useTranslations('Events')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{event.date}</p>
        <p>{event.location}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">{t('learnMore')}</Button>
      </CardFooter>
    </Card>
  )
}

