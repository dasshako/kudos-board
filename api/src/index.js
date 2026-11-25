import express from 'express'
import {
  BADGES,
  EMOJI,
  TEXT_COLORS,
  THEMES,
  createKudos,
  getKudos,
  getPeople,
  getStats,
  kudosExists,
  personExists,
  toggleReaction,
} from './db.js'
import { searchGifs } from './gifs.js'

const app = express()
const PORT = Number(process.env.PORT || 8000)

app.use(express.json({ limit: '64kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/people', (_req, res) => {
  res.json(getPeople())
})

app.get('/api/kudos', (req, res) => {
  const badge = typeof req.query.badge === 'string' ? req.query.badge : 'all'
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const sort = req.query.sort === 'top' ? 'top' : 'new'
  const viewer = typeof req.query.viewer === 'string' && req.query.viewer ? req.query.viewer : null

  if (badge !== 'all' && !BADGES.includes(badge)) {
    return res.status(400).json({ error: 'Unknown badge filter.' })
  }

  res.json(getKudos({ badge, q, sort, viewer }))
})

app.get('/api/stats', (_req, res) => {
  res.json(getStats())
})

app.get('/api/gifs/search', async (req, res, next) => {
  const q = typeof req.query.q === 'string' ? req.query.q : ''
  try {
    res.json(await searchGifs(q))
  } catch (error) {
    next(error)
  }
})

// A kudos may carry a GIF from the picker: either none at all, or a link served
// by the providers we search (Giphy, Tenor).
function readGifUrl(value) {
  if (value == null || value === '') return { url: null }
  if (typeof value !== 'string' || value.length > 500) return { error: true }

  let parsed
  try {
    parsed = new URL(value.trim())
  } catch {
    return { error: true }
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return { error: true }

  const host = parsed.hostname.toLowerCase()
  const allowed =
    host === 'giphy.com' ||
    host.endsWith('.giphy.com') ||
    host === 'tenor.com' ||
    host.endsWith('.tenor.com')

  return allowed ? { url: parsed.toString() } : { error: true }
}

app.post('/api/kudos', (req, res) => {
  const { senderId, recipientIds, message, badge, theme, textColor, gifUrl } = req.body || {}

  if (!senderId || !personExists(senderId)) {
    return res.status(400).json({ error: 'Pick who you are before sending kudos.' })
  }
  if (!Array.isArray(recipientIds) || recipientIds.length === 0) {
    return res.status(400).json({ error: 'Add at least one teammate to celebrate.' })
  }
  if (recipientIds.some((id) => !personExists(id))) {
    return res.status(400).json({ error: 'One of those teammates could not be found.' })
  }
  if (!BADGES.includes(badge)) {
    return res.status(400).json({ error: 'Choose a badge for this kudos.' })
  }
  if (!THEMES.includes(theme)) {
    return res.status(400).json({ error: 'Choose a card style for this kudos.' })
  }

  const color = textColor == null || textColor === '' ? 'default' : textColor
  if (!TEXT_COLORS.includes(color)) {
    return res.status(400).json({ error: 'Choose a text colour from the palette.' })
  }

  const gif = readGifUrl(gifUrl)
  if (gif.error) {
    return res.status(400).json({ error: 'That GIF could not be added. Pick one from the picker.' })
  }

  const text = typeof message === 'string' ? message.trim() : ''
  if (text.length < 10) {
    return res.status(400).json({ error: 'Tell them a little more — at least 10 characters.' })
  }
  if (text.length > 500) {
    return res.status(400).json({ error: 'Keep it under 500 characters.' })
  }

  const id = createKudos({
    senderId,
    recipientIds: [...new Set(recipientIds)],
    message: text,
    badge,
    theme,
    textColor: color,
    gifUrl: gif.url,
  })

  res.status(201).json({ id })
})

app.post('/api/kudos/:id/reactions', (req, res) => {
  const { id } = req.params
  const { emoji, viewerId } = req.body || {}

  if (!kudosExists(id)) {
    return res.status(404).json({ error: 'That kudos no longer exists.' })
  }
  if (!EMOJI.includes(emoji)) {
    return res.status(400).json({ error: 'Unknown reaction.' })
  }
  if (!viewerId || !personExists(viewerId)) {
    return res.status(400).json({ error: 'Pick who you are before reacting.' })
  }

  const rows = toggleReaction({ kudosId: id, emoji, viewerId })
  const reactions = EMOJI.map((item) => rows.find((row) => row.emoji === item)).filter(Boolean)
  res.json({
    reactions: reactions.map((row) => ({ emoji: row.emoji, count: row.count, mine: Boolean(row.mine) })),
    reactionTotal: reactions.reduce((total, row) => total + row.count, 0),
  })
})

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found.' })
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Something went wrong on our side.' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Kudos API listening on http://0.0.0.0:${PORT}`)
})
