import { useTranslations } from 'next-intl'

export function AboutContent() {
  const t = useTranslations('About')

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-2">{t('missionTitle')}</h2>
        <p>{t('missionContent')}</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-2">{t('teamTitle')}</h2>
        <p>{t('teamContent')}</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-2">{t('contactTitle')}</h2>
        <p>{t('contactContent')}</p>
      </section>
    </div>
  )
}

