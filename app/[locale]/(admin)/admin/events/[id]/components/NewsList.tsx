'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import axios from 'axios'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

interface News {
  id: number
  title: string
  content: string
}

export function NewsList({ eventId }: { eventId: number }) {
  const t = useTranslations('Admin.EventManagement.News')
  const [newsList, setNewsList] = useState<News[]>([])
  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
  })

  useEffect(() => {
    fetchNews()
  }, [])

  async function fetchNews() {
    try {
      const response = await axios.get(`/api/admin/events/${eventId}/news`)
      setNewsList(response.data)
    } catch (error) {
      console.error('Error fetching news:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await axios.post(`/api/admin/events/${eventId}/news`, newNews)
      toast({
        title: t('newsCreated'),
        description: t('newsCreatedDescription'),
      })
      fetchNews()
      setNewNews({
        title: '',
        content: '',
      })
    } catch (error) {
      console.error('Error creating news:', error)
      toast({
        title: t('newsCreationError'),
        description: t('newsCreationErrorDescription'),
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">{t('addNews')}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addNews')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder={t('title')}
              value={newNews.title}
              onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
              required
            />
            <Textarea
              placeholder={t('content')}
              value={newNews.content}
              onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
              required
            />
            <Button type="submit">{t('submit')}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('title')}</TableHead>
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newsList.map((news) => (
            <TableRow key={news.id}>
              <TableCell>{news.title}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">{t('edit')}</Button>
                <Button variant="destructive" size="sm">{t('delete')}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

