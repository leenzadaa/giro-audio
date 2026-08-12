import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface UploadResult {
  url: string
  path: string
}

export function useUploadImage() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(file: File, bucket: string = 'project-images'): Promise<UploadResult | null> {
    setUploading(true)
    setError(null)

    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (uploadError) {
        setError(uploadError.message)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      return { url: publicUrl, path }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao fazer upload')
      return null
    } finally {
      setUploading(false)
    }
  }

  async function uploadMultiple(files: File[], bucket: string = 'project-images'): Promise<string[]> {
    const urls: string[] = []
    for (const file of files) {
      const result = await upload(file, bucket)
      if (result) urls.push(result.url)
    }
    return urls
  }

  return { upload, uploadMultiple, uploading, error }
}