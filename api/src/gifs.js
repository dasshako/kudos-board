// GIF search for the kudos composer.
//
// Search runs through Giphy when GIPHY_API_KEY is configured, so the credential
// stays on the server and never reaches the browser. Without a key the picker
// still works: it filters a small curated set of celebration GIFs instead.

const GIPHY_KEY = process.env.GIPHY_API_KEY
const GIPHY_BASE = 'https://api.giphy.com/v1/gifs'
const LIMIT = 18

const CURATED = [
  { id: '3o7TKSjRrfIPjeiVyM', title: 'Wow', tags: ['wow', 'amazing', 'brilliant', 'impressed'] },
  { id: 'l0MYt5jPR6QX5pnqM', title: 'Dancing duo', tags: ['dance', 'party', 'celebrate', 'win'] },
  { id: '26BRv0ThflsHCqDrG', title: 'Love it', tags: ['love', 'heart', 'kindness', 'thanks'] },
  { id: '3o7abKhOpu0NwenH3O', title: 'Big laugh', tags: ['laugh', 'funny', 'happy', 'fun'] },
  { id: '3oz8xAFtqoOUUrsh7W', title: 'Yeah!', tags: ['yeah', 'celebrate', 'excited', 'shipped'] },
  { id: 'l0HlHFRbmaZtBRhXG', title: 'Nerd zone', tags: ['nerd', 'smart', 'craft', 'engineer'] },
]

function curatedResults(query) {
  const needle = query.trim().toLowerCase()
  const items = needle
    ? CURATED.filter((gif) => `${gif.title} ${gif.tags.join(' ')}`.toLowerCase().includes(needle))
    : CURATED
  return items.map((gif) => ({
    id: gif.id,
    title: gif.title,
    url: `https://media.giphy.com/media/${gif.id}/giphy.gif`,
  }))
}

async function giphyResults(query) {
  const params = new URLSearchParams({
    api_key: GIPHY_KEY,
    limit: String(LIMIT),
    rating: 'pg-13',
  })
  if (query) params.set('q', query)

  const response = await fetch(`${GIPHY_BASE}/${query ? 'search' : 'trending'}?${params}`)
  if (!response.ok) throw new Error(`Giphy responded with ${response.status}`)

  const body = await response.json()
  return (body.data || [])
    .map((gif) => {
      const images = gif.images || {}
      const url = images.downsampled?.url || images.fixed_height?.url || images.original?.url
      return url ? { id: gif.id, title: gif.title || 'GIF', url } : null
    })
    .filter(Boolean)
}

export async function searchGifs(query = '') {
  const text = query.trim().slice(0, 80)
  if (!GIPHY_KEY) return curatedResults(text)

  try {
    return await giphyResults(text)
  } catch (error) {
    console.warn(`GIF search failed (${error.message}); serving curated GIFs.`)
    return curatedResults(text)
  }
}
