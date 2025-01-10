'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import axios from 'axios'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

interface Material {
  id: number
  name: string
  fileUrl: string
}

export function MaterialList({ eventId }: { eventId: number }) {
  const t = useTranslations('Admin.EventManagement.Materials')
  const [materials, setMaterials] = useState<Material[]>([])
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    fileUrl: '',
  })

  useEffect(() => {
    fetchMaterials()
  }, [])

  async function fetchMaterials() {
    try {
      const response = await axios.get(`/api/admin/events/${eventId}/materials`)
      setMaterials(response.data)
    } catch (error) {
      console.error('Error fetching materials:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await axios.post(`/api/admin/events/${eventId}/materials`, newMaterial)
      toast({
        title: t('materialCreated'),
        description: t('materialCreatedDescription'),
      })
      fetchMaterials()
      setNewMaterial({
        name: '',
        fileUrl: '',
      })
    } catch (error) {
      console.error('Error creating material:', error)
      toast({
        title: t('materialCreationError'),
        description: t('materialCreationErrorDescription'),
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">{t('addMaterial')}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addMaterial')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder={t('name')}
              value={newMaterial.name}
              onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
              required
            />
            <Input
              placeholder={t('fileUrl')}
              value={newMaterial.fileUrl}
              onChange={(e) => setNewMaterial({ ...newMaterial, fileUrl: e.target.value })}
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
            <TableHead>{t('fileUrl')}</TableHead>
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>{material.name}</TableCell>
              <TableCell>{material.fileUrl}</TableCell>
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

