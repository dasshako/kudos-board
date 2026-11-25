import type { Filters, GifResult, Kudos, Person, Reaction, Stats } from './types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json', ...(init?.headers || {}) } : init?.headers,
  })

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.'
    try {
      const body = (await response.json()) as { error?: string }
      if (body?.error) message = body.error
    } catch {
      /* keep the fallback message */
    }
    throw new Error(message)
  }

  return (await response.json()) as T
}

export function fetchPeople() {
  return request<Person[]>('/api/people')
}

export function fetchKudos(filters: Filters, viewerId: string | null) {
  const params = new URLSearchParams()
  if (filters.badge !== 'all') params.set('badge', filters.badge)
  if (filters.q.trim()) params.set('q', filters.q.trim())
  params.set('sort', filters.sort)
  if (viewerId) params.set('viewer', viewerId)
  return request<Kudos[]>(`/api/kudos?${params.toString()}`)
}

export function fetchStats() {
  return request<Stats>('/api/stats')
}

export type CreateKudosInput = {
  senderId: string
  recipientIds: string[]
  message: string
  badge: string
  theme: string
  textColor: string
  gifUrl: string | null
}

export function searchGifs(query: string) {
  return request<GifResult[]>(`/api/gifs/search?q=${encodeURIComponent(query)}`)
}

export function createKudos(input: CreateKudosInput) {
  return request<{ id: string }>('/api/kudos', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function toggleReaction(kudosId: string, emoji: string, viewerId: string) {
  return request<{ reactions: Reaction[]; reactionTotal: number }>(
    `/api/kudos/${kudosId}/reactions`,
    {
      method: 'POST',
      body: JSON.stringify({ emoji, viewerId }),
    }
  )
}
