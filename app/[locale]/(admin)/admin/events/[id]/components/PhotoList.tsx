'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import axios from 'axios'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

interface Photo {
  id: number
  photoUrl: string
}

export function PhotoList({ eventId }: { eventId: number }) {
  const t = useTranslations('Admin.EventManagement.Photos')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [newPhoto, setNewPhoto] = useState({
    photoUrl: '',
  })

  useEffect(() => {
    fetchPhotos()
  }, [])

  async function fetchPhotos() {
    try {
      const response = await axios.get(`/api/admin/events/${eventId}/photos`)
      setPhotos(response.data)
    } catch (error) {
      console.error('Error fetching photos:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await axios.post(`/api/admin/events/${eventId}/photos`, newPhoto)
      toast({
        title: t('photoCreated'),
        description: t('photoCreatedDescription'),
      })
      fetchPhotos()
      setNewPhoto({
        photoUrl: '',
      })
    } catch (error) {
      console.error('Error creating photo:', error)
      toast({
        title: t('photoCreationError'),
        description: t('photoCreationErrorDescription'),
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">{t('addPhoto')}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addPhoto')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder={t('photoUrl')}
              value={newPhoto.photoUrl}
              onChange={(e) => setNewPhoto({ ...newPhoto, photoUrl: e.target.value })}
              required
            />
            <Button type="submit">{t('submit')}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative">
            <img src={photo.photoUrl} alt="Event photo" className="w-full h-48 object-cover rounded-md" />
            <Button variant="destructive" size="sm" className="absolute top-2 right-2">{t('delete')}</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

