import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1]

/* =========================================================
   Banner iklan besar yang bergeser otomatis
   ========================================================= */
export function AdCarousel({ ads }) {
  const [i, setI] = useState(0)
  const ad = ads[i]

  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % ads.length), 5000)
    return () => clearTimeout(t)
  }, [i, ads.length])

  return (
    <div className="relative overflow-hidden rounded-[28px]">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.a
          key={ad.id}
          href={ad.href}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.7, ease }}
          className="group relative flex min-h-[260px] flex-col items-center justify-center gap-4 overflow-hidden px-8 py-14 text-center md:min-h-[300px]"
          style={{ background: `linear-gradient(120deg, ${ad.from}, ${ad.via} 50%, ${ad.to})` }}
        >
          {/* tekstur & cahaya */}
          <div className="bg-grid absolute inset-0 opacity-40" />
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/25 blur-3xl transition-transform duration-700 group-hover:translate-x-10" />
          <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-black/25 blur-3xl" />

          <span className="relative rounded-full bg-black/25 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">{ad.eyebrow}</span>
          <p className="relative font-display text-2xl font-semibold uppercase leading-tight tracking-tight md:text-4xl">{ad.title}</p>
          <p className="relative max-w-md text-sm text-white/85 md:text-base">{ad.desc}</p>
          <span className="relative mt-2 flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-ink transition-transform group-hover:scale-105">
            {ad.cta} →
          </span>
        </motion.a>
      </AnimatePresence>

      {/* titik penanda slide */}
      <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
        {ads.map((a, idx) => (
          <button
            key={a.id}
            onClick={() => setI(idx)}
            aria-label={`Show ad ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${idx === i ? 'w-8 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  )
}

/* =========================================================
   Kartu promo berwarna + tombol View details
   ========================================================= */
export function PromoCard({ promo, index = 0 }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease }}
        whileHover={{ y: -6 }}
        className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface"
        style={{ boxShadow: `0 30px 60px -40px ${promo.from}` }}
      >
        <div
          className="relative flex min-h-[150px] flex-col justify-between gap-6 overflow-hidden p-6"
          style={{ background: `linear-gradient(135deg, ${promo.from}, ${promo.to})` }}
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl transition-transform duration-700 group-hover:scale-150" />
          <span className="relative self-start rounded-full bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-md">
            {promo.category}
          </span>
          <p className="relative font-display text-xl font-semibold uppercase leading-tight tracking-tight">{promo.title}</p>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <p className="text-sm leading-relaxed text-white/60">{promo.desc}</p>
          <div className="mt-auto flex items-center justify-between gap-3">
            <p className="text-xs text-white/40">Valid until {promo.until}</p>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setOpen(true)}
              className="h-10 shrink-0 rounded-full bg-white px-5 text-[13px] font-bold text-ink transition-colors hover:bg-white/85"
            >
              View details
            </motion.button>
          </div>
        </div>
      </motion.article>

      <PromoModal promo={promo} open={open} onClose={() => setOpen(false)} />
    </>
  )
}

/* =========================================================
   Popup detail promo: deskripsi → syarat & ketentuan → kode
   ========================================================= */
function PromoModal({ promo, open, onClose }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(promo.code)
    } catch {
      /* clipboard bisa diblokir browser */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // createPortal: popup dipasang langsung di <body> supaya selalu di atas semua elemen
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/70 p-6 backdrop-blur-md"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/10 bg-ink"
          >
            <div className="relative overflow-hidden p-7" style={{ background: `linear-gradient(135deg, ${promo.from}, ${promo.to})` }}>
              <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/25 text-lg backdrop-blur-md hover:bg-black/40"
              >
                ×
              </button>
              <span className="relative rounded-full bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-md">{promo.category}</span>
              <p className="relative mt-5 font-display text-2xl font-semibold uppercase leading-tight tracking-tight">{promo.title}</p>
              <p className="relative mt-2 text-sm text-white/85">{promo.desc}</p>
            </div>

            <div className="flex flex-col gap-6 p-7">
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Terms & conditions</p>
                <ul className="flex flex-col gap-2 text-sm text-white/70">
                  {promo.terms.map((t) => (
                    <li key={t} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: promo.from }} />
                      {t}
                    </li>
                  ))}
                  <li className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: promo.from }} />
                    Valid until {promo.until}.
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Promo code</p>
                  <p className="mt-1 font-display text-xl font-semibold tracking-wider">{promo.code}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={copy}
                  className={`h-11 min-w-[110px] rounded-full px-5 text-sm font-bold transition-colors ${
                    copied ? 'bg-white/15 text-white' : 'bg-white text-ink hover:bg-white/85'
                  }`}
                >
                  {copied ? 'Copied' : 'Copy code'}
                </motion.button>
              </div>

              <p className="text-center text-xs text-white/45">
                {promo.discount ? 'Paste this code in the Promo code box at checkout.' : 'Show this code at the cinema to redeem.'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
