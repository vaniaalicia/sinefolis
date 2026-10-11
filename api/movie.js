// Detail satu film: /api/movie?id=123
// Sekaligus ambil pemeran (credits), trailer (videos), dan rating umur (release_dates)
export default async function handler(req, res) {
    const id = Number(req.query.id)
    if (!id) return res.status(400).json({ error: 'Invalid id' })
  
    try {
      const r = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=credits,videos,release_dates`,
        { headers: { Authorization: `Bearer ${process.env.TMDB_TOKEN}`, accept: 'application/json' } },
      )
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
      res.status(r.status).json(await r.json())
    } catch {
      res.status(500).json({ error: 'Failed to reach TMDB' })
    }
  }