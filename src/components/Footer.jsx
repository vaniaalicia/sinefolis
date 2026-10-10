import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

const links = [
  { label: 'Now showing', href: '/#movies' },
  { label: 'Coming soon', href: '/#coming-soon' },
  { label: 'Promotions', href: '/promotions' },
  { label: 'Cinemas', href: '/#cinemas' },
  { label: 'FAQ', href: '#' },
  { label: 'Contact', href: '#' },
]

// tiap sosmed punya warna hover sendiri
const socials = [
  { label: 'Instagram', color: '#FF2E93' },
  { label: 'TikTok', color: '#3DE3FF' },
  { label: 'YouTube', color: '#FF3D54' },
  { label: 'X', color: '#FFFFFF' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  return (
    <footer className="relative overflow-hidden bg-ink">
      {/* garis cahaya di atas footer */}
      <div className="h-px bg-linear-to-r from-transparent via-hot to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-hot/20 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 animate-aurora rounded-full bg-violet/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 animate-aurora rounded-full bg-cyan/15 blur-[100px] [animation-delay:-8s]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto flex max-w-[880px] flex-col items-center gap-10 px-6 pb-14 pt-20 text-center"
      >
        {/* logo + tagline */}
        <div className="flex flex-col items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-brand to-violet shadow-[0_0_14px_var(--color-hot)]" />
            <span className="font-display text-lg font-semibold tracking-tight">Sinéfolis</span>
          </Link>
          <p className="text-sm text-white/50">Your cinema, reimagined.</p>
        </div>

        {/* menu */}
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-sm text-white/65 transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        {/* newsletter */}
        <div className="flex w-full max-w-md flex-col items-center gap-3">
          <p className="text-sm font-semibold">Get new releases & deals in your inbox</p>
          {joined ? (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex h-12 items-center gap-2 text-sm font-semibold text-[#5BE49B]">
              ✓ You're on the list
            </motion.p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (email.includes('@')) setJoined(true)
              }}
              className="flex w-full gap-2 rounded-full border border-white/15 bg-white/[0.04] p-1.5 backdrop-blur-md focus-within:border-white/35"
            >
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-white/35"
              />
              <button className="h-10 shrink-0 rounded-full bg-linear-to-r from-brand via-hot to-violet px-5 text-[13px] font-bold">
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* sosmed */}
        <div className="flex flex-wrap justify-center gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href="#"
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/70 transition-all hover:-translate-y-0.5 hover:text-white"
              style={{ '--c': s.color }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--c)] shadow-[0_0_8px_var(--c)]" />
              {s.label}
            </a>
          ))}
        </div>

        <p className="text-xs text-white/40">Plaza Indonesia · Mall of Indonesia · Senayan Park</p>
      </motion.div>

      {/* baris bawah */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[880px] flex-col items-center gap-2 px-6 py-6 text-center text-xs text-white/40">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            <span>© {new Date().getFullYear()} Sinéfolis</span>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
          <p className="text-[11px] text-white/30">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  )
}