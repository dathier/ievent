'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import axios from 'axios'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

interface Video {
  id: number
  name: string
  videoUrl: string
}

export function VideoList({ eventId }: { eventId: number }) {
  const t = useTranslations('Admin.EventManagement.Videos')
  const [videos, setVideos] = useState<Video[]>([])
  const [newVideo, setNewVideo] = useState({
    name: '',
    videoUrl: '',
  })

  useEffect(() => {
    fetchVideos()
  }, [])

  async function fetchVideos() {
    try {
      const response = await axios.get(`/api/admin/events/${eventId}/videos`)
      setVideos(response.data)
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await axios.post(`/api/admin/events/${eventId}/videos`, newVideo)
      toast({
        title: t('videoCreated'),
        description: t('videoCreatedDescription'),
      })
      fetchVideos()
      setNewVideo({
        name: '',
        videoUrl: '',
      })
    } catch (error) {
      console.error('Error creating video:', error)
      toast({
        title: t('videoCreationError'),
        description: t('videoCreationErrorDescription'),
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">{t('addVideo')}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addVideo')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder={t('name')}
              value={newVideo.name}
              onChange={(e) => setNewVideo({ ...newVideo, name: e.target.value })}
              required
            />
            <Input
              placeholder={t('videoUrl')}
              value={newVideo.videoUrl}
              onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
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
            <TableHead>{t('videoUrl')}</TableHead>
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => (
            <TableRow key={video.id}>
              <TableCell>{video.name}</TableCell>
              <TableCell>{video.videoUrl}</TableCell>
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

