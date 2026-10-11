import { useEffect, useState } from 'react'
import { getHomeMovies, getMovieDetail } from '../lib/tmdb'
import * as dummy from '../data/dummy'

// Data Home: mulai dari data dummy, lalu diganti data TMDB begitu selesai dimuat.
// Kalau TMDB gagal (misal belum jalan pakai `vercel dev`), website tetap tampil pakai dummy.
export function useHomeMovies() {
  const [data, setData] = useState({
    featured: dummy.featured,
    nowShowing: dummy.nowShowing,
    topRated: dummy.topRated,
    comingSoon: dummy.comingSoon,
    source: 'dummy',
  })

  useEffect(() => {
    let alive = true
    getHomeMovies()
      .then((d) => {
        if (alive && d.nowShowing.length) setData({ ...d, source: 'tmdb' })
      })
      .catch((err) => console.warn('TMDB tidak bisa diakses, pakai data dummy:', err.message))
    return () => {
      alive = false
    }
  }, [])

  return data
}

// Detail film berdasarkan id. Kalau TMDB gagal, pakai data dummy.
export function useMovieDetail(id) {
  const [state, setState] = useState({ loading: true, movie: null, credits: null })

  useEffect(() => {
    let alive = true
    setState({ loading: true, movie: null, credits: null })
    getMovieDetail(id)
      .then((d) => alive && setState({ loading: false, ...d }))
      .catch(() => alive && setState({ loading: false, movie: dummy.getMovie(id), credits: dummy.credits }))
    return () => {
      alive = false
    }
  }, [id])

  return state
}