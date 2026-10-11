// Serverless function (jalan di server Vercel, token TMDB aman di sini)
// Contoh: /api/movies?type=now_playing | upcoming | top_rated | genres
const ENDPOINTS = {
    now_playing: 'movie/now_playing',
    upcoming: 'movie/upcoming',
    top_rated: 'movie/top_rated',
    genres: 'genre/movie/list',
  }
  
  export default async function handler(req, res) {
    const path = ENDPOINTS[req.query.type] ?? ENDPOINTS.now_playing
    const params = new URLSearchParams({ language: 'en-US', page: '1' })
    if (path.startsWith('movie/')) params.set('region', 'ID') // film yang tayang di Indonesia
  
    try {
      const r = await fetch(`https://api.themoviedb.org/3/${path}?${params}`, {
        headers: { Authorization: `Bearer ${process.env.TMDB_TOKEN}`, accept: 'application/json' },
      })
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
      res.status(r.status).json(await r.json())
    } catch {
      res.status(500).json({ error: 'Failed to reach TMDB' })
    }
  }