import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { randomUUID } from 'node:crypto'

const dbPath = process.env.DB_PATH || './data/kudos.db'
mkdirSync(dirname(dbPath), { recursive: true })

export const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS people (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    team TEXT NOT NULL,
    accent TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS kudos (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL REFERENCES people(id),
    message TEXT NOT NULL,
    badge TEXT NOT NULL,
    theme TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS kudos_recipients (
    kudos_id TEXT NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
    person_id TEXT NOT NULL REFERENCES people(id),
    PRIMARY KEY (kudos_id, person_id)
  );

  CREATE TABLE IF NOT EXISTS reactions (
    kudos_id TEXT NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    person_id TEXT NOT NULL REFERENCES people(id),
    PRIMARY KEY (kudos_id, emoji, person_id)
  );
`)

export const BADGES = ['teamwork', 'innovation', 'kindness', 'impact', 'leadership', 'craft']
export const THEMES = ['sunrise', 'ocean', 'orchid', 'forest']
export const EMOJI = ['👏', '🔥', '🚀', '💜', '🙌']

export const PEOPLE = [
  { id: 'maya', name: 'Maya Chen', role: 'Senior Product Designer', team: 'Design', accent: 'amber' },
  { id: 'diego', name: 'Diego Alvarez', role: 'Staff Engineer', team: 'Engineering', accent: 'violet' },
  { id: 'priya', name: 'Priya Raman', role: 'Engineering Manager', team: 'Engineering', accent: 'rose' },
  { id: 'tom', name: 'Tom Okafor', role: 'Frontend Engineer', team: 'Engineering', accent: 'sky' },
  { id: 'lena', name: 'Lena Fischer', role: 'Product Manager', team: 'Product', accent: 'teal' },
  { id: 'sofia', name: 'Sofia Rossi', role: 'Customer Success Lead', team: 'Customer Success', accent: 'fuchsia' },
  { id: 'noah', name: 'Noah Williams', role: 'Data Analyst', team: 'Product', accent: 'lime' },
  { id: 'amara', name: 'Amara Osei', role: 'Brand Designer', team: 'Design', accent: 'orange' },
  { id: 'jonas', name: 'Jonas Berg', role: 'Platform Engineer', team: 'Engineering', accent: 'indigo' },
  { id: 'hana', name: 'Hana Suzuki', role: 'QA Engineer', team: 'Engineering', accent: 'emerald' },
  { id: 'ruben', name: 'Ruben Costa', role: 'Account Executive', team: 'Sales', accent: 'red' },
  { id: 'chloe', name: 'Chloe Dubois', role: 'People Ops Partner', team: 'People', accent: 'pink' },
]

const SEED_KUDOS = [
  {
    sender: 'diego',
    recipients: ['maya'],
    badge: 'craft',
    theme: 'sunrise',
    hoursAgo: 2,
    message:
      'Maya reworked the whole onboarding flow in three days and it finally feels effortless. The small details — the empty states, the copy — are what make it sing.',
  },
  {
    sender: 'lena',
    recipients: ['diego', 'jonas'],
    badge: 'teamwork',
    theme: 'ocean',
    hoursAgo: 7,
    message:
      'You two stayed late to unblock the migration and never once made it anyone else’s problem. Shipping on time is the headline, but the calm you brought is the real story.',
  },
  {
    sender: 'priya',
    recipients: ['hana'],
    badge: 'impact',
    theme: 'orchid',
    hoursAgo: 26,
    message:
      'Hana caught a race condition in checkout that would have cost us a very bad weekend. That bug report was a gift.',
  },
  {
    sender: 'sofia',
    recipients: ['ruben'],
    badge: 'kindness',
    theme: 'forest',
    hoursAgo: 31,
    message:
      'Ruben rewrote the handoff notes for his biggest account before going on leave so nobody would be left guessing. That is what caring about your team looks like.',
  },
  {
    sender: 'noah',
    recipients: ['amara'],
    badge: 'innovation',
    theme: 'sunrise',
    hoursAgo: 52,
    message:
      'The new brand system Amara built is ridiculously good. Our launch deck went from “fine” to “who made this?” in a single afternoon.',
  },
  {
    sender: 'chloe',
    recipients: ['priya', 'lena', 'tom'],
    badge: 'leadership',
    theme: 'ocean',
    hoursAgo: 74,
    message:
      'Thank you for running the roadmap reset so openly. Everyone left that room knowing exactly what we are doing next and why.',
  },
  {
    sender: 'tom',
    recipients: ['noah'],
    badge: 'teamwork',
    theme: 'orchid',
    hoursAgo: 96,
    message:
      'Noah turned a vague “can we look at churn?” into a dashboard the whole company now opens every Monday. Quiet, enormous impact.',
  },
  {
    sender: 'amara',
    recipients: ['sofia'],
    badge: 'kindness',
    theme: 'forest',
    hoursAgo: 120,
    message:
      'Sofia talked a frustrated customer back from the edge with nothing but patience and honesty. They renewed the next morning.',
  },
]

const SEED_REACTIONS = [
  { kudosIndex: 0, emoji: '👏', people: ['priya', 'tom', 'lena', 'chloe', 'noah'] },
  { kudosIndex: 0, emoji: '🔥', people: ['diego', 'hana'] },
  { kudosIndex: 1, emoji: '🚀', people: ['maya', 'amara', 'priya', 'ruben'] },
  { kudosIndex: 1, emoji: '💜', people: ['sofia'] },
  { kudosIndex: 2, emoji: '👏', people: ['diego', 'jonas', 'tom'] },
  { kudosIndex: 2, emoji: '🙌', people: ['lena'] },
  { kudosIndex: 3, emoji: '💜', people: ['chloe', 'priya', 'maya', 'hana', 'tom', 'noah'] },
  { kudosIndex: 4, emoji: '🔥', people: ['lena', 'sofia', 'ruben'] },
  { kudosIndex: 5, emoji: '🙌', people: ['diego', 'maya'] },
  { kudosIndex: 6, emoji: '👏', people: ['lena', 'jonas', 'chloe'] },
  { kudosIndex: 7, emoji: '💜', people: ['amara', 'hana'] },
]

function seed() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM people').get().c
  if (count > 0) return

  const insertPerson = db.prepare(
    'INSERT INTO people (id, name, role, team, accent) VALUES (@id, @name, @role, @team, @accent)'
  )
  const insertKudos = db.prepare(
    'INSERT INTO kudos (id, sender_id, message, badge, theme, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  )
  const insertRecipient = db.prepare(
    'INSERT INTO kudos_recipients (kudos_id, person_id) VALUES (?, ?)'
  )
  const insertReaction = db.prepare(
    'INSERT INTO reactions (kudos_id, emoji, person_id) VALUES (?, ?, ?)'
  )

  db.transaction(() => {
    for (const person of PEOPLE) insertPerson.run(person)

    const ids = SEED_KUDOS.map((kudo) => {
      const id = randomUUID()
      const createdAt = new Date(Date.now() - kudo.hoursAgo * 3600 * 1000).toISOString()
      insertKudos.run(id, kudo.sender, kudo.message, kudo.badge, kudo.theme, createdAt)
      for (const personId of kudo.recipients) insertRecipient.run(id, personId)
      return id
    })

    for (const reaction of SEED_REACTIONS) {
      for (const personId of reaction.people) {
        insertReaction.run(ids[reaction.kudosIndex], reaction.emoji, personId)
      }
    }
  })()
}

seed()

const personById = new Map(PEOPLE.map((person) => [person.id, person]))

function shapePerson(id) {
  const person = personById.get(id) || db.prepare('SELECT * FROM people WHERE id = ?').get(id)
  return person
    ? { id: person.id, name: person.name, role: person.role, team: person.team, accent: person.accent }
    : null
}

export function getPeople() {
  return db.prepare('SELECT * FROM people ORDER BY name').all()
}

export function getKudos({ badge = 'all', q = '', sort = 'new', viewer = null } = {}) {
  const where = []
  const args = { viewer }

  if (badge && badge !== 'all') {
    where.push('k.badge = @badge')
    args.badge = badge
  }
  if (q) {
    where.push(`(
      LOWER(k.message) LIKE @q
      OR LOWER(s.name) LIKE @q
      OR EXISTS (
        SELECT 1 FROM kudos_recipients kr
        JOIN people p ON p.id = kr.person_id
        WHERE kr.kudos_id = k.id AND LOWER(p.name) LIKE @q
      )
    )`)
    args.q = `%${q.toLowerCase()}%`
  }

  const rows = db
    .prepare(
      `SELECT k.*, s.name AS sender_name, s.role AS sender_role,
              s.team AS sender_team, s.accent AS sender_accent
       FROM kudos k
       JOIN people s ON s.id = k.sender_id
       ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
       ORDER BY k.created_at DESC`
    )
    .all(args)

  if (rows.length === 0) return []

  const placeholders = rows.map(() => '?').join(',')
  const ids = rows.map((row) => row.id)

  const recipients = db
    .prepare(
      `SELECT kr.kudos_id, p.* FROM kudos_recipients kr
       JOIN people p ON p.id = kr.person_id
       WHERE kr.kudos_id IN (${placeholders})
       ORDER BY p.name`
    )
    .all(...ids)

  const reactionRows = db
    .prepare(`SELECT kudos_id, emoji, person_id FROM reactions WHERE kudos_id IN (${placeholders})`)
    .all(...ids)

  const recipientsByKudos = new Map()
  for (const row of recipients) {
    if (!recipientsByKudos.has(row.kudos_id)) recipientsByKudos.set(row.kudos_id, [])
    recipientsByKudos.get(row.kudos_id).push({
      id: row.id,
      name: row.name,
      role: row.role,
      team: row.team,
      accent: row.accent,
    })
  }

  const reactionsByKudos = new Map()
  for (const row of reactionRows) {
    if (!reactionsByKudos.has(row.kudos_id)) reactionsByKudos.set(row.kudos_id, [])
    reactionsByKudos.get(row.kudos_id).push(row)
  }

  const shaped = rows.map((row) => {
    const grouped = new Map()
    for (const reaction of reactionsByKudos.get(row.id) || []) {
      if (!grouped.has(reaction.emoji)) grouped.set(reaction.emoji, { emoji: reaction.emoji, count: 0, mine: false })
      const entry = grouped.get(reaction.emoji)
      entry.count += 1
      if (viewer && reaction.person_id === viewer) entry.mine = true
    }

    const reactionList = EMOJI.map((emoji) => grouped.get(emoji)).filter(Boolean)
    const reactionTotal = reactionList.reduce((total, entry) => total + entry.count, 0)

    return {
      id: row.id,
      message: row.message,
      badge: row.badge,
      theme: row.theme,
      createdAt: row.created_at,
      sender: {
        id: row.sender_id,
        name: row.sender_name,
        role: row.sender_role,
        team: row.sender_team,
        accent: row.sender_accent,
      },
      recipients: recipientsByKudos.get(row.id) || [],
      reactions: reactionList,
      reactionTotal,
    }
  })

  if (sort === 'top') {
    shaped.sort((a, b) => b.reactionTotal - a.reactionTotal || b.createdAt.localeCompare(a.createdAt))
  }

  return shaped
}

export function getStats() {
  const totals = {
    kudos: db.prepare('SELECT COUNT(*) AS c FROM kudos').get().c,
    people: db.prepare('SELECT COUNT(*) AS c FROM people').get().c,
    teams: db.prepare('SELECT COUNT(DISTINCT team) AS c FROM people').get().c,
  }

  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
  const week = db.prepare('SELECT COUNT(*) AS c FROM kudos WHERE created_at >= ?').get(since).c

  const leaderboard = db
    .prepare(
      `SELECT p.id, p.name, p.team, p.role, p.accent,
              COUNT(kr.kudos_id) AS received,
              (SELECT COUNT(*) FROM reactions r
                 JOIN kudos_recipients x ON x.kudos_id = r.kudos_id
                WHERE x.person_id = p.id) AS reactions
       FROM people p
       LEFT JOIN kudos_recipients kr ON kr.person_id = p.id
       GROUP BY p.id
       ORDER BY received DESC, reactions DESC, p.name ASC
       LIMIT 6`
    )
    .all()

  const categories = db
    .prepare('SELECT badge, COUNT(*) AS count FROM kudos GROUP BY badge ORDER BY count DESC')
    .all()

  return { totals, week, leaderboard, categories }
}

export function createKudos({ senderId, recipientIds, message, badge, theme }) {
  const id = randomUUID()
  const createdAt = new Date().toISOString()

  db.transaction(() => {
    db.prepare(
      'INSERT INTO kudos (id, sender_id, message, badge, theme, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, senderId, message, badge, theme, createdAt)
    const insertRecipient = db.prepare('INSERT INTO kudos_recipients (kudos_id, person_id) VALUES (?, ?)')
    for (const personId of recipientIds) insertRecipient.run(id, personId)
  })()

  return id
}

export function toggleReaction({ kudosId, emoji, viewerId }) {
  const existing = db
    .prepare('SELECT 1 FROM reactions WHERE kudos_id = ? AND emoji = ? AND person_id = ?')
    .get(kudosId, emoji, viewerId)

  if (existing) {
    db.prepare('DELETE FROM reactions WHERE kudos_id = ? AND emoji = ? AND person_id = ?').run(
      kudosId,
      emoji,
      viewerId
    )
  } else {
    db.prepare('INSERT INTO reactions (kudos_id, emoji, person_id) VALUES (?, ?, ?)').run(
      kudosId,
      emoji,
      viewerId
    )
  }

  return db
    .prepare(
      `SELECT emoji, COUNT(*) AS count,
              SUM(CASE WHEN person_id = ? THEN 1 ELSE 0 END) AS mine
       FROM reactions WHERE kudos_id = ? GROUP BY emoji`
    )
    .all(viewerId, kudosId)
}

export function personExists(id) {
  return Boolean(db.prepare('SELECT 1 FROM people WHERE id = ?').get(id))
}

export function kudosExists(id) {
  return Boolean(db.prepare('SELECT 1 FROM kudos WHERE id = ?').get(id))
}

export { shapePerson }
