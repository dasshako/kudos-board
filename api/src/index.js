import express from 'express'
import {
  BADGES,
  EMOJI,
  THEMES,
  createKudos,
  getKudos,
  getPeople,
  getStats,
  kudosExists,
  personExists,
  toggleReaction,
} from './db.js'

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

app.post('/api/kudos', (req, res) => {
  const { senderId, recipientIds, message, badge, theme } = req.body || {}

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
