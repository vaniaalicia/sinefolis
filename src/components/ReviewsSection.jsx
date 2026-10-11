import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useApp } from '../context/AppContext'
import ReviewModal from './ReviewModal'

const ease = [0.22, 1, 0.36, 1]
const AVATAR_COLORS = ['#FF3D54', '#7B5CFF', '#3DE3FF', '#FFC94D', '#5BE49B', '#FF2E93']

function Stars({ value }) {
  return (
    <span className="text-sm tracking-[0.15em]" aria-label={`${value} out of 5 stars`}>
      <span className="text-[#FFC94D]">{'★'.repeat(value)}</span>
      <span className="text-white/15">{'★'.repeat(5 - value)}</span>
    </span>
  )
}

// Section "What people say" di Home
export default function ReviewsSection() {
  const { user, reviews, addReview } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  const shown = showAll ? reviews : reviews.slice(0, 3)

  function handleWrite() {
    if (!user) navigate('/signin', { state: { from: '/', reason: 'Sign in to write a review.' } })
    else setOpen(true)
  }

  return (
    <section id="reviews" className="relative mx-auto flex max-w-[1280px] scroll-mt-32 flex-col items-center gap-10 px-6 pb-24 md:px-12">
      <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-[520px] -translate-x-1/2 rounded-full bg-[#FFC94D]/10 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease }}
        className="relative flex flex-col items-center gap-5 text-center"
      >
        <span className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFC94D] shadow-[0_0_10px_#FFC94D]" />
          Audience reviews
        </span>
        <h2 className="font-display text-2xl font-semibold uppercase leading-none tracking-tight md:text-[34px]">
          What people <span className="text-gradient">say</span>
        </h2>
        <div className="flex items-center gap-3 text-sm text-white/60">
          <span className="font-display text-2xl font-semibold text-white">{avg.toFixed(1)}</span>
          <Stars value={Math.round(avg)} />
          <span>· {reviews.length} reviews</span>
        </div>
      </motion.div>

      <motion.div layout className="grid w-full gap-5 md:grid-cols-3">
        <AnimatePresence initial={false}>
          {shown.map((r, idx) => (
            <motion.article
              key={r.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.08, ease }}
              whileHover={{ y: -6 }}
              className="relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md"
            >
              <span className="absolute -right-1 -top-7 font-display text-8xl leading-none text-white/[0.05]">"</span>
              <div className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold uppercase text-ink"
                  style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                >
                  {r.name[0]}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{r.name}</p>
                  <p className="truncate text-xs text-white/40">
                    {r.movie ? `${r.movie} · ` : ''}
                    {r.date}
                  </p>
                </div>
              </div>
              <Stars value={r.rating} />
              <p className="text-sm leading-relaxed text-white/70">{r.text}</p>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3">
        {reviews.length > 3 && (
          <button onClick={() => setShowAll((s) => !s)} className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold hover:bg-white/10">
            {showAll ? 'Show less' : `See all ${reviews.length} reviews`}
          </button>
        )}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleWrite}
          className="rounded-full bg-linear-to-r from-brand via-hot to-violet px-6 py-3 text-sm font-bold"
        >
          Write a review
        </motion.button>
      </div>

      <ReviewModal
        open={open}
        defaultName={user?.name}
        onClose={() => setOpen(false)}
        onSubmit={(r) => {
          addReview(r)
          setOpen(false)
          setShowAll(false)
        }}
      />
    </section>
  )
}