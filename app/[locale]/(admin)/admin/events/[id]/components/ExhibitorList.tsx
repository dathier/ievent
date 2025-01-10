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

interface Exhibitor {
  id: number
  name: string
  logo: string
  website: string
  description: string
}

export function ExhibitorList({ eventId }: { eventId: number }) {
  const t = useTranslations('Admin.EventManagement.Exhibitors')
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [newExhibitor, setNewExhibitor] = useState({
    name: '',
    logo: '',
    website: '',
    description: '',
  })

  useEffect(() => {
    fetchExhibitors()
  }, [])

  async function fetchExhibitors() {
    try {
      const response = await axios.get(`/api/admin/events/${eventId}/exhibitors`)
      setExhibitors(response.data)
    } catch (error) {
      console.error('Error fetching exhibitors:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await axios.post(`/api/admin/events/${eventId}/exhibitors`, newExhibitor)
      toast({
        title: t('exhibitorCreated'),
        description: t('exhibitorCreatedDescription'),
      })
      fetchExhibitors()
      setNewExhibitor({
        name: '',
        logo: '',
        website: '',
        description: '',
      })
    } catch (error) {
      console.error('Error creating exhibitor:', error)
      toast({
        title: t('exhibitorCreationError'),
        description: t('exhibitorCreationErrorDescription'),
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">{t('addExhibitor')}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addExhibitor')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder={t('name')}
              value={newExhibitor.name}
              onChange={(e) => setNewExhibitor({ ...newExhibitor, name: e.target.value })}
              required
            />
            <Input
              placeholder={t('logo')}
              value={newExhibitor.logo}
              onChange={(e) => setNewExhibitor({ ...newExhibitor, logo: e.target.value })}
            />
            <Input
              placeholder={t('website')}
              value={newExhibitor.website}
              onChange={(e) => setNewExhibitor({ ...newExhibitor, website: e.target.value })}
            />
            <Textarea
              placeholder={t('description')}
              value={newExhibitor.description}
              onChange={(e) => setNewExhibitor({ ...newExhibitor, description: e.target.value })}
              required
            />
            <Button type="submit">{t('submit')}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('website')}</TableHead>
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exhibitors.map((exhibitor) => (
            <TableRow key={exhibitor.id}>
              <TableCell>{exhibitor.name}</TableCell>
              <TableCell>{exhibitor.website}</TableCell>
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

