import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface UseProjectLikesReturn {
  likesCount: number
  isLiked: boolean
  toggling: boolean
  toggleLike: () => Promise<void>
}

export function useProjectLikes(projectId: string, initialLikesCount: number): UseProjectLikesReturn {
  const { user } = useAuth()
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLiked, setIsLiked] = useState(false)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    if (!user) {
      setIsLiked(false)
      return
    }

    supabase
      .from('project_likes')
      .select('user_id')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setIsLiked(!!data)
      })
  }, [projectId, user])

  async function toggleLike() {
    if (!user || toggling) return

    setToggling(true)

    try {
      if (isLiked) {
        const { error } = await supabase
          .from('project_likes')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', user.id)

        if (!error) {
          setIsLiked(false)
          setLikesCount((prev) => Math.max(0, prev - 1))
        }
      } else {
        const { error } = await supabase
          .from('project_likes')
          .insert({ project_id: projectId, user_id: user.id })

        if (!error) {
          setIsLiked(true)
          setLikesCount((prev) => prev + 1)
        }
      }
    } finally {
      setToggling(false)
    }
  }

  return { likesCount, isLiked, toggling, toggleLike }
}