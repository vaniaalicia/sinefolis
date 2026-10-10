import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import PosterArt from '../components/PosterArt'
import ReviewModal from '../components/ReviewModal'
import { useApp } from '../context/AppContext'
import { featured, rupiah } from '../data/dummy'

const ease = [0.22, 1, 0.36, 1]

// QR code "palsu" tapi konsisten berdasarkan kode booking (untuk tampilan saja)
function fakeQR(seed, size = 25) {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const cells = []
  const finder = (x, y, ox, oy) => {
    const dx = x - ox
    const dy = y - oy
    if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null
    return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let f = finder(x, y, 0, 0) ?? finder(x, y, size - 7, 0) ?? finder(x, y, 0, size - 7)
      if (f === null) {
        const nearFinder = (x < 8 && y < 8) || (x > size - 9 && y < 8) || (x < 8 && y > size - 9)
        h = (h * 1103515245 + 12345) >>> 0
        f = nearFinder ? false : h % 100 < 48
      }
      cells.push(f)
    }
  }
  return cells
}

export default function Confirmed() {
  const { state } = useLocation()
  const b = state ?? {
    movie: featured[0],
    cinema: 'Plaza Indonesia',
    hall: 'IMAX',
    date: 'Today',
    time: '20:30',
    seats: ['E6', 'E7'],
    grandTotal: 208000,
    bookingCode: 'SNF-7DV90K',
  }

  const qr = useMemo(() => fakeQR(b.bookingCode), [b.bookingCode])


  const { user, addBooking, addReview } = useApp()
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewed, setReviewed] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // simpan tiket ke riwayat "My tickets" (sekali saja per kode booking)
  useEffect(() => {
    if (state?.bookingCode) {
      addBooking({
        bookingCode: state.bookingCode,
        movie: state.movie,
        cinema: state.cinema,
        hall: state.hall,
        date: state.date,
        time: state.time,
        seats: state.seats,
        grandTotal: state.grandTotal,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.bookingCode])

  return (
    <main className="relative overflow-hidden pb-32 pt-36">
      <div className="pointer-events-none absolute left-1/2 top-40 h-[520px] w-[520px] -translate-x-1/2 animate-aurora rounded-full bg-hot/20 blur-[140px]" />

      <div className="relative mx-auto flex max-w-[1080px] flex-col items-center gap-12 px-6 md:px-12">
        {/* status pembayaran */}
        <div className="relative flex flex-col items-center gap-5 text-center">

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2 rounded-full border border-[#5BE49B]/30 bg-[#5BE49B]/10 px-4 py-1.5 text-xs font-semibold text-[#5BE49B]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#5BE49B]" />
            Payment successful
          </motion.span>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease }} className="flex flex-col gap-3">
            <h1 className="font-display text-3xl font-semibold uppercase leading-none tracking-tight md:text-[40px]">
              You're all <span className="text-gradient">set!</span>
            </h1>
            <p className="text-white/60">Your tickets are confirmed. A copy has been sent to your email.</p>
          </motion.div>
        </div>

        {/* ================= TIKET ================= */}
        <motion.article
          aria-label="Your ticket"
          initial={{ opacity: 0, y: 60, rotateX: 25 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.8, ease }}
          style={{ transformPerspective: 1200 }}
          className="relative w-full max-w-[760px]"
        >
          <div className="rounded-[30px] bg-linear-to-br from-brand via-hot to-violet p-px shadow-[0_40px_120px_-40px_var(--color-hot)]">
            <div className="grid overflow-hidden rounded-[29px] bg-ink md:grid-cols-[1fr_auto]">
              {/* bagian kiri tiket */}
              <div className="flex gap-5 p-6 md:p-8">
                <div className="hidden h-40 w-28 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:block">
                  <PosterArt src={b.movie.poster} title="" hue={b.movie.hue} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">Sinéfolis · e-ticket</p>
                    <p className="mt-1.5 font-display text-xl font-semibold uppercase leading-tight tracking-tight">{b.movie.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
                    <Info label="Cinema" value={`${b.cinema} ${b.hall}`} />
                    <Info label="Date" value={b.date} />
                    <Info label="Time" value={b.time} />
                    <Info label="Seats" value={b.seats.join(', ')} />
                    <Info label="Paid" value={rupiah(b.grandTotal)} />
                    <Info label="Booking code" value={b.bookingCode} mono />
                  </div>
                </div>
              </div>

              {/* sobekan tiket */}
              <div className="relative flex items-center justify-center border-t-2 border-dashed border-white/15 p-6 md:border-l-2 md:border-t-0 md:p-8">
                <span className="absolute -left-3 -top-3 hidden h-6 w-6 rounded-full bg-ink md:-left-3 md:-top-3 md:block" />
                <span className="absolute -bottom-3 -left-3 hidden h-6 w-6 rounded-full bg-ink md:block" />
                <div className="flex flex-col items-center gap-3">
                  <div role="img" aria-label="Ticket QR code" className="rounded-2xl bg-white p-3">
                    <div className="grid grid-cols-[repeat(25,5px)] grid-rows-[repeat(25,5px)]">
                      {qr.map((on, i) => (
                        <span key={i} className={on ? 'bg-ink' : 'bg-white'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-white/45">Show this at the entrance</p>
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        {/* tombol */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease }}
          className="flex flex-wrap justify-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.print()}
            className="flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold backdrop-blur-md hover:bg-white/10"
          >
            Download ticket
          </motion.button>
          <Link
            to="/tickets"
            className="flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold backdrop-blur-md hover:bg-white/10"
          >
            My tickets
          </Link>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/"
              className="flex h-12 items-center gap-2 rounded-full bg-linear-to-r from-brand via-hot to-violet px-7 text-sm font-bold shadow-[0_0_40px_-8px_var(--color-hot)]"
            >
              Back to home →
            </Link>
          </motion.div>
        </motion.div>

        {/* ajakan review (opsional) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease }}
          className="flex w-full max-w-[760px] flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md"
        >
          <div>
            <p className="font-semibold">{reviewed ? 'Thanks for your review!' : 'How was your booking experience?'}</p>
            <p className="text-sm text-white/50">{reviewed ? 'It now appears on the home page.' : 'Leave a quick rating. It helps other moviegoers.'}</p>
          </div>
          {!reviewed && (
            <button
              onClick={() => setReviewOpen(true)}
              className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              <span className="text-[#FFC94D]">★</span> Write a review
            </button>
          )}
        </motion.div>

        <ReviewModal
          open={reviewOpen}
          movieTitle={b.movie.title}
          defaultName={user?.name}
          onClose={() => setReviewOpen(false)}
          onSubmit={(r) => {
            addReview(r)
            setReviewed(true)
            setReviewOpen(false)
          }}
        />
      </div>
    </main>
  )
}

function Info({ label, value, mono }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className={`mt-1 truncate font-semibold ${mono ? 'tracking-wider' : ''}`}>{value}</p>
    </div>
  )
}