import { useEffect, useState } from 'react'
import { getHomeMovies, getMovieDetail, peekDetail, peekHome, peekListMovie } from '../lib/tmdb'
import * as dummy from '../data/dummy'

const EMPTY_HOME = { featured: [], nowShowing: [], topRated: [], comingSoon: [] }

// Data Home.
// - Sudah pernah dimuat → langsung tampil dari cache (instan).
// - Belum → tampil kerangka (skeleton) sebentar, lalu data asli.
// - TMDB gagal → pakai data dummy supaya website tetap jalan.
export function useHomeMovies() {
  const [data, setData] = useState(() => {
    const c = peekHome()
    return c ? { ...c, loading: false } : { ...EMPTY_HOME, loading: true }
  })

  useEffect(() => {
    if (!data.loading) return
    let alive = true
    getHomeMovies()
      .then((d) => alive && setData({ ...d, loading: false }))
      .catch((err) => {
        console.warn('TMDB tidak bisa diakses, pakai data dummy:', err.message)
        if (alive) {
          setData({
            featured: dummy.featured,
            nowShowing: dummy.nowShowing,
            topRated: dummy.topRated,
            comingSoon: dummy.comingSoon,
            loading: false,
          })
        }
      })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return data
}

// Detail film.
// - Detail lengkap sudah di cache → instan.
// - Film ada di daftar Home → halaman langsung tampil (judul, poster, sinopsis),
//   durasi/pemeran/trailer menyusul beberapa saat kemudian.
// - Selain itu → loading singkat.
function initialDetail(id) {
  const full = peekDetail(id)
  if (full) return { loading: false, ...full }
  const fromList = peekListMovie(id)
  if (fromList) return { loading: false, partial: true, movie: fromList, credits: { director: '—', cast: [] } }
  return { loading: true, movie: null, credits: null }
}

export function useMovieDetail(id) {
  const [state, setState] = useState(() => initialDetail(id))

  useEffect(() => {
    let alive = true
    setState(initialDetail(id))
    if (peekDetail(id)) return
    getMovieDetail(id)
      .then((d) => alive && setState({ loading: false, ...d }))
      .catch(() => {
        if (!alive) return
        setState((s) => (s.movie ? { ...s, partial: false } : { loading: false, movie: dummy.getMovie(id), credits: dummy.credits }))
      })
    return () => {
      alive = false
    }
  }, [id])

  return state
}