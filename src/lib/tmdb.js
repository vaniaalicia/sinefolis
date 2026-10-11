// Mengambil data dari /api (serverless function) lalu mengubah bentuknya
// supaya sama dengan bentuk data yang dipakai komponen kita.

const IMG = 'https://image.tmdb.org/t/p/'
const today = () => new Date().toISOString().slice(0, 10)

// warna glow per film (dulu dari data dummy, sekarang dihitung dari id)
const hueFromId = (id) => (Number(id) * 47) % 360

const fmtDate = (s) => (s ? new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '')

// ---------- cache: data yang sudah pernah diambil disimpan, jadi kunjungan berikutnya instan ----------
const HOME_TTL = 30 * 60 * 1000 // 30 menit
const DETAIL_TTL = 60 * 60 * 1000 // 1 jam
const mem = new Map()
const inflight = new Map()

function readCache(key, ttl) {
  const hit = mem.get(key)
  if (hit && Date.now() - hit.t < ttl) return hit.v
  try {
    const raw = sessionStorage.getItem('tmdb:' + key)
    if (raw) {
      const e = JSON.parse(raw)
      if (Date.now() - e.t < ttl) {
        mem.set(key, e)
        return e.v
      }
    }
  } catch {
    /* sessionStorage bisa diblokir, abaikan */
  }
  return null
}

function writeCache(key, v) {
  const e = { t: Date.now(), v }
  mem.set(key, e)
  try {
    sessionStorage.setItem('tmdb:' + key, JSON.stringify(e))
  } catch {
    /* abaikan */
  }
}

// ambil dari cache kalau ada; kalau sedang diambil, tunggu request yang sama (tidak dobel)
function cached(key, ttl, load) {
  const hit = readCache(key, ttl)
  if (hit) return Promise.resolve(hit)
  if (inflight.has(key)) return inflight.get(key)
  const p = load()
    .then((v) => {
      writeCache(key, v)
      return v
    })
    .finally(() => inflight.delete(key))
  inflight.set(key, p)
  return p
}

async function getJSON(url) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`TMDB request failed (${r.status})`)
  return r.json()
}

let genreCache = null
async function getGenres() {
  if (genreCache) return genreCache
  const d = await getJSON('/api/movies?type=genres')
  genreCache = Object.fromEntries((d.genres ?? []).map((g) => [g.id, g.name]))
  return genreCache
}

// film dari daftar (now playing, upcoming, top rated)
function mapListMovie(m, genres) {
  const names = (m.genre_ids ?? []).map((id) => genres[id]).filter(Boolean)
  return {
    id: m.id,
    title: m.title,
    genres: names.slice(0, 2),
    genre: names[0] ?? 'Movie',
    year: m.release_date?.slice(0, 4) ?? '',
    duration: '', // durasi hanya ada di detail film
    age: '',
    rating: m.vote_average ? m.vote_average.toFixed(1) : '',
    overview: m.overview,
    poster: m.poster_path ? `${IMG}w342${m.poster_path}` : null,
    backdrop: m.backdrop_path ? `${IMG}w1280${m.backdrop_path}` : null,
    hue: hueFromId(m.id),
    date: fmtDate(m.release_date),
    releaseDate: m.release_date,
  }
}

// semua data untuk Home sekaligus
async function loadHome() {
  const [genres, now, top, upcoming] = await Promise.all([
    getGenres(),
    getJSON('/api/movies?type=now_playing'),
    getJSON('/api/movies?type=top_rated'),
    getJSON('/api/movies?type=upcoming'),
  ])

  const nowList = (now.results ?? []).map((m) => mapListMovie(m, genres))
  const taglines = ['Featured this week', 'Most watched', 'Just released']

  const withBackdrop = nowList.filter((m) => m.backdrop)

  return {
    featured: (withBackdrop.length ? withBackdrop : nowList).slice(0, 3).map((m, i) => ({ ...m, tagline: taglines[i] })),
    nowShowing: nowList.slice(0, 12),
    topRated: (top.results ?? []).slice(0, 12).map((m) => mapListMovie(m, genres)),
    // coming soon = tanggal rilis setelah hari ini
    comingSoon: (upcoming.results ?? [])
      .filter((m) => m.release_date > today())
      .slice(0, 6)
      .map((m) => ({ ...mapListMovie(m, genres), comingSoon: true })),
  }
}

export const getHomeMovies = () => cached('home', HOME_TTL, loadHome)
export const peekHome = () => readCache('home', HOME_TTL)

// rating umur: utamakan versi Indonesia, kalau tidak ada pakai versi US
function certification(releaseDates) {
  const pick = (iso) =>
    releaseDates?.results
      ?.find((r) => r.iso_3166_1 === iso)
      ?.release_dates?.map((d) => d.certification)
      .find(Boolean)
  return pick('ID') || pick('US') || ''
}

// detail satu film
async function loadDetail(id) {
  const d = await getJSON(`/api/movie?id=${id}`)
  const trailer = d.videos?.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer')
  const director = d.credits?.crew?.find((c) => c.job === 'Director')?.name ?? '—'

  return {
    movie: {
      id: d.id,
      title: d.title,
      genres: (d.genres ?? []).map((g) => g.name).slice(0, 3),
      genre: d.genres?.[0]?.name ?? 'Movie',
      year: d.release_date?.slice(0, 4) ?? '',
      duration: d.runtime ? `${Math.floor(d.runtime / 60)}h ${d.runtime % 60}m` : '',
      age: certification(d.release_dates),
      rating: d.vote_average ? d.vote_average.toFixed(1) : '',
      overview: d.overview,
      poster: d.poster_path ? `${IMG}w342${d.poster_path}` : null, // sama dengan daftar, jadi tidak dimuat ulang
      backdrop: d.backdrop_path ? `${IMG}w1280${d.backdrop_path}` : null,
      hue: hueFromId(d.id),
      date: fmtDate(d.release_date),
      comingSoon: !!d.release_date && d.release_date > today(),
      trailerKey: trailer?.key ?? null,
    },
    credits: {
      director,
      cast: (d.credits?.cast ?? []).slice(0, 5).map((c) => c.name),
    },
  }
}

export const getMovieDetail = (id) => cached(`movie:${id}`, DETAIL_TTL, () => loadDetail(id))
export const peekDetail = (id) => readCache(`movie:${id}`, DETAIL_TTL)

// film yang sudah ada di daftar Home → bisa langsung ditampilkan tanpa menunggu
export function peekListMovie(id) {
  const h = peekHome()
  if (!h) return null
  return [...h.featured, ...h.nowShowing, ...h.topRated, ...h.comingSoon].find((m) => String(m.id) === String(id)) ?? null
}

// dipanggil saat kursor di atas kartu film: detail diambil duluan, jadi saat diklik sudah siap
export const prefetchMovie = (id) => getMovieDetail(id).catch(() => {})