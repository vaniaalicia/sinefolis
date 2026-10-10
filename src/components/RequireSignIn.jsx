import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'

// Tampilan untuk halaman yang butuh login (Watchlist, My tickets)
export default function RequireSignIn({ title, text }) {
  const { pathname } = useLocation()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-md flex-col items-center gap-5 rounded-[28px] border border-white/10 bg-white/[0.03] px-8 py-12 text-center backdrop-blur-md"
    >
      <span className="grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      </span>
      <div className="flex flex-col gap-2">
        <p className="font-display text-lg font-semibold uppercase tracking-tight">{title}</p>
        <p className="text-sm text-white/55">{text}</p>
      </div>
      <Link
        to="/signin"
        state={{ from: pathname }}
        className="flex h-11 items-center rounded-full bg-linear-to-r from-brand via-hot to-violet px-6 text-sm font-bold"
      >
        Sign in or sign up
      </Link>
    </motion.div>
  )
}
