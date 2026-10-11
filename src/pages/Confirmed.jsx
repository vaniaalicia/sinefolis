import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import ETicket from '../components/ETicket'
import ReviewModal from '../components/ReviewModal'
import { useApp } from '../context/AppContext'
import { featured } from '../data/dummy'

const ease = [0.22, 1, 0.36, 1]

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
        <ETicket booking={b} delay={0.8} />

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