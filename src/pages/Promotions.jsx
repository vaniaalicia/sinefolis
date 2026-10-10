import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AdCarousel, PromoCard } from '../components/Promo'
import { ads, promos } from '../data/dummy'

const ease = [0.22, 1, 0.36, 1]
const categories = ['All', 'Movies', 'Food & Beverage', 'Payment', 'Event']

export default function Promotions() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const q = query.trim().toLowerCase()
  const list = promos.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      (!q || p.code.toLowerCase().includes(q) || p.title.toLowerCase().includes(q)),
  )

  return (
    <main className="relative overflow-x-clip pb-32 pt-28">
      <div className="pointer-events-none absolute -left-40 top-20 h-[460px] w-[460px] animate-aurora rounded-full bg-[#FF9F43]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-[500px] h-[460px] w-[460px] animate-aurora rounded-full bg-cyan/15 blur-[120px] [animation-delay:-8s]" />

      <div className="relative mx-auto flex max-w-[1180px] flex-col gap-12 px-6 md:px-12">
        {/* judul tengah */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
            Deals & vouchers
          </span>
          <h1 className="font-display text-3xl font-semibold uppercase leading-none tracking-tight md:text-[44px]">
            Promo<span className="text-gradient">tions</span>
          </h1>
          <p className="max-w-md text-white/55">Save on tickets, snacks, and more. Copy a code and use it at checkout.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease }}>
          <AdCarousel ads={ads} />
        </motion.div>

        {/* cari kode + filter kategori */}
        <div className="flex flex-col items-center gap-5">
          <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-white/15 bg-black/30 px-5 focus-within:border-white/35">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/45">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <label htmlFor="promo-search" className="sr-only">Search promo</label>
            <input
              id="promo-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search promo or code"
              className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((c) => {
              const active = c === category
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={active}
                  className={`relative rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors ${
                    active ? 'text-white' : 'border border-white/12 text-white/60 hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="promo-cat"
                      className="absolute inset-0 rounded-full bg-linear-to-r from-brand via-hot to-violet"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{c}</span>
                </button>
              )
            })}
          </div>
        </div>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {list.map((p, idx) => (
              <PromoCard key={p.id} promo={p} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>

        {list.length === 0 && <p className="text-center text-white/50">No promotions match your search.</p>}
      </div>
    </main>
  )
}
