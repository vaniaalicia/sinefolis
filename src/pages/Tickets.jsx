import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useApp } from '../context/AppContext'
import PosterArt from '../components/PosterArt'
import ReviewModal from '../components/ReviewModal'
import { rupiah } from '../data/dummy'

const ease = [0.22, 1, 0.36, 1]

export default function Tickets() {
  const { user, bookings, addReview, markReviewed } = useApp()
  const [tab, setTab] = useState('upcoming')
  const [reviewFor, setReviewFor] = useState(null)

  const list = bookings.filter((b) => (tab === 'upcoming' ? !b.past : b.past))

  return (
    <main className="relative min-h-[80svh] overflow-x-clip pb-32 pt-32">
      <div className="pointer-events-none absolute -left-32 top-24 h-[420px] w-[420px] animate-aurora rounded-full bg-violet/20 blur-[120px]" />

      <div className="relative mx-auto flex max-w-[880px] flex-col gap-10 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <h1 className="font-display text-3xl font-semibold uppercase leading-none tracking-tight md:text-[40px]">
            My <span className="text-gradient">tickets</span>
          </h1>
          <p className="text-white/55">Your bookings and ticket history.</p>
        </motion.div>

        <>
            <div className="mx-auto flex rounded-full border border-white/10 bg-white/[0.03] p-1">
              {[
                ['upcoming', 'Upcoming'],
                ['past', 'History'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`relative rounded-full px-6 py-2.5 text-[13px] font-semibold transition-colors ${tab === key ? 'text-white' : 'text-white/55 hover:text-white'}`}
                >
                  {tab === key && (
                    <motion.span layoutId="ticket-tab" className="absolute inset-0 rounded-full bg-linear-to-r from-brand via-hot to-violet" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="flex flex-col gap-4">
                  {list.length === 0 && (
                    <div className="flex flex-col items-center gap-4 py-10 text-center text-white/55">
                      <p>{tab === 'upcoming' ? 'No upcoming tickets.' : 'No past tickets yet.'}</p>
                      <Link to="/#movies" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
                        Book a movie
                      </Link>
                    </div>
                  )}

                  {list.map((b) => (
                    <article
                      key={b.bookingCode}
                      className="flex flex-wrap items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md"
                    >
                      <div className="h-24 w-16 shrink-0 overflow-hidden rounded-xl">
                        <PosterArt src={b.movie.poster} title="" hue={b.movie.hue} />
                      </div>
                      <div className="flex min-w-[200px] flex-1 flex-col gap-1">
                        <p className="font-semibold">{b.movie.title}</p>
                        <p className="text-sm text-white/55">
                          {b.cinema} {b.hall} · {b.date} · {b.time}
                        </p>
                        <p className="text-sm text-white/55">
                          Seats {b.seats.join(', ')} · {rupiah(b.grandTotal)}
                        </p>
                        <p className="text-xs tracking-wider text-white/35">{b.bookingCode}</p>
                      </div>

                      {b.past ? (
                        b.reviewed ? (
                          <span className="rounded-full bg-[#5BE49B]/10 px-4 py-2 text-xs font-semibold text-[#5BE49B]">Reviewed</span>
                        ) : (
                          <button
                            onClick={() => setReviewFor(b)}
                            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
                          >
                            Write a review
                          </button>
                        )
                      ) : (
                        <span className="rounded-full bg-linear-to-r from-brand/20 to-violet/20 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/10">
                          E-ticket ready
                        </span>
                      )}
                    </article>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
        </>
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