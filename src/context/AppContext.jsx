import { createContext, useContext, useEffect, useState } from 'react'
import { featured, reviews as seedReviews } from '../data/dummy'

// "Otak" aplikasi: menyimpan akun, watchlist, riwayat tiket, dan review.
// Disimpan di localStorage supaya tidak hilang saat halaman di-refresh.
// (Ini simulasi. Untuk aplikasi sungguhan, data ini disimpan di server/database.)

const AppContext = createContext(null)

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* localStorage bisa diblokir (mode private), aplikasi tetap jalan */
  }
}

// contoh tiket lama supaya halaman "My tickets" tidak kosong
const seedBookings = [
  {
    bookingCode: 'SNF-K2P9QX',
    movie: { id: featured[1].id, title: featured[1].title, hue: featured[1].hue, poster: null },
    cinema: 'Mall of Indonesia',
    hall: 'Dolby Atmos',
    date: 'Sat, 26 Sep',
    time: '18:40',
    seats: ['F7', 'F8'],
    grandTotal: 138000,
    past: true,
    reviewed: false,
  },
]

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => load('snf-user', null))
  const [watchlist, setWatchlist] = useState(() => load('snf-watchlist', []))
  const [bookings, setBookings] = useState(() => load('snf-bookings', seedBookings))
  const [reviews, setReviews] = useState(() => load('snf-reviews', seedReviews))

  useEffect(() => save('snf-user', user), [user])
  useEffect(() => save('snf-watchlist', watchlist), [watchlist])
  useEffect(() => save('snf-bookings', bookings), [bookings])
  useEffect(() => save('snf-reviews', reviews), [reviews])

  const value = {
    user,
    signIn: (email, name) => setUser({ email, name: name || email.split('@')[0] }),
    signOut: () => setUser(null),

    watchlist,
    isSaved: (id) => watchlist.some((m) => String(m.id) === String(id)),
    toggleWatch: (movie) =>
      setWatchlist((list) =>
        list.some((m) => String(m.id) === String(movie.id))
          ? list.filter((m) => String(m.id) !== String(movie.id))
          : [{ id: movie.id, title: movie.title, hue: movie.hue, poster: movie.poster ?? null, genre: movie.genre ?? movie.genres?.[0] }, ...list],
      ),

    bookings,
    addBooking: (b) =>
      setBookings((list) => (list.some((x) => x.bookingCode === b.bookingCode) ? list : [{ ...b, past: false, reviewed: false }, ...list])),
    markReviewed: (code) => setBookings((list) => list.map((b) => (b.bookingCode === code ? { ...b, reviewed: true } : b))),

    reviews,
    addReview: (r) => setReviews((list) => [{ id: Date.now(), date: 'Just now', ...r }, ...list]),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
