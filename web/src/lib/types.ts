export type Person = {
  id: string
  name: string
  role: string
  team: string
  accent: string
}

export type Reaction = {
  emoji: string
  count: number
  mine: boolean
}

export type Kudos = {
  id: string
  message: string
  badge: string
  theme: string
  textColor: string
  gifUrl: string | null
  createdAt: string
  sender: Person
  recipients: Person[]
  reactions: Reaction[]
  reactionTotal: number
}

export type LeaderboardEntry = Person & {
  received: number
  reactions: number
}

export type Stats = {
  totals: { kudos: number; people: number; teams: number }
  week: number
  leaderboard: LeaderboardEntry[]
  categories: { badge: string; count: number }[]
}

export type GifResult = {
  id: string
  title: string
  url: string
}

export type Sort = 'new' | 'top'

export type Filters = {
  badge: string
  q: string
  sort: Sort
}
