import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useApp } from '../context/AppContext'
import ETicket from '../components/ETicket'
import ReviewModal from '../components/ReviewModal'

const ease = [0.22, 1, 0.36, 1]

export default function Tickets() {
  const { user, bookings, addReview, markReviewed } = useApp()
  const [tab, setTab] = useState('upcoming')
  const [reviewFor, setReviewFor] = useState(null)

  const list = bookings.filter((b) => (tab === 'upcoming' ? !b.past : b.past))

  return (
    <main className="relative min-h-[80svh] overflow-x-clip pb-32 pt-32">
      <div className="pointer-events-none absolute -left-32 top-24 h-[420px] w-[420px] animate-aurora rounded-full bg-violet/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-[520px] h-[420px] w-[420px] animate-aurora rounded-full bg-hot/15 blur-[120px] [animation-delay:-8s]" />

      <div className="relative mx-auto flex max-w-[1080px] flex-col items-center gap-10 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <h1 className="font-display text-3xl font-semibold uppercase leading-none tracking-tight md:text-[40px]">
            My <span className="text-gradient">tickets</span>
          </h1>
          <p className="text-white/55">Show the QR code at the cinema entrance.</p>
        </motion.div>

        {/* tab upcoming / history */}
        <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
          {[
            ['upcoming', 'Upcoming'],
            ['past', 'History'],
          ].map(([key, label]) => {
            const count = bookings.filter((b) => (key === 'upcoming' ? !b.past : b.past)).length
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative rounded-full px-6 py-2.5 text-[13px] font-semibold transition-colors ${tab === key ? 'text-white' : 'text-white/55 hover:text-white'}`}
              >
                {tab === key && (
                  <motion.span layoutId="ticket-tab" className="absolute inset-0 rounded-full bg-linear-to-r from-brand via-hot to-violet" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <span className="relative">
                  {label} <span className="opacity-60">({count})</span>
                </span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex w-full flex-col items-center gap-10"
          >
            {list.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-10 text-center text-white/55">
                <p>{tab === 'upcoming' ? 'No upcoming tickets.' : 'No past tickets yet.'}</p>
                <Link to="/#movies" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
                  Book a movie
                </Link>
              </div>
            )}

            {list.map((b, idx) => (
              <div key={b.bookingCode} className="flex w-full flex-col items-center gap-4">
                <ETicket booking={b} used={b.past} delay={Math.min(idx, 3) * 0.1} />

                {/* aksi di bawah tiket */}
                <div className="flex flex-wrap justify-center gap-2">
                  {b.past ? (
                    b.reviewed ? (
                      <span className="rounded-full bg-[#5BE49B]/10 px-4 py-2 text-xs font-semibold text-[#5BE49B]">Review posted</span>
                    ) : (
                      <button
                        onClick={() => setReviewFor(b)}
                        className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
                      >
                        <span className="text-[#FFC94D]">★</span> Write a review
                      </button>
                    )
                  ) : (
                    <>
                      <button
                        onClick={() => window.print()}
                        className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
                      >
                        Download ticket
                      </button>
                      <Link
                        to={`/movie/${b.movie.id}`}
                        className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
                      >
                        Movie details
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <ReviewModal
        open={!!reviewFor}
        movieTitle={reviewFor?.movie.title}
        defaultName={user?.name}
        onClose={() => setReviewFor(null)}
        onSubmit={(r) => {
          addReview(r)
          markReviewed(reviewFor.bookingCode)
          setReviewFor(null)
        }}
      />
    </main>
  )
}