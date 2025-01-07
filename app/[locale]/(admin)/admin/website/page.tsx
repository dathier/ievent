'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

export default function WebsiteManagement() {
  const t = useTranslations('Admin.Website');
  const [websiteContent, setWebsiteContent] = useState({
    hero: { title: '', description: '' },
    featuredEvents: []
  });

  useEffect(() => {
    fetchWebsiteContent();
  }, []);

  async function fetchWebsiteContent() {
    const response = await fetch('/api/admin/website');
    const data = await response.json();
    setWebsiteContent(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(websiteContent)
      });
      if (response.ok) {
        toast({
          title: t('updateSuccess'),
          description: t('updateSuccessDescription'),
        });
      } else {
        throw new Error('Failed to update website content');
      }
    } catch (error) {
      toast({
        title: t('updateError'),
        description: t('updateErrorDescription'),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">{t('heroSection')}</h2>
          <Input
            type="text"
            value={websiteContent.hero.title}
            onChange={(e) => setWebsiteContent({...websiteContent, hero: {...websiteContent.hero, title: e.target.value}})}
            placeholder={t('heroTitle')}
            className="mb-2"
          />
          <Textarea
            value={websiteContent.hero.description}
            onChange={(e) => setWebsiteContent({...websiteContent, hero: {...websiteContent.hero, description: e.target.value}})}
            placeholder={t('heroDescription')}
          />
        </div>
        <Button type="submit">{t('saveChanges')}</Button>
      </form>
    </div>
  );
}

