import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Stepper from '../components/Stepper'
import PosterArt from '../components/PosterArt'
import { getMovie, rupiah } from '../data/dummy'
import { useApp } from '../context/AppContext'

const ease = [0.22, 1, 0.36, 1]
const ROWS = 'ABCDEFGHIJ'.split('')
const BLOCKS = [[1, 3], [4, 11], [12, 14]] // kiri, tengah, kanan (ada lorong di antaranya)
const MAX_SEATS = 8

// Kursi terisi dibuat "acak tapi tetap" berdasarkan film + jam,
// jadi tiap jadwal punya denah berbeda tapi tidak berubah saat di-refresh.
function takenSeats(seed) {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const taken = new Set()
  ROWS.forEach((r) => {
    for (let n = 1; n <= 14; n++) {
      h = (h * 1103515245 + 12345) >>> 0
      if (h % 100 < 28) taken.add(`${r}${n}`)
    }
  })
  return taken
}

export default function Seats() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()

  // kalau halaman dibuka langsung (tanpa lewat detail film), pakai data default
  const movie = state?.movie ?? getMovie(id)
  const booking = {
    cinema: state?.cinema ?? 'Plaza Indonesia',
    hall: state?.hall ?? 'IMAX',
    date: state?.date ?? 'Today',
    time: state?.time ?? '20:30',
    price: state?.price ?? 100000,
  }

  // kursi yang sudah kamu pesan sebelumnya untuk jadwal yang sama juga dianggap terisi
  const { bookings } = useApp()
  const taken = useMemo(() => {
    const set = takenSeats(`${movie.id}-${booking.cinema}-${booking.time}`)
    bookings
      .filter(
        (x) =>
          !x.past &&
          String(x.movie.id) === String(movie.id) &&
          x.cinema === booking.cinema &&
          x.hall === booking.hall &&
          x.date === booking.date &&
          x.time === booking.time,
      )
      .forEach((x) => x.seats.forEach((seat) => set.add(seat)))
    return set
  }, [movie.id, booking.cinema, booking.hall, booking.date, booking.time, bookings])
  const [selected, setSelected] = useState([])
  const [warning, setWarning] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // sembunyikan peringatan setelah 2.5 detik
  useEffect(() => {
    if (!warning) return
    const t = setTimeout(() => setWarning(false), 2500)
    return () => clearTimeout(t)
  }, [warning])

  function toggle(seat) {
    if (taken.has(seat)) return
    if (selected.includes(seat)) {
      setSelected(selected.filter((s) => s !== seat))
    } else if (selected.length >= MAX_SEATS) {
      setWarning(true)
    } else {
      setSelected([...selected, seat])
    }
  }

  const sorted = [...selected].sort((a, b) => a[0].localeCompare(b[0]) || Number(a.slice(1)) - Number(b.slice(1)))
  const total = selected.length * booking.price

  function goToPayment() {
    navigate('/payment', { state: { movie, ...booking, seats: sorted, total } })
  }

  return (
    <main className="relative overflow-x-clip pb-44 pt-28">
      <div className="pointer-events-none absolute -left-40 top-40 h-[460px] w-[460px] animate-aurora rounded-full bg-hot/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-[600px] h-[460px] w-[460px] animate-aurora rounded-full bg-violet/20 blur-[120px] [animation-delay:-8s]" />

      <div className="relative mx-auto flex max-w-[1080px] flex-col gap-12 px-6 md:px-12">
        <Stepper current={1} />

        {/* judul + ringkasan film */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div className="flex flex-col gap-3">
            <Link to={`/movie/${movie.id}`} className="self-start text-[13px] font-semibold text-white/50 transition-colors hover:text-white">
              ← Back to showtimes
            </Link>
            <h1 className="font-display text-3xl font-semibold uppercase leading-none tracking-tight md:text-[40px]">
              Pick your <span className="text-gradient">seats</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 pr-5 backdrop-blur-md">
            <div className="h-16 w-11 shrink-0 overflow-hidden rounded-lg">
              <PosterArt src={movie.poster} title="" hue={movie.hue} />
            </div>
            <div>
              <p className="font-semibold">{movie.title}</p>
              <p className="text-sm text-white/55">
                {booking.cinema} {booking.hall}
              </p>
              <p className="text-sm text-white/55">
                {booking.date} · {booking.time}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ================= DENAH KURSI ================= */}
        <motion.section
          aria-label="Seat map"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] px-4 pb-10 pt-12 backdrop-blur-md md:px-10"
        >
          {/* layar bioskop yang bercahaya */}
          <div className="relative mx-auto mb-14 max-w-[620px]">
            <svg viewBox="0 0 600 60" className="w-full" aria-hidden>
              <defs>
                <linearGradient id="screen-grad" x1="0" x2="1">
                  <stop offset="0%" stopColor="#FF3D54" />
                  <stop offset="50%" stopColor="#FF2E93" />
                  <stop offset="100%" stopColor="#7B5CFF" />
                </linearGradient>
              </defs>
              <path d="M10 50 Q300 0 590 50" fill="none" stroke="url(#screen-grad)" strokeWidth="4" strokeLinecap="round" />
            </svg>
            {/* sorotan cahaya dari layar ke kursi */}
            <div className="absolute inset-x-[10%] top-6 h-32 bg-linear-to-b from-hot/25 to-transparent blur-2xl [clip-path:polygon(8%_0,92%_0,100%_100%,0_100%)]" />
            <p className="relative mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.6em] text-white/45">Screen</p>
          </div>

          {/* kursi, sedikit dimiringkan biar terasa 3D */}
          <div className="no-scrollbar overflow-x-auto pb-2">
            <div className="mx-auto w-max [perspective:1200px]">
              <div className="flex flex-col gap-2.5 [transform:rotateX(14deg)] [transform-origin:top]">
                {ROWS.map((row, ri) => (
                  <motion.div
                    key={row}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + ri * 0.04, ease }}
                    className="flex items-center gap-6 md:gap-8"
                  >
                    <span className="w-4 text-center text-[11px] font-semibold text-white/35">{row}</span>
                    {BLOCKS.map(([from, to]) => (
                      <div key={from} className="flex gap-1.5 md:gap-2">
                        {Array.from({ length: to - from + 1 }, (_, k) => {
                          const seat = `${row}${from + k}`
                          const isTaken = taken.has(seat)
                          const isSel = selected.includes(seat)
                          return (
                            <motion.button
                              key={seat}
                              onClick={() => toggle(seat)}
                              disabled={isTaken}
                              aria-label={`Seat ${seat}${isTaken ? ', taken' : ''}`}
                              aria-pressed={isSel}
                              whileHover={isTaken ? undefined : { scale: 1.2, y: -2 }}
                              whileTap={isTaken ? undefined : { scale: 0.85 }}
                              animate={isSel ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                              transition={{ duration: 0.3 }}
                              className={`relative h-7 w-7 rounded-t-[10px] rounded-b-md text-[9px] font-bold transition-colors md:h-8 md:w-8 ${
                                isTaken
                                  ? 'cursor-not-allowed bg-white/[0.06] text-white/20'
                                  : isSel
                                    ? 'bg-linear-to-br from-brand via-hot to-violet text-white shadow-[0_0_18px_-2px_var(--color-hot)]'
                                    : 'bg-white/15 text-transparent hover:bg-white/30 hover:text-white/80'
                              }`}
                            >
                              {isTaken ? '×' : from + k}
                            </motion.button>
                          )
                        })}
                      </div>
                    ))}
                    <span className="w-4 text-center text-[11px] font-semibold text-white/35">{row}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* keterangan warna */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-white/60">
            <Legend className="bg-white/15" label="Available" />
            <Legend className="bg-linear-to-br from-brand via-hot to-violet shadow-[0_0_10px_var(--color-hot)]" label="Selected" />
            <Legend className="bg-white/[0.06]" label="Taken" />
            <span className="text-white/40">Max {MAX_SEATS} seats per booking</span>
          </div>
        </motion.section>
      </div>

      {/* peringatan maksimal kursi */}
      <AnimatePresence>
        {warning && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed left-1/2 top-24 z-50 rounded-full border border-white/15 bg-ink/90 px-5 py-3 text-sm font-semibold backdrop-blur-xl"
          >
            You can book up to {MAX_SEATS} seats at once.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= BAR RINGKASAN BAWAH ================= */}
      <motion.div
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 28, delay: 0.5 }}
        className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:px-6 md:pb-6"
      >
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/15 bg-ink/80 p-4 pl-6 shadow-[0_-10px_60px_-20px_var(--color-hot)] backdrop-blur-xl">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
              {selected.length ? `${selected.length} seat${selected.length > 1 ? 's' : ''} · ${rupiah(booking.price)} each` : 'No seats selected yet'}
            </p>
            <div className="flex min-h-7 flex-wrap gap-1.5">
              <AnimatePresence mode="popLayout">
                {sorted.map((s) => (
                  <motion.button
                    key={s}
                    layout
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={() => toggle(s)}
                    aria-label={`Remove seat ${s}`}
                    className="flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/10 pl-2.5 pr-2 text-xs font-bold hover:bg-white/20"
                  >
                    {s} <span className="text-white/50">×</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Total</p>
              <motion.p key={total} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-xl font-semibold">
                {rupiah(total)}
              </motion.p>
            </div>
            <motion.button
              whileHover={selected.length ? { scale: 1.04 } : undefined}
              whileTap={selected.length ? { scale: 0.97 } : undefined}
              onClick={goToPayment}
              disabled={!selected.length}
              className="flex h-12 items-center gap-2 rounded-full bg-linear-to-r from-brand via-hot to-violet px-7 text-sm font-bold shadow-[0_0_40px_-8px_var(--color-hot)] transition-opacity disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
            >
              Continue <span aria-hidden>→</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

function Legend({ className, label }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-4 w-4 rounded-t-md rounded-b-sm ${className}`} />
      {label}
    </span>
  )
}